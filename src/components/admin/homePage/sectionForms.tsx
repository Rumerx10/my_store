'use client';
import { useId } from 'react';
import type {
  ApiHomeHero,
  ApiHomeIconItem,
  ApiHomeSection,
  ApiProductSource,
} from '@/lib/api/types';
import { useCoupons } from '@/lib/query/admin';
import { useCatalog } from '@/lib/query/catalog';
import { useCategories } from '@/lib/query/shop';
import { formatPrice } from '@/lib/utils';
import {
  IconSelect,
  ImageField,
  LinkFields,
  ListEditor,
  NumberField,
  OptionalLink,
  selectClass,
  SwitchField,
  TextAreaField,
  TextField,
} from './fields';
import { FeaturedProductSelect, ProductPicker } from './ProductPicker';

type Of<T extends ApiHomeSection['type']> = Extract<ApiHomeSection, { type: T }>;
type FormProps<T extends ApiHomeSection['type']> = {
  section: Of<T>;
  onChange: (section: Of<T>) => void;
};

const grid = 'grid gap-4 sm:grid-cols-2';

const IconItems = ({
  items,
  onChange,
  itemName,
  max,
  min = 0,
}: {
  items: ApiHomeIconItem[];
  onChange: (items: ApiHomeIconItem[]) => void;
  itemName: string;
  max: number;
  min?: number;
}) => (
  <ListEditor
    items={items}
    onChange={onChange}
    itemName={itemName}
    max={max}
    min={min}
    create={(): ApiHomeIconItem => ({ icon: 'star', title: '', text: '' })}
    render={(item, update) => (
      <div className="grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <IconSelect value={item.icon} onChange={(icon) => update({ ...item, icon })} />
        <TextField
          label="Title"
          value={item.title}
          max={80}
          onChange={(title) => update({ ...item, title })}
        />
        <div className="sm:col-span-2">
          <TextField
            label="Text"
            value={item.text}
            max={200}
            onChange={(text) => update({ ...item, text })}
          />
        </div>
      </div>
    )}
  />
);

export const HeroForm = ({
  hero,
  onChange,
}: {
  hero: ApiHomeHero;
  onChange: (hero: ApiHomeHero) => void;
}) => {
  const set = <K extends keyof ApiHomeHero>(key: K, value: ApiHomeHero[K]) =>
    onChange({ ...hero, [key]: value });
  return (
    <div className="space-y-5">
      <TextField
        label="Line above the title (optional)"
        value={hero.badge}
        max={80}
        placeholder="Official GoodWe range, delivered and installed"
        onChange={(value) => set('badge', value)}
      />
      <div className={grid}>
        <TextField
          label="Title"
          value={hero.title}
          max={120}
          onChange={(value) => set('title', value)}
        />
        <TextField
          label="Ending in the accent colour (optional)"
          value={hero.highlight}
          max={60}
          placeholder="the sun."
          hint="Shown after the title, in yellow."
          onChange={(value) => set('highlight', value)}
        />
      </div>
      <TextAreaField
        label="Subtitle"
        value={hero.subtitle}
        max={300}
        onChange={(value) => set('subtitle', value)}
      />
      <ImageField
        label="Background photo"
        optional
        value={hero.image?.url ?? ''}
        maxSize={2400}
        hint="A wide photo, at least 2000 pixels across. The left side is darkened for the text."
        onChange={(url) => set('image', url ? { url, alt: hero.image?.alt ?? '' } : null)}
      />
      {hero.image && (
        <TextField
          label="What the photo shows"
          value={hero.image.alt}
          max={200}
          hint="Read out by screen readers."
          onChange={(alt) => set('image', { url: hero.image!.url, alt })}
        />
      )}
      <OptionalLink
        label="Main button"
        value={hero.primary}
        fallback={{ label: 'Shop now', href: '/products' }}
        onChange={(value) => set('primary', value)}
      />
      <OptionalLink
        label="Second button"
        value={hero.secondary}
        fallback={{ label: 'Chat with us', href: '/chat' }}
        onChange={(value) => set('secondary', value)}
      />
      <SwitchField
        label="Show a product card"
        checked={hero.showProduct}
        onChange={(value) => set('showProduct', value)}
      />
      {hero.showProduct && (
        <FeaturedProductSelect
          value={hero.featuredProductId}
          onChange={(value) => set('featuredProductId', value)}
        />
      )}
      <SwitchField
        label="Show your public coupon"
        hint="The first coupon you show publicly (Coupons), with a copy button."
        checked={hero.showCoupon}
        onChange={(value) => set('showCoupon', value)}
      />
    </div>
  );
};

const FeaturesForm = ({ section, onChange }: FormProps<'features'>) => (
  <IconItems
    items={section.items}
    onChange={(items) => onChange({ ...section, items })}
    itemName="Highlight"
    max={8}
    min={1}
  />
);

const CategoriesForm = ({ section, onChange }: FormProps<'categories'>) => (
  <TextField
    label="Title"
    value={section.title}
    max={120}
    hint="Each category with products in the shop gets a tile."
    onChange={(title) => onChange({ ...section, title })}
  />
);

const PromoCardsForm = ({ section, onChange }: FormProps<'promoCards'>) => (
  <div className="space-y-4">
    <TextField
      label="Name for screen readers"
      value={section.title}
      max={120}
      placeholder="Solutions for homes and businesses"
      hint="Not shown on the page; each card shows its own title."
      onChange={(title) => onChange({ ...section, title })}
    />
    <ListEditor
      items={section.cards}
      onChange={(cards) => onChange({ ...section, cards })}
      itemName="Card"
      max={4}
      create={() => ({
        title: '',
        text: '',
        points: [],
        image: { url: '', alt: '' },
        link: { label: 'Shop now', href: '/products' },
      })}
      render={(card, update) => (
        <>
          <TextField
            label="Title"
            value={card.title}
            max={120}
            onChange={(title) => update({ ...card, title })}
          />
          <TextAreaField
            label="Text"
            value={card.text}
            max={400}
            onChange={(text) => update({ ...card, text })}
          />
          <TextAreaField
            label="Points (optional)"
            value={card.points.join('\n')}
            max={6 * 81}
            hint="One per line, up to 6. Each gets a tick."
            onChange={(text) =>
              update({
                ...card,
                // Blank lines are dropped when the page is saved.
                points: text
                  .split('\n')
                  .slice(0, 6)
                  .map((point) => point.slice(0, 80)),
              })
            }
          />
          <ImageField
            label="Photo"
            value={card.image.url}
            maxSize={1600}
            aspect="aspect-[4/5]"
            onChange={(url) => update({ ...card, image: { ...card.image, url } })}
          />
          <TextField
            label="What the photo shows"
            value={card.image.alt}
            max={200}
            onChange={(alt) => update({ ...card, image: { ...card.image, alt } })}
          />
          <LinkFields value={card.link} onChange={(link) => update({ ...card, link })} />
        </>
      )}
    />
  </div>
);

const SOURCES: { value: ApiProductSource; label: string }[] = [
  { value: 'popular', label: 'Marked popular' },
  { value: 'trending', label: 'Marked trending' },
  { value: 'latest', label: 'Marked new' },
  { value: 'deals', label: 'Biggest discounts in stock' },
  { value: 'category', label: 'One category' },
  { value: 'manual', label: 'Products I pick' },
];

const ProductsForm = ({ section, onChange }: FormProps<'products'>) => {
  const sourceId = useId();
  const categoryId = useId();
  const { data: categories = [] } = useCategories();
  return (
    <div className="space-y-4">
      <div className={grid}>
        <TextField
          label="Title"
          value={section.title}
          max={120}
          onChange={(title) => onChange({ ...section, title })}
        />
        <TextField
          label="Line under the title (optional)"
          value={section.subtitle}
          max={300}
          onChange={(subtitle) => onChange({ ...section, subtitle })}
        />
      </div>
      <div className={grid}>
        <div className="space-y-1.5">
          <label
            htmlFor={sourceId}
            className="text-sm font-medium text-gray-900 dark:text-slate-100"
          >
            Products to show
          </label>
          <select
            id={sourceId}
            value={section.source}
            onChange={(event) =>
              onChange({ ...section, source: event.target.value as ApiProductSource })
            }
            className={selectClass}
          >
            {SOURCES.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
          {['popular', 'trending', 'latest'].includes(section.source) && (
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Mark products in the product form, under Product organization.
            </p>
          )}
        </div>
        <NumberField
          label="Most products shown"
          value={section.limit}
          min={1}
          max={12}
          onChange={(limit) =>
            onChange({ ...section, limit: Math.min(12, Math.max(1, Math.round(limit))) })
          }
        />
      </div>
      {section.source === 'category' && (
        <div className="space-y-1.5">
          <label
            htmlFor={categoryId}
            className="text-sm font-medium text-gray-900 dark:text-slate-100"
          >
            Category
          </label>
          <select
            id={categoryId}
            value={section.categorySlug ?? ''}
            onChange={(event) =>
              onChange({ ...section, categorySlug: event.target.value || undefined })
            }
            className={selectClass}
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
                {!category.isActive && ' (hidden)'}
              </option>
            ))}
          </select>
        </div>
      )}
      {section.source === 'manual' && (
        <ProductPicker
          label="Products, in this order"
          value={section.productIds ?? []}
          max={12}
          onChange={(productIds) => onChange({ ...section, productIds })}
        />
      )}
    </div>
  );
};

const BannersForm = ({ section, onChange }: FormProps<'banners'>) => (
  <div className="space-y-4">
    <div className={grid}>
      <TextField
        label="Name for screen readers"
        value={section.title}
        max={120}
        placeholder="Offers"
        onChange={(title) => onChange({ ...section, title })}
      />
      <NumberField
        label="Seconds per banner"
        value={section.autoplaySeconds}
        min={0}
        max={30}
        hint="With several banners. 0 stops them moving on by themselves."
        onChange={(seconds) =>
          onChange({ ...section, autoplaySeconds: Math.min(30, Math.max(0, Math.round(seconds))) })
        }
      />
    </div>
    <ListEditor
      items={section.slides}
      onChange={(slides) => onChange({ ...section, slides })}
      itemName="Banner"
      max={10}
      create={() => ({ image: '', mobileImage: null, alt: '', href: null })}
      render={(slide, update) => (
        <>
          <ImageField
            label="Banner image"
            value={slide.image}
            maxSize={2400}
            aspect="aspect-[2/1]"
            hint="Wide, about twice as wide as tall (for example 1920 × 960)."
            onChange={(image) => update({ ...slide, image })}
          />
          <ImageField
            label="Phone version"
            optional
            value={slide.mobileImage ?? ''}
            maxSize={1200}
            aspect="aspect-[24/25]"
            hint="Nearly square (for example 768 × 800). Without it, phones show the wide banner."
            onChange={(mobileImage) => update({ ...slide, mobileImage: mobileImage || null })}
          />
          <TextField
            label="What the banner says"
            value={slide.alt}
            max={200}
            hint="Read out by screen readers, since the words are in the picture."
            onChange={(alt) => update({ ...slide, alt })}
          />
          <TextField
            label="Opens when tapped (optional)"
            value={slide.href ?? ''}
            max={500}
            placeholder="/products?category=batteries"
            onChange={(href) => update({ ...slide, href: href.trim() || null })}
          />
        </>
      )}
    />
  </div>
);

const BillboardForm = ({ section, onChange }: FormProps<'billboard'>) => {
  const alignId = useId();
  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={section.title}
        max={120}
        onChange={(title) => onChange({ ...section, title })}
      />
      <TextAreaField
        label="Text (optional)"
        value={section.text}
        max={300}
        onChange={(text) => onChange({ ...section, text })}
      />
      <ImageField
        label="Photo"
        value={section.image.url}
        maxSize={2400}
        aspect="aspect-[2/1]"
        hint="Wide. It is darkened behind the text."
        onChange={(url) => onChange({ ...section, image: { ...section.image, url } })}
      />
      <TextField
        label="What the photo shows"
        value={section.image.alt}
        max={200}
        onChange={(alt) => onChange({ ...section, image: { ...section.image, alt } })}
      />
      <OptionalLink
        label="Button"
        value={section.link}
        fallback={{ label: 'Shop the offer', href: '/deals' }}
        onChange={(link) => onChange({ ...section, link })}
      />
      <div className="space-y-1.5">
        <label htmlFor={alignId} className="text-sm font-medium text-gray-900 dark:text-slate-100">
          Text position
        </label>
        <select
          id={alignId}
          value={section.align}
          onChange={(event) =>
            onChange({ ...section, align: event.target.value as 'left' | 'center' })
          }
          className={`${selectClass} sm:w-56`}
        >
          <option value="left">Left</option>
          <option value="center">Centre</option>
        </select>
      </div>
    </div>
  );
};

const ComboForm = ({ section, onChange }: FormProps<'combo'>) => {
  const couponId = useId();
  const { data: catalog = [] } = useCatalog();
  const { data: coupons = [] } = useCoupons();
  const regular = section.productIds.reduce(
    (sum, id) => sum + (catalog.find((product) => product.id === id)?.price ?? 0),
    0,
  );
  const saving = regular - section.comboPrice;
  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={section.title}
        max={120}
        placeholder="Home backup kit"
        onChange={(title) => onChange({ ...section, title })}
      />
      <TextAreaField
        label="Text (optional)"
        value={section.text}
        max={300}
        onChange={(text) => onChange({ ...section, text })}
      />
      <ProductPicker
        label="Products in the combo"
        hint="Two to six. Shoppers add them all to the cart in one tap."
        value={section.productIds}
        max={6}
        onChange={(productIds) => onChange({ ...section, productIds })}
      />
      <div className={grid}>
        <NumberField
          label="Combo price (৳)"
          value={section.comboPrice}
          min={0}
          max={1_000_000_000}
          step={0.01}
          hint={
            regular > 0
              ? `Bought one by one: ${formatPrice(regular)}${saving > 0 ? `. Shoppers save ${formatPrice(saving)}.` : '.'}`
              : undefined
          }
          onChange={(comboPrice) => onChange({ ...section, comboPrice })}
        />
        <div className="space-y-1.5">
          <label
            htmlFor={couponId}
            className="text-sm font-medium text-gray-900 dark:text-slate-100"
          >
            Coupon for the combo price
          </label>
          <select
            id={couponId}
            value={section.couponCode ?? ''}
            onChange={(event) => onChange({ ...section, couponCode: event.target.value || null })}
            className={selectClass}
          >
            <option value="">No coupon</option>
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.code}>
                {coupon.code}
                {!coupon.isActive && ' (off)'}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            The cart charges each product at its own price. Make a coupon worth the saving (Coupons)
            and choose it here, so shoppers pay the combo price at checkout.
          </p>
        </div>
      </div>
      <ImageField
        label="Photo of the set"
        optional
        value={section.image?.url ?? ''}
        maxSize={1600}
        aspect="aspect-[4/3]"
        hint="Without one, the products' own photos are shown side by side."
        onChange={(url) =>
          onChange({ ...section, image: url ? { url, alt: section.image?.alt ?? '' } : null })
        }
      />
    </div>
  );
};

const VideosForm = ({ section, onChange }: FormProps<'videos'>) => (
  <div className="space-y-4">
    <div className={grid}>
      <TextField
        label="Title"
        value={section.title}
        max={120}
        onChange={(title) => onChange({ ...section, title })}
      />
      <TextField
        label="Line under the title (optional)"
        value={section.subtitle}
        max={300}
        onChange={(subtitle) => onChange({ ...section, subtitle })}
      />
    </div>
    <ListEditor
      items={section.videos}
      onChange={(videos) => onChange({ ...section, videos })}
      itemName="Video"
      max={4}
      create={() => ({ title: '', text: '', videoUrl: '', poster: '' })}
      render={(video, update) => (
        <>
          <TextField
            label="Title"
            value={video.title}
            max={120}
            onChange={(title) => update({ ...video, title })}
          />
          <TextField
            label="Text (optional)"
            value={video.text}
            max={300}
            onChange={(text) => update({ ...video, text })}
          />
          <TextField
            label="Video link"
            value={video.videoUrl}
            max={2048}
            placeholder="https://"
            hint="An https link to an MP4 or WebM file. It plays muted and on a loop."
            onChange={(videoUrl) => update({ ...video, videoUrl: videoUrl.trim() })}
          />
          <ImageField
            label="Cover image"
            value={video.poster}
            maxSize={1600}
            hint="Shown before it plays, and instead of it when the visitor prefers less motion."
            onChange={(poster) => update({ ...video, poster })}
          />
        </>
      )}
    />
    <ImageField
      label="Photo beside the points"
      optional
      value={section.image?.url ?? ''}
      maxSize={1600}
      aspect="aspect-[3/2]"
      onChange={(url) =>
        onChange({ ...section, image: url ? { url, alt: section.image?.alt ?? '' } : null })
      }
    />
    <IconItems
      items={section.points}
      onChange={(points) => onChange({ ...section, points })}
      itemName="Point"
      max={6}
    />
  </div>
);

const StepsForm = ({ section, onChange }: FormProps<'steps'>) => (
  <div className="space-y-4">
    <div className={grid}>
      <TextField
        label="Title"
        value={section.title}
        max={120}
        onChange={(title) => onChange({ ...section, title })}
      />
      <TextField
        label="Line under the title (optional)"
        value={section.subtitle}
        max={300}
        onChange={(subtitle) => onChange({ ...section, subtitle })}
      />
    </div>
    <IconItems
      items={section.steps}
      onChange={(steps) => onChange({ ...section, steps })}
      itemName="Step"
      max={6}
      min={1}
    />
  </div>
);

const HelpForm = ({ section, onChange }: FormProps<'help'>) => (
  <div className="space-y-4">
    <TextField
      label="Title"
      value={section.title}
      max={120}
      onChange={(title) => onChange({ ...section, title })}
    />
    <TextAreaField
      label="Text"
      value={section.text}
      max={300}
      hint="Your support hours (Settings) are added after it. The band shows Chat and your phone number."
      onChange={(text) => onChange({ ...section, text })}
    />
  </div>
);

// The form for one section, by its type.
export const SectionForm = ({
  section,
  onChange,
}: {
  section: ApiHomeSection;
  onChange: (section: ApiHomeSection) => void;
}) => {
  switch (section.type) {
    case 'features':
      return <FeaturesForm section={section} onChange={onChange} />;
    case 'categories':
      return <CategoriesForm section={section} onChange={onChange} />;
    case 'promoCards':
      return <PromoCardsForm section={section} onChange={onChange} />;
    case 'products':
      return <ProductsForm section={section} onChange={onChange} />;
    case 'banners':
      return <BannersForm section={section} onChange={onChange} />;
    case 'billboard':
      return <BillboardForm section={section} onChange={onChange} />;
    case 'combo':
      return <ComboForm section={section} onChange={onChange} />;
    case 'videos':
      return <VideosForm section={section} onChange={onChange} />;
    case 'steps':
      return <StepsForm section={section} onChange={onChange} />;
    case 'help':
      return <HelpForm section={section} onChange={onChange} />;
  }
};
