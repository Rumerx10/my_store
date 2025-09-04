
import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { RxCross2 } from 'react-icons/rx';
import { FilterContentProps } from "@/types/Types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FilterContent=({
  selectedBrands,
  setSelectedBrands,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  showInStockOnly,
  setShowInStockOnly,
  viewMode,
  setViewMode,
  setIsFilterOpen,
  handleCategoryChange,
  handleBrandChange,
  clearAllFilters,
}:FilterContentProps)=> {
    return (<div className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl w-full text-center font-semibold text-gray-900">
                    Filters
                  </h3>
                  <Button variant="outline" className="lg:hidden bg-gray-100" onClick={() => setIsFilterOpen(false)}>
                    <RxCross2 className="w-4 h-4" />
                  </Button>
                </div>

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

                  <div className="flex items-center justify-center">
                    <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="px-3">
                      {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent hover:bg-gray-50 border-gray-200">
                  Clear All Filters
                </Button>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4 text-gray-900">Categories</h4>
                  <div className="space-y-3">
                    {CATEGORIES.map(category => <div key={category} className="flex items-center space-x-3">
                        <Checkbox id={`category-${category}`} checked={includes(category)} onCheckedChange={checked => handleCategoryChange(category, (checked as boolean))} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                        <Label htmlFor={`category-${category}`} className="text-sm font-normal text-gray-700 cursor-pointer">
                          {category}
                        </Label>
                      </div>)}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4 text-gray-900">Brands</h4>
                  <div className="space-y-3">
                    {BRANDS.map(brand => <div key={brand} className="flex items-center space-x-3">
                        <Checkbox id={`brand-${brand}`} checked={_includes(brand)} onCheckedChange={checked => handleBrandChange(brand, (checked as boolean))} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                        <Label htmlFor={`brand-${brand}`} className="text-sm font-normal text-gray-700 cursor-pointer">
                          {brand}
                        </Label>
                      </div>)}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4 text-gray-900">Price Range</h4>
                  <div className="px-1">
                    <div className="relative">
                      <Slider value={priceRange} onValueChange={setPriceRange} max={300} min={0} step={10} className="mb-4 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600 [&_[role=slider]]:shadow-md [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_.range]:bg-blue-600" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">${priceRange.0]}</span>
                        <span className="text-xs text-gray-500">-</span>
                        <span className="text-sm font-medium text-gray-900">${priceRange.1]}</span>
                      </div>
                      <span className="text-xs text-gray-500">Max: $300</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="in-stock" checked={showInStockOnly} onCheckedChange={checked => setShowInStockOnly((checked as boolean))} className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                    <Label htmlFor="in-stock" className="text-sm font-normal text-gray-700 cursor-pointer">
                      In stock only
                    </Label>
                  </div>
                </div>
              </div>);
}


export default FilterContent;