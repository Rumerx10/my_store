'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductCardGrid from './ProductCardGrid';
import FilterContent from '../FilterContent';
import { IProduct } from '@/types/api_types';
import { RootState } from '@/redux/store';
import { PRICE_CEILING } from '@/docs/products';
import { categoryLabel } from '@/docs/navLinks';
import { formatPrice } from '@/lib/utils';

// These search terms come from the home page "View all" links.
const COLLECTIONS: Record<string, { title: string; match: (p: IProduct) => boolean }> = {
  popular: { title: 'Popular right now', match: (p) => p.popular },
  latest: { title: 'New arrivals', match: (p) => p.latest },
  trending: { title: 'Trending this week', match: (p) => p.trending },
};

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'discount', label: 'Biggest discount' },
  { value: 'name', label: 'Name A to Z' },
];

const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white py-1 pl-3 pr-1 text-sm text-gray-700">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="flex size-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
      aria-label={`Remove filter: ${label}`}
    >
      <X className="size-3.5" />
    </button>
  </span>
);

const Products = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, PRICE_CEILING]);
  const [sortBy, setSortBy] = useState('featured');
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const productsData = useSelector((state: RootState) => state.products);

  // Keep the filters in sync with ?searchTerm= and ?category= from the header and links.
  useEffect(() => {
    setSearchQuery(searchParams.get('searchTerm')?.toLowerCase() || '');
    const category = searchParams.get('category');
    setSelectedCategories(category ? [category] : []);
  }, [searchParams]);

  const collection = COLLECTIONS[searchQuery];

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = productsData.filter((product) => {
      const matchesSearch = collection
        ? collection.match(product)
        : product.title.toLowerCase().includes(searchQuery) ||
          (product.brand?.toLowerCase() || '').includes(searchQuery);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesBrand =
        selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = !showInStockOnly || product.stock > 0;
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });

    return [...filtered].sort((a: IProduct, b: IProduct) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'discount':
          return b.discountPercentage - a.discountPercentage;
        case 'featured':
        default:
          if (b.popular !== a.popular) return b.popular ? 1 : -1;
          if (b.trending !== a.trending) return b.trending ? 1 : -1;
          return b.rating - a.rating;
      }
    });
  }, [
    productsData,
    collection,
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    sortBy,
    showInStockOnly,
  ]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category),
    );
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands((prev) => (checked ? [...prev, brand] : prev.filter((b) => b !== brand)));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, PRICE_CEILING]);
    setShowInStockOnly(false);
    setSortBy('featured');
    router.push('/products');
  };

  const priceFiltered = priceRange[0] > 0 || priceRange[1] < PRICE_CEILING;
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceFiltered ||
    showInStockOnly;

  const title = collection
    ? collection.title
    : searchQuery
      ? `Results for “${searchQuery}”`
      : selectedCategories.length === 1
        ? categoryLabel(selectedCategories[0])
        : 'All products';

  const count = filteredAndSortedProducts.length;

  const filterProps = {
    selectedBrands,
    selectedCategories,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    showInStockOnly,
    setShowInStockOnly,
    handleCategoryChange,
    handleBrandChange,
    clearAllFilters,
  };

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 md:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-gray-600" aria-live="polite">
            {count} {count === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 lg:hidden">
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] max-w-sm overflow-y-auto p-5 pt-14">
              <SheetTitle className="sr-only">Filter products</SheetTitle>
              <SheetDescription className="sr-only">
                Narrow the list by category, brand, price and availability.
              </SheetDescription>
              <FilterContent {...filterProps} />
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 w-full min-w-48 bg-white md:w-56" aria-label="Sort products">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {searchQuery && (
            <Chip
              label={collection ? collection.title : `“${searchQuery}”`}
              onRemove={() => router.push('/products')}
            />
          )}
          {selectedCategories.map((category) => (
            <Chip
              key={category}
              label={categoryLabel(category)}
              onRemove={() => handleCategoryChange(category, false)}
            />
          ))}
          {selectedBrands.map((brand) => (
            <Chip key={brand} label={brand} onRemove={() => handleBrandChange(brand, false)} />
          ))}
          {priceFiltered && (
            <Chip
              label={`${formatPrice(priceRange[0])} to ${formatPrice(priceRange[1])}`}
              onRemove={() => setPriceRange([0, PRICE_CEILING])}
            />
          )}
          {showInStockOnly && (
            <Chip label="In stock" onRemove={() => setShowInStockOnly(false)} />
          )}
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-1 rounded text-sm font-medium text-brand transition-colors hover:text-brand-hover"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-6 flex gap-8">
        <aside aria-label="Filters" className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-[calc(var(--header-h)+1.5rem)] rounded-xl glass p-5">
            <FilterContent {...filterProps} />
          </div>
        </aside>

        <section aria-label="Products" className="min-w-0 flex-1">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-gray-100">
                <Search className="size-6 text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">No products match</h2>
              <p className="mt-1 max-w-sm text-sm text-gray-600">
                Try a different search term, or remove a filter to see more products.
              </p>
              <Button className="mt-5" variant="outline" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
              {filteredAndSortedProducts.map((product: IProduct, index) => (
                <ProductCardGrid key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;
