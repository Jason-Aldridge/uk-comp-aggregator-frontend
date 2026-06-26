import { defineArrayMember, defineField, defineType } from "sanity";

export const operatorsBlock = defineType({
  name: "operatorsBlock",
  title: "Operators Block",
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
      name: "operators",
      title: "Operators",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 2,
    }),
  ],
});
