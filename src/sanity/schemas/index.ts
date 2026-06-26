import { calloutBlock } from "./blocks/calloutBlock";
import { cardsBlock } from "./blocks/cardsBlock";
import { operatorsBlock } from "./blocks/operatorsBlock";
import { richTextBlock } from "./blocks/richTextBlock";
import { statsBlock } from "./blocks/statsBlock";
import { stepsBlock } from "./blocks/stepsBlock";
import { page } from "./documents/page";
import { post } from "./documents/post";
import { review } from "./documents/review";
import { siteSettings } from "./documents/siteSettings";
import { seoMeta } from "./objects/seoMeta";

export const schemaTypes = [
  page,
  review,
  post,
  siteSettings,
  richTextBlock,
  statsBlock,
  cardsBlock,
  stepsBlock,
  calloutBlock,
  operatorsBlock,
  seoMeta,
];
