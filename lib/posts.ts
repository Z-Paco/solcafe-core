import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

export type ContentType = Database["public"]["Tables"]["posts"]["Row"]["content_type"];
export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
export type PostWithProfile = PostRow & {
  profiles?: { username: string | null; display_name: string | null } | null;
};

const LIST_COLUMNS =
  "id, title, description, slug, image_url, tags, metadata, created_at, user_id";

/** Published posts of one type, newest first. Never throws; errors return []. */
export async function listPublished(type: ContentType, limit?: number) {
  // Outside the try: cookies() signals dynamic rendering by throwing during
  // prerender, and that signal must not be swallowed.
  const supabase = await createClient();
  try {
    let query = supabase
      .from("posts")
      .select(LIST_COLUMNS)
      .eq("content_type", type)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return { posts: (data ?? []) as PostRow[], error: null };
  } catch (err) {
    console.error(`Failed to load ${type} posts:`, err);
    return { posts: [] as PostRow[], error: "Couldn't load posts right now." };
  }
}

/**
 * One post by slug for the current viewer. Drafts are returned only to their
 * owner; everyone else gets null (render notFound()). Wrapped in cache() so
 * generateMetadata and the page share one query per request.
 */
export const getPostForViewer = cache(
  async (type: ContentType, slug: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(username, display_name)")
      .eq("slug", slug)
      .eq("content_type", type)
      .maybeSingle();

    if (error) throw error;
    const post = data as PostWithProfile | null;
    if (!post) return null;

    if (!post.published) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || user.id !== post.user_id) return null;
    }

    return post;
  }
);

export type PostLink = Pick<
  PostRow,
  "id" | "title" | "slug" | "image_url" | "tags" | "created_at" | "content_type"
>;
const LINK_COLUMNS = "id, title, slug, image_url, tags, created_at, content_type";

/**
 * Older and newer published post of the same type, for previous/next
 * navigation. Never throws: navigation is optional chrome.
 */
export async function getAdjacent(post: Pick<PostRow, "content_type" | "created_at">) {
  const supabase = await createClient();
  try {
    const base = () =>
      supabase
        .from("posts")
        .select(LINK_COLUMNS)
        .eq("content_type", post.content_type)
        .eq("published", true);
    const [older, newer] = await Promise.all([
      base().lt("created_at", post.created_at).order("created_at", { ascending: false }).limit(1),
      base().gt("created_at", post.created_at).order("created_at", { ascending: true }).limit(1),
    ]);
    return {
      older: ((older.data ?? [])[0] ?? null) as PostLink | null,
      newer: ((newer.data ?? [])[0] ?? null) as PostLink | null,
    };
  } catch (err) {
    console.error("Failed to load adjacent posts:", err);
    return { older: null, newer: null };
  }
}

/**
 * Up to `limit` other published posts, preferring shared tags and topping up
 * with the newest posts. Never throws.
 */
export async function getRelated(
  post: Pick<PostRow, "id" | "tags">,
  limit = 3
): Promise<PostLink[]> {
  const supabase = await createClient();
  try {
    const tags = (post.tags ?? []).filter(Boolean);
    let picked: PostLink[] = [];
    if (tags.length > 0) {
      const { data } = await supabase
        .from("posts")
        .select(LINK_COLUMNS)
        .eq("published", true)
        .neq("id", post.id)
        .overlaps("tags", tags)
        .order("created_at", { ascending: false })
        .limit(limit);
      picked = (data ?? []) as PostLink[];
    }
    if (picked.length < limit) {
      const { data } = await supabase
        .from("posts")
        .select(LINK_COLUMNS)
        .eq("published", true)
        .neq("id", post.id)
        .order("created_at", { ascending: false })
        .limit(limit + picked.length);
      const have = new Set(picked.map((p) => p.id));
      for (const row of (data ?? []) as PostLink[]) {
        if (picked.length >= limit) break;
        if (!have.has(row.id)) picked.push(row);
      }
    }
    return picked;
  } catch (err) {
    console.error("Failed to load related posts:", err);
    return [];
  }
}
