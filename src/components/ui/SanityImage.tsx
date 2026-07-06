import Image, { type ImageProps } from "next/image";

export function SanityImage({ src, alt, unoptimized, ...props }: ImageProps) {
  const isSanitySrc = typeof src === "string" && src.includes("cdn.sanity.io");

  return (
    <Image {...props} src={src} alt={alt} unoptimized={unoptimized || isSanitySrc} />
  );
}
