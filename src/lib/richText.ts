import xss, { type IFilterXSSOptions } from 'xss';

// Only the markup the description editor produces survives; everything else is stripped.
const SANITIZE_OPTIONS: IFilterXSSOptions = {
  whiteList: {
    p: ['style'],
    h2: ['style'],
    h3: ['style'],
    h4: ['style'],
    strong: [],
    em: [],
    u: [],
    s: [],
    code: [],
    pre: [],
    br: [],
    hr: [],
    blockquote: [],
    ul: [],
    ol: ['start'],
    li: [],
    a: ['href', 'target', 'rel'],
    span: ['style'],
    mark: ['style', 'data-color'],
    img: ['src', 'alt', 'title', 'style', 'data-align'],
  },
  css: {
    whiteList: { 'text-align': true, color: true, 'background-color': true, width: true },
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
};

export const sanitizeHtml = (html: string) => xss(html, SANITIZE_OPTIONS);

const looksLikeHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);

const escapeText = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Descriptions are rich text from the editor, or plain text in older catalog entries.
export const descriptionToHtml = (description: string) =>
  looksLikeHtml(description) ? sanitizeHtml(description) : `<p>${escapeText(description)}</p>`;

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  nbsp: ' ',
};

export const htmlToText = (html: string) =>
  html
    .replace(/<(br|hr)[^>]*>|<\/(p|h[1-6]|li|blockquote|pre)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, entity: string) => ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();

// Short plain-text summary, cut at a word boundary.
export const excerpt = (html: string, maxLength = 220) => {
  const text = htmlToText(html);
  if (text.length <= maxLength) return text;
  const cut = text.lastIndexOf(' ', maxLength);
  return `${text.slice(0, cut > 0 ? cut : maxLength)}…`;
};

// An editor that only holds empty paragraphs counts as empty, unless it has an image.
export const isRichTextEmpty = (html: string) => htmlToText(html) === '' && !/<img/i.test(html);
