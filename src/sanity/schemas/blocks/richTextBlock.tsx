import type { ReactNode } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";

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

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich Text Block",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
              ...colorDecorators,
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
});
