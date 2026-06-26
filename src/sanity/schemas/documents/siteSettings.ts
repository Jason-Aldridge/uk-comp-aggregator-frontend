import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType(
  {
    name: "siteSettings",
    title: "Site Settings",
    type: "document",
    __experimental_actions: ["update", "publish"],
    fields: [
    defineField({
      name: "navLinks",
      title: "Nav Links",
      type: "array",
      of: [
        defineArrayMember({
          name: "navLink",
          title: "Nav Link",
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
          preview: {
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Links",
      type: "array",
      of: [
        defineArrayMember({
          name: "footerLink",
          title: "Footer Link",
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
          preview: {
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "footerCopyright",
      title: "Footer Copyright",
      type: "string",
    }),
    ],
  },
  { strict: false },
);
