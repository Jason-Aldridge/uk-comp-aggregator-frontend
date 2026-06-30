export const PAGE_BY_SLUG = `*[_type == "page" && slug.current == $slug][0]{
  title,
  heroEyebrow,
  heroHeading,
  heroHeadingColor,
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
  titleColor,
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

export const RELATED_REVIEWS = `*[_type == "review" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...3]{
  _id,
  title,
  slug,
  operatorName,
  heroImage,
  excerpt,
  rating,
  publishedAt
}`;

export const ALL_POSTS = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  slug,
  heroImage,
  excerpt,
  category,
  publishedAt
}`;

export const POST_BY_SLUG = `*[_type == "post" && slug.current == $slug][0]{
  title,
  titleColor,
  slug,
  heroImage,
  excerpt,
  category,
  body,
  publishedAt,
  seo
}`;

export const ALL_POST_SLUGS = `*[_type == "post" && defined(slug.current)][].slug.current`;

export const RELATED_POSTS = `*[_type == "post" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...3]{
  _id,
  title,
  slug,
  heroImage,
  excerpt,
  category,
  publishedAt
}`;
