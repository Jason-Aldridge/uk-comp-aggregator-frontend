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
      name: "footerColumns",
      title: "Footer Columns",
      type: "array",
      of: [
        defineArrayMember({
          name: "footerColumn",
          title: "Footer Column",
          type: "object",
          fields: [
            defineField({
              name: "heading",
              title: "Column Heading",
              type: "string",
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                defineArrayMember({
                  name: "footerColumnLink",
                  title: "Footer Column Link",
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
                      title: "URL or path",
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
          ],
          preview: {
            select: {
              title: "heading",
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
    defineField({
      name: "footerDisclaimer",
      title: "Footer disclaimer (e.g. 18+ / responsible play)",
      type: "text",
      rows: 2,
    }),
    ],
  },
  { strict: false },
);
