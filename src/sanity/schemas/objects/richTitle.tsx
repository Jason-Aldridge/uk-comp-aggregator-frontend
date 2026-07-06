import type { ReactNode } from "react";
import { defineArrayMember, defineType } from "sanity";

function createColorDecorator(title: string, value: string, color: string) {
  return {
    title,
    value,
    icon: () => <span style={{ color, fontWeight: 700 }}>A</span>,
    component: (props: { children?: ReactNode }) => (
      <span style={{ color }}>{props.children}</span>
    ),
  };
}

const colorDecorators = [
  createColorDecorator("Accent (green)", "colorAccent", "#22C55E"),
  createColorDecorator("Positive (green)", "colorGood", "#22C55E"),
  createColorDecorator("Warning (amber)", "colorWarn", "#F59E0B"),
  createColorDecorator("Danger (red)", "colorDanger", "#EF4444"),
  createColorDecorator("Muted (grey)", "colorMuted", "#94A3B8"),
];

export const richTitle = defineType({
  name: "richTitle",
  title: "Rich Title",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          ...colorDecorators,
        ],
        annotations: [],
      },
    }),
  ],
  validation: (rule) => rule.max(1),
});
