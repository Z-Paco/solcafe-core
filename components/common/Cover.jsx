import React from "react";
import PostImage from "./PostImage";
import SunMark from "./SunMark";
import { safeImageSrc } from "@/lib/content";

/**
 * Post cover: the image when there is one, otherwise a sky-gradient fallback
 * with the sun mark. Fills its parent (position: relative; aspect-ratio set
 * by the parent).
 */
export default function Cover({
  src,
  className = "cover__img",
  width = 800,
  height = 450,
  sizes,
  priority = false,
  markSize = 56,
}) {
  if (safeImageSrc(src)) {
    return (
      <PostImage
        src={src}
        alt=""
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }
  return (
    <span className="cover__fallback sky-fill" aria-hidden="true">
      <SunMark size={markSize} />
    </span>
  );
}
