'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCardGrid from './ProductCardGrid';
import { redirect, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { RxCross2 } from 'react-icons/rx';
import FilterContent from '../FilterContent';
import { IProduct } from '@/types/api_types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState('featured');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();

  const productsData = useSelector((state: RootState) => state.products);
  useEffect(() => {
    setSearchQuery(searchParams.get('searchTerm')?.toLowerCase() || '');
  }, [searchParams]);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  const filteredAndSortedProducts = useMemo(() => {
    const lowerSearchTerm = searchQuery;
    // If searchTerm is 'latest', 'popular', or 'trending', apply the corresponding filter
    if (lowerSearchTerm === 'latest') {
      return productsData.filter((p) => p.latest);
    } else if (lowerSearchTerm === 'popular') {
      return productsData.filter((p) => p.popular);
    } else if (lowerSearchTerm === 'trending') {
      return productsData.filter((p) => p.trending);
    }

    const filtered = productsData.filter((product) => {
      const brandLower = product.brand?.toLowerCase() || '';

      // 1. Search filter - checks title AND brand
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brandLower.includes(searchQuery.toLowerCase());

      // 2. Category filter
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      // 3. Brand filter
      const matchesBrand =
        selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));

      // 4. Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      // 5. Stock filter (using availabilityStatus OR stock > 0)
      const matchesStock =
        !showInStockOnly || product.availabilityStatus === 'In Stock' || product.stock > 0;

      // 6. BONUS: Filter by rating if needed
      // const matchesRating = minRating === 0 || product.rating >= minRating;

      // All conditions must be true
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
      // If using bonus filters:
      // return matchesSearch && matchesCategory && matchesBrand &&
      //        matchesPrice && matchesStock && matchesDiscount && matchesRating;
    });

    // Sorting logic
    filtered.sort((a: IProduct, b: IProduct) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price; // Lowest price first
        case 'price-high':
          return b.price - a.price; // Highest price first
        case 'rating':
          return b.rating - a.rating; // Highest rating first
        case 'name':
          return a.title.localeCompare(b.title); // Alphabetical by title
        case 'discount':
          return b.discountPercentage - a.discountPercentage; // Highest discount first
        case 'featured':
        default:
          if (b.popular !== a.popular) return b.popular ? 1 : -1;
          if (b.trending !== a.trending) return b.trending ? 1 : -1;
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [
    productsData,
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    sortBy,
    showInStockOnly,
    // Add if using bonus filters:
    // minDiscount,
    // minRating
  ]);
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
    redirect('/products');
  };

  return (
    <div className="relative min-h-screen">
      {isFilterOpen && (
        <div
          className={`lg:hidden fixed inset-0 bg-white/50 backdrop-blur-sm 
            z-40 duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      {/* mobile navigation */}
      <div className="container mx-auto px-4 flex flex-col">
        <div
          className={`lg:hidden fixed z-50 w-[80%] md:w-[45%] right-0 bottom-0 top-18 lg:top-20 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            isFilterOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <FilterContent
              selectedBrands={selectedBrands}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showInStockOnly={showInStockOnly}
              setShowInStockOnly={setShowInStockOnly}
              viewMode={viewMode}
              setViewMode={setViewMode}
              setIsFilterOpen={setIsFilterOpen}
              handleCategoryChange={handleCategoryChange}
              handleBrandChange={handleBrandChange}
              clearAllFilters={clearAllFilters}
            />{' '}
          </div>
        </div>
        {/* Mobile Filter  */}
        <div className="flex flex-col lg:hidden gap-4 mt-6">
          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div>
              <h2 className="font-semibold text-gray-900">Filter Products</h2>
              <p className="text-sm text-gray-500">
                {filteredAndSortedProducts.length} products found
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="container min-h-screen mx-auto px-4 flex flex-col">
        {/* Main Content */}
        <div className="flex gap-8 mb-10">
          <aside className="hidden lg:block w-72 flex-shrink-0 mt-6">
            <div className="sticky top-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {/* <FilterContent /> */}
              <FilterContent
                selectedBrands={selectedBrands}
                selectedCategories={selectedCategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showInStockOnly={showInStockOnly}
                setShowInStockOnly={setShowInStockOnly}
                viewMode={viewMode}
                setViewMode={setViewMode}
                setIsFilterOpen={setIsFilterOpen}
                handleCategoryChange={handleCategoryChange}
                handleBrandChange={handleBrandChange}
                clearAllFilters={clearAllFilters}
              />
            </div>
          </aside>

          {/* Products */}
          <main className="flex-1">
            {searchQuery && (
              <div className="flex flex-wrap items-center gap-2 pt-6 pb-4 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-2"
                >
                  Search: &quot;{searchQuery}&quot;
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors"
                  >
                    <RxCross2 className="w-3 h-3" />
                  </button>
                </Badge>
              </div>
            )}

            {filteredAndSortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <Button className="w-40" onClick={clearAllFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-5">
                {filteredAndSortedProducts.map((product: IProduct) => (
                  <ProductCardGrid key={product.id} product={product} textColor="#2b2b2b" />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
