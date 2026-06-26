import { defineArrayMember, defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroLead",
      title: "Hero Lead",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroCtaPrimary",
      title: "Hero CTA Primary",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          title: "Href",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "heroCtaSecondary",
      title: "Hero CTA Secondary",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          title: "Href",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "richTextBlock" }),
        defineArrayMember({ type: "statsBlock" }),
        defineArrayMember({ type: "cardsBlock" }),
        defineArrayMember({ type: "stepsBlock" }),
        defineArrayMember({ type: "calloutBlock" }),
        defineArrayMember({ type: "operatorsBlock" }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMeta",
    }),
  ],
});
