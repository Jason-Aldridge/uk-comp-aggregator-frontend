import { defineArrayMember, defineField, defineType } from "sanity";

export const stepsBlock = defineType({
  name: "stepsBlock",
  title: "Steps Block",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "richTitle",
      title: "Rich Title",
      type: "richTitle",
      description: "Optional. Overrides Title with coloured words support.",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: "stepItem",
          title: "Step Item",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
            },
          },
        }),
      ],
    }),
  ],
});
