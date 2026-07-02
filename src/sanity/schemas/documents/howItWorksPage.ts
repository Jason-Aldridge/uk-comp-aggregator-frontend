import { defineArrayMember, defineField, defineType } from "sanity";

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
                { title: "Accent (green)", value: "colorAccent" },
                { title: "Positive (green)", value: "colorGood" },
                { title: "Warning (amber)", value: "colorWarn" },
                { title: "Danger (red)", value: "colorDanger" },
                { title: "Muted (grey)", value: "colorMuted" },
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
