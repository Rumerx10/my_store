'use client';

import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { PRODUCTS } from '@/docs/products';
import ProductCardList from './ProductCardList';
import ProductCardGrid from './ProductCardGrid';
import { useSearchParams } from 'next/navigation';
import { Badge } from '../ui/badge';
import { RxCross2 } from 'react-icons/rx';

const CATEGORIES = ['Electronics', 'Clothing', 'Accessories', 'Home & Kitchen'];
const BRANDS = [
  'TechSound',
  'EcoWear',
  'FitTech',
  'StyleCraft',
  'HomeEssentials',
  'SportMax',
  'PowerUp',
  'AromaBliss',
];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState('featured');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('searchTerm') || '';

  useEffect(() => {
    setSearchQuery(searchTerm);
  }, [searchTerm]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = !showInStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return b.featured ? 1 : -1;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortBy, showInStockOnly]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 300]);
    setShowInStockOnly(false);
    setSortBy('featured');
  };

  const FilterContent = () => (
    <div className="space-y-6 mt-6">
      <h3 className="font-semibold mb-3">Filters</h3>
      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rating</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode((prev) => (prev === 'grid' ? (prev = 'list') : 'grid'))}
          >
            {viewMode === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent">
        Clear All Filters
      </Button>
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={300}
            min={0}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={showInStockOnly}
            onCheckedChange={(checked) => setShowInStockOnly(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="text-sm font-normal">
            In stock only
          </Label>
        </div>
      </div>
    </div>
  );

  const ProductCards = ({ product }: { product: (typeof PRODUCTS)[0] }) => {
    const discount = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
    if (viewMode === 'list') {
      return <ProductCardList discount={discount} product={product}></ProductCardList>;
    }
    return (
      <ProductCardGrid discount={discount} product={product} textColor="#2b2b2b"></ProductCardGrid>
    );
  };

  return (
    <div className="relative min-h-screen border-2 border-red-500">
      <div
        className={`lg:hidden fixed top-20 cursor-pointer z-50 inset-0 backdrop-blur-sm ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      ></div>
      <div
        className={`lg:hidden fixed z-50 cursor-pointer p-4 w-[60vw] right-0 bottom-0 top-20 bg-black  duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <FilterContent />
      </div>

      <div className="container min-h-screen mx-auto px-4 flex flex-col bg-white">
        <div className="flex flex-col lg:hidden gap-4 mt-4">
          <div className="flex  p-2 items-center border rounded-lg justify-between">
            <h1>Filter Products</h1>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex gap-6 mb-10">
          {/* Filters (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterContent />
          </aside>

          {/* Products */}
          <main className="flex-1">
            {searchQuery && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-gray-200">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Search: &quot;{searchTerm}&quot;
                  <div
                    onClick={() => setSearchQuery('')}
                    className="cursor-pointer flex items-center justify-center h-5 w-5 rounded-full bg-blue-200 hover:text-blue-900"
                  >
                    <RxCross2 />
                  </div>
                </Badge>
              </div>
            )}
            {filteredAndSortedProducts.length === 0 ? (
              <p className="text-muted-foreground">No products found.</p>
            ) : viewMode === 'grid' ? (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCards key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCards key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
