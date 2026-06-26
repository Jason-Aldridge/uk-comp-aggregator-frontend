import { defineField, defineType } from "sanity";

export const calloutBlock = defineType({
  name: "calloutBlock",
  title: "Callout Block",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
    }),
  ],
});
