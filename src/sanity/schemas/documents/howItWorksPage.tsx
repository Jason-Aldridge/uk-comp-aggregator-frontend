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

export const howItWorksPage = defineType(
  {
    name: "howItWorksPage",
    title: "How It Works Page",
    type: "document",
    __experimental_actions: ["update", "publish"],
    fields: [
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        initialValue: "How It Works",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "richTitle",
        title: "Rich Title",
        type: "richTitle",
        description: "Optional. Overrides Title with coloured words support.",
      }),
      defineField({
        name: "body",
        title: "Body",
        type: "array",
        of: [
          defineArrayMember({
            type: "block",
            marks: {
              decorators: [
                { title: "Strong", value: "strong" },
                { title: "Emphasis", value: "em" },
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
  },
  { strict: false },
);
