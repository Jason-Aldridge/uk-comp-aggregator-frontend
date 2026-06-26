import { defineField, defineType } from "sanity";

export const seoMeta = defineType({
  name: "seoMeta",
  title: "SEO Meta",
  type: "object",
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "seoImage",
      title: "SEO Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});
