import { defineArrayMember, defineField, defineType } from "sanity";

export const cardsBlock = defineType({
  name: "cardsBlock",
  title: "Cards Block",
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
      name: "items",
      title: "Items",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: "cardItem",
          title: "Card Item",
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              validation: (rule) => rule.required(),
            }),
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
              subtitle: "icon",
            },
          },
        }),
      ],
    }),
  ],
});
