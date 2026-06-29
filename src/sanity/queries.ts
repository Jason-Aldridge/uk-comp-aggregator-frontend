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

export const ALL_REVIEWS = `*[_type == "review" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  slug,
  operatorName,
  heroImage,
  excerpt,
  rating,
  publishedAt
}`;

export const REVIEW_BY_SLUG = `*[_type == "review" && slug.current == $slug][0]{
  title,
  slug,
  operatorName,
  heroImage,
  excerpt,
  rating,
  body,
  publishedAt,
  seo
}`;

export const ALL_REVIEW_SLUGS = `*[_type == "review" && defined(slug.current)][].slug.current`;
