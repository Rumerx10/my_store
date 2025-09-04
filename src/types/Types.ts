import { LucideIcon } from 'lucide-react';

export interface TabsDataType {
  value: string;
  label: string;
  count: number;
  icon?: LucideIcon | undefined;
}

export interface FilterContentProps {
  selectedBrands: string[];
  setSelectedBrands: (value: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  showInStockOnly: boolean;
  setShowInStockOnly: (value: boolean) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (value: 'grid' | 'list') => void;
  setIsFilterOpen: (value: boolean) => void;
  handleCategoryChange: (category: string, checked: boolean) => void;
  handleBrandChange: (brand: string, checked: boolean) => void;
  clearAllFilters: () => void;
}
