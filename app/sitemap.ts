import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import type { PostRow } from "@/lib/posts";
import { SECTION_PATH } from "@/lib/content";

const SITE_URL = "https://www.solcafe.ca";

// Rendered per request so new posts appear without a rebuild.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = ["", "/news", "/art", "/engineer", "/about"].map(
    (path) => ({ url: `${SITE_URL}${path}` })
  );

  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("slug, content_type, created_at, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const rows = (data ?? []) as Pick<
      PostRow,
      "slug" | "content_type" | "created_at" | "updated_at"
    >[];
    const postRoutes: MetadataRoute.Sitemap = rows
      .filter((post) => post.slug && SECTION_PATH[post.content_type])
      .map((post) => ({
        url: `${SITE_URL}/${SECTION_PATH[post.content_type]}/${post.slug}`,
        lastModified: post.updated_at ?? post.created_at,
      }));
    return [...staticRoutes, ...postRoutes];
  } catch (err) {
    console.error("sitemap: failed to load posts", err);
    return staticRoutes;
  }
}
