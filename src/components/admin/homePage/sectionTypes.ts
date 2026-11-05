import {
  BadgeCheck,
  Clapperboard,
  FolderTree,
  GalleryHorizontal,
  Images,
  LayoutGrid,
  LifeBuoy,
  ListOrdered,
  Megaphone,
  PackagePlus,
  type LucideIcon,
} from 'lucide-react';
import type {
  ApiHomeLink,
  ApiHomePageContent,
  ApiHomeSection,
  ApiHomeSectionType,
} from '@/lib/api/types';
import { isValidLink } from './fields';

interface SectionType {
  label: string;
  description: string;
  icon: LucideIcon;
  create: (id: string) => ApiHomeSection;
}

// What each kind of section is called in the editor, and how a new one starts.
export const SECTION_TYPES: Record<ApiHomeSectionType, SectionType> = {
  banners: {
    label: 'Banner ads',
    description: 'Banner images for offers and ads. Several slide by as a carousel.',
    icon: GalleryHorizontal,
    create: (id) => ({
      id,
      type: 'banners',
      visible: true,
      title: 'Offers',
      slides: [],
      autoplaySeconds: 6,
    }),
  },
  billboard: {
    label: 'Billboard',
    description: 'One big announcement over a photo, with a button.',
    icon: Megaphone,
    create: (id) => ({
      id,
      type: 'billboard',
      visible: true,
      title: '',
      text: '',
      image: { url: '', alt: '' },
      link: { label: 'Shop the offer', href: '/deals' },
      align: 'left',
    }),
  },
  combo: {
    label: 'Combo offer',
    description: 'A set of products sold together for one price.',
    icon: PackagePlus,
    create: (id) => ({
      id,
      type: 'combo',
      visible: true,
      title: '',
      text: '',
      productIds: [],
      comboPrice: 0,
      couponCode: null,
      image: null,
    }),
  },
  products: {
    label: 'Product row',
    description: 'Popular, new, discounted, one category, or products you pick.',
    icon: LayoutGrid,
    create: (id) => ({
      id,
      type: 'products',
      visible: true,
      title: '',
      subtitle: '',
      source: 'popular',
      limit: 8,
    }),
  },
  promoCards: {
    label: 'Photo cards',
    description: 'Large photo cards that each lead to a page.',
    icon: Images,
    create: (id) => ({ id, type: 'promoCards', visible: true, title: '', cards: [] }),
  },
  features: {
    label: 'Highlights',
    description: 'Short reasons to shop with you, each with an icon.',
    icon: BadgeCheck,
    create: (id) => ({
      id,
      type: 'features',
      visible: true,
      items: [{ icon: 'truck', title: 'Delivered nationwide', text: '' }],
    }),
  },
  categories: {
    label: 'Categories',
    description: 'A tile for each category that has products.',
    icon: FolderTree,
    create: (id) => ({ id, type: 'categories', visible: true, title: 'Shop by category' }),
  },
  videos: {
    label: 'Videos',
    description: 'Short silent videos, then a photo with a few points.',
    icon: Clapperboard,
    create: (id) => ({
      id,
      type: 'videos',
      visible: true,
      title: '',
      subtitle: '',
      videos: [],
      image: null,
      points: [],
    }),
  },
  steps: {
    label: 'Steps',
    description: 'How buying from you works, in numbered steps.',
    icon: ListOrdered,
    create: (id) => ({
      id,
      type: 'steps',
      visible: true,
      title: '',
      subtitle: '',
      steps: [{ icon: 'clipboard', title: '', text: '' }],
    }),
  },
  help: {
    label: 'Help band',
    description: 'Points shoppers to chat and your phone number.',
    icon: LifeBuoy,
    create: (id) => ({
      id,
      type: 'help',
      visible: true,
      title: 'Need a hand?',
      text: 'Our team answers product questions and order queries.',
    }),
  },
};

// The order of the "Add section" menu: offers first.
export const ADD_ORDER: ApiHomeSectionType[] = [
  'banners',
  'billboard',
  'combo',
  'products',
  'promoCards',
  'features',
  'categories',
  'videos',
  'steps',
  'help',
];

export const newSectionId = (type: ApiHomeSectionType) =>
  `${type}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

// A line under the section's name in the list.
export const sectionSummary = (section: ApiHomeSection): string => {
  switch (section.type) {
    case 'features':
      return section.items.map((item) => item.title).join(', ');
    case 'banners':
      return `${section.slides.length} ${section.slides.length === 1 ? 'banner' : 'banners'}`;
    case 'promoCards':
      return section.cards.map((card) => card.title).join(', ') || 'No cards yet';
    case 'combo':
      return section.title || `${section.productIds.length} products`;
    default:
      return section.title || 'No title yet';
  }
};

const linkProblem = (link: ApiHomeLink | null | undefined) =>
  link && (!link.label.trim() || !isValidLink(link.href));

// What would stop a save, in words, so staff can fix it before the API says no.
export const pageProblems = (page: ApiHomePageContent): string[] => {
  const problems: string[] = [];
  const { hero } = page;
  if (!hero.title.trim()) problems.push('Hero: add a title.');
  if (linkProblem(hero.primary)) problems.push('Hero: finish the main button.');
  if (linkProblem(hero.secondary)) problems.push('Hero: finish the second button.');
  if (hero.image && !hero.image.url) problems.push('Hero: add a photo or turn it off.');

  page.sections.forEach((section, index) => {
    const name = `${SECTION_TYPES[section.type].label} (section ${index + 1})`;
    const add = (problem: string) => problems.push(`${name}: ${problem}`);
    const needsTitle =
      'title' in section && section.type !== 'promoCards' && section.type !== 'banners';
    if (needsTitle && !section.title.trim()) add('add a title.');

    switch (section.type) {
      case 'features':
        if (section.items.some((item) => !item.title.trim())) add('every highlight needs a title.');
        break;
      case 'promoCards':
        if (section.cards.length === 0) add('add a card.');
        section.cards.forEach((card, i) => {
          if (!card.title.trim() || !card.image.url)
            add(`card ${i + 1} needs a title and a photo.`);
          if (linkProblem(card.link)) add(`finish the button on card ${i + 1}.`);
        });
        break;
      case 'products':
        if (section.source === 'category' && !section.categorySlug) add('choose a category.');
        if (section.source === 'manual' && !section.productIds?.length)
          add('pick at least one product.');
        break;
      case 'banners':
        if (section.slides.length === 0) add('add a banner.');
        section.slides.forEach((slide, i) => {
          if (!slide.image) add(`banner ${i + 1} needs an image.`);
          if (!slide.alt.trim()) add(`describe banner ${i + 1} for screen readers.`);
          if (slide.href && !isValidLink(slide.href)) add(`check the link of banner ${i + 1}.`);
        });
        break;
      case 'billboard':
        if (!section.image.url) add('add a photo.');
        if (linkProblem(section.link)) add('finish the button.');
        break;
      case 'combo':
        if (section.productIds.length < 2) add('pick at least two products.');
        if (!(section.comboPrice > 0)) add('set the combo price.');
        break;
      case 'videos':
        section.videos.forEach((video, i) => {
          if (!video.title.trim() || !/^https:\/\//.test(video.videoUrl) || !video.poster) {
            add(`video ${i + 1} needs a title, an https video link and a cover image.`);
          }
        });
        if (section.image && !section.image.url) add('add the photo or turn it off.');
        if (section.points.some((point) => !point.title.trim())) add('every point needs a title.');
        break;
      case 'steps':
        if (section.steps.some((step) => !step.title.trim())) add('every step needs a title.');
        break;
    }
  });
  return problems;
};
