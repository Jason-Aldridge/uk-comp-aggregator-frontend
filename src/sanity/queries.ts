export const PAGE_BY_SLUG = `*[_type == "page" && slug.current == $slug][0]{
  title,
  heroEyebrow,
  heroHeading,
  heroLead,
  heroCtaPrimary,
  heroCtaSecondary,
  sections[]{..., _type},
  seo
}`;

export const ALL_PAGE_SLUGS = `*[_type == "page" && defined(slug.current)][].slug.current`;
