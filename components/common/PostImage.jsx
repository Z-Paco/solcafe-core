import React from "react";
import Image from "next/image";
import { isLocalImage, safeImageSrc } from "@/lib/content";

/**
 * Image from post data. Local files go through next/image; remote URLs
 * (Supabase storage, link previews) stay a plain lazy <img> with explicit
 * dimensions so the layout doesn't shift. The wrapper sets the aspect ratio.
 */
export default function PostImage({
  src,
  alt,
  width = 1200,
  height = 675,
  className = "",
  priority = false,
  sizes = "(max-width: 760px) 100vw, 760px",
}) {
  const safeSrc = safeImageSrc(src);
  if (!safeSrc) return null;

  if (isLocalImage(safeSrc)) {
    return (
      <Image
        src={safeSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote, arbitrary hosts
    <img
      src={safeSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
