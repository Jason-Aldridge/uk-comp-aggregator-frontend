"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";

const PLACEHOLDER_SRC = "/competition-placeholder.svg";

type CompetitionImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export function CompetitionImage({
  src,
  alt,
  onError,
  ...props
}: CompetitionImageProps) {
  const normalizedSrc = useMemo(() => {
    if (!src || !src.trim()) {
      return PLACEHOLDER_SRC;
    }

    return src;
  }, [src]);

  const [currentSrc, setCurrentSrc] = useState(normalizedSrc);

  if (currentSrc !== normalizedSrc) {
    if (normalizedSrc === PLACEHOLDER_SRC) {
      setCurrentSrc(PLACEHOLDER_SRC);
    }
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== PLACEHOLDER_SRC) {
          setCurrentSrc(PLACEHOLDER_SRC);
        }

        onError?.(event);
      }}
    />
  );
}