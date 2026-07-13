export const PAGE_BY_SLUG = `*[_type == "page" && slug.current == $slug][0]{
  title,
  heroEyebrow,
  heroHeading,
  richTitle,
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
  richTtitle,
  richTitle,
  titleColor,
  slug,
  operatorName,
  operatorId,
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

export const OPERATOR_REVIEW_BY_ID = `*[_type == "review" && defined(slug.current) && operatorId == $operatorId] | order(publishedAt desc)[0]{
  title,
  slug,
  operatorName,
  excerpt,
  publishedAt
}`;

export const OPERATOR_REVIEW_BY_NAME = `*[_type == "review" && defined(slug.current) && lower(operatorName) in $operatorNames] | order(publishedAt desc)[0]{
  title,
  slug,
  operatorName,
  excerpt,
  publishedAt
}`;

export const ALL_POSTS = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  richTitle,
  titleColor,
  slug,
  heroImage,
  excerpt,
  category,
  publishedAt
}`;

export const POST_BY_SLUG = `*[_type == "post" && slug.current == $slug][0]{
  title,
  richTitle,
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
  richTitle,
  titleColor,
  slug,
  heroImage,
  excerpt,
  category,
  publishedAt
}`;

export const SITE_SETTINGS = `*[_type == "siteSettings"][0]{
  footerColumns[]{
    heading,
    links[]{
      label,
      href
    }
  },
  footerLinks[]{
    label,
    href
  },
  footerCopyright,
  footerDisclaimer,
  maintenanceMessage
}`;

export const HOW_IT_WORKS_PAGE = `*[_type == "howItWorksPage"][0]{
  title,
  richTitle,
  body
}`;
