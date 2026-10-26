// Shared helpers for the unified post editor (/write).
// Field limits, slugs, image upload and per-type validation live here so the
// News, Art and Engineering tabs all follow the same rules.
import type { SupabaseClient } from "@supabase/supabase-js";
import { asArray, asRecord, SECTION_PATH } from "@/lib/content";

export type PostType = keyof typeof SECTION_PATH;

export const POST_TYPES: PostType[] = ["news", "art", "engineering"];

export const LIMITS = {
  title: 100,
  description: 5000,
  tags: 200,
} as const;

/** URL segments (/write?type=engineer) map to content types. */
export function typeFromParam(param: unknown): PostType {
  const value = Array.isArray(param) ? param[0] : param;
  if (value === "art") return "art";
  if (value === "engineer" || value === "engineering") return "engineering";
  return "news";
}

export function createSlug(title: string) {
  const slug = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .trim()
    .replace(/ +/g, "-");
  return slug || "post";
}

/**
 * Append -2, -3, ... until no other post uses the slug. The check spans every
 * type because public.posts has a single unique index on slug (posts_slug_key).
 */
export async function uniqueSlug(
  supabase: SupabaseClient,
  base: string,
  excludeId?: string
) {
  for (let n = 1; n < 50; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    let query = supabase
      .from("posts")
      .select("id")
      .eq("slug", candidate)
      .limit(1);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) return candidate;
  }
  return `${base}-${Date.now()}`;
}

/** Upload to the post-images bucket under the author's folder; returns the public URL. */
export async function uploadPostImage(
  supabase: SupabaseClient,
  userId: string,
  file: File,
  prefix = "cover"
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${prefix}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, file, { cacheControl: "3600", upsert: true });
  if (error) throw new Error("Failed to upload cover image");
  return supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl;
}

/**
 * Cover used when the author has not chosen one: first link image (news),
 * first image (art), first schematic (engineering).
 */
export function fallbackCover(type: PostType, content: unknown): string {
  const c = asRecord(content);
  let url: unknown;
  if (type === "news") url = asArray(c.relatedLinks)[0]?.imageUrl;
  else if (type === "art") url = asArray(c.images)[0]?.url;
  else url = asArray(c.schematics)[0]?.url;
  return typeof url === "string" ? url : "";
}

/** Block-level checks that the type editors do not already cover. */
export function contentProblem(type: PostType, content: unknown): string | null {
  const c = asRecord(content);
  if (type === "news") {
    if (!c.mainContent && asArray(c.relatedLinks).length === 0) {
      return "Main content or at least one related link is required";
    }
  } else if (type === "art") {
    if (asArray(c.images).length === 0) return "At least one image is required";
  } else {
    const first = asArray(c.steps)[0];
    if (!c.overview || !first?.description) {
      return "Project overview and at least one step are required";
    }
  }
  return null;
}

/** Storage paths owned by a post's metadata (art images, schematics). */
export function storagePaths(content: unknown): string[] {
  const c = asRecord(content);
  return [...asArray(c.images), ...asArray(c.schematics)]
    .map((item) => item.path)
    .filter((p): p is string => typeof p === "string" && p.length > 0);
}
