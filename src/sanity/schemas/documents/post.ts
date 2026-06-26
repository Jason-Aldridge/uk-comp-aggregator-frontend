import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Posts",
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "News", value: "news" },
          { title: "Analysis", value: "analysis" },
          { title: "Industry", value: "industry" },
          { title: "Tips", value: "tips" },
        ],
      },
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
