import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { createElement, type ElementType } from "react";
import { portableTextComponents } from "./portableTextComponents";

type RichTitleProps = {
  value?: unknown[] | null;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function RichTitle({ value, as = "h2", className }: RichTitleProps) {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const Tag = as as ElementType;
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => createElement(Tag, { className }, children),
    },
    marks: portableTextComponents.marks,
  };

  return <PortableText value={value} components={components} />;
}
