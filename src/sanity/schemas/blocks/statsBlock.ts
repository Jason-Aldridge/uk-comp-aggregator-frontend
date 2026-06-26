import { defineArrayMember, defineField, defineType } from "sanity";

export const statsBlock = defineType({
  name: "statsBlock",
  title: "Stats Block",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      validation: (rule) => rule.required().min(1).max(6),
      of: [
        defineArrayMember({
          name: "statItem",
          title: "Stat Item",
          type: "object",
          fields: [
            defineField({
              name: "number",
              title: "Number",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "number",
              subtitle: "label",
            },
          },
        }),
      ],
    }),
  ],
});
