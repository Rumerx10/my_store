import { LucideIcon } from 'lucide-react';

export interface TabsDataType {
  value: string;
  label: string;
  count: number;
  icon?: LucideIcon | undefined;
}

export interface FilterContentProps {
  selectedBrands: string[];
  selectedCategories: string[];
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

export interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'number';
  className?: string;
}
