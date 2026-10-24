import React from "react";
import GlassPanel from "./GlassPanel";
import PostImage from "@/components/common/PostImage";
import { safeImageSrc } from "@/lib/content";
import { PANEL_FOR } from "@/lib/glass/panels";
import { seedFrom } from "@/lib/glass/core";

/**
 * A post's window: its cover image inside a gilded pointed arch, or, when it
 * has none, stained glass seeded by the post so it is unique and stable.
 * `ratio` is the frame's aspect ratio ("3 / 4", "5 / 6", ...).
 */
export default function ArchWindow({
  post,
  ratio = "3 / 4",
  sizes = "(max-width: 680px) 90vw, 420px",
  priority = false,
  className = "",
  type,
}) {
  const src = safeImageSrc(post?.image_url);
  // list queries don't select content_type, so callers may pass the type
  const kind = PANEL_FOR[type ?? post?.content_type] ?? "dawn";
  const [w, h] = ratio.split("/").map((n) => Number(n.trim()) * 100);
  return (
    <span className={`arch-window ${className}`} style={{ "--arch-ratio": ratio }}>
      <span className="arch-window__glass">
        {src ? (
          <PostImage
            src={src}
            alt=""
            width={Math.round(w * 2)}
            height={Math.round(h * 2)}
            sizes={sizes}
            priority={priority}
            className="arch-window__img"
          />
        ) : (
          <GlassPanel kind={kind} seed={seedFrom(post?.id ?? post?.slug)} width={300} height={Math.round((300 * h) / w)} />
        )}
      </span>
    </span>
  );
}
