import { defineArrayMember, defineField, defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Reviews",
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
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "operatorName",
      title: "Operator Name",
      type: "string",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
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
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMeta",
    }),
  ],
});
