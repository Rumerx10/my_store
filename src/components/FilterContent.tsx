import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { FilterContentProps } from '@/types/Types';
import { BRANDS, CATEGORIES, PRICE_CEILING } from '@/docs/products';
import { categoryLabel } from '@/docs/navLinks';
import { formatPrice } from '@/lib/utils';

const checkboxClass = 'data-[state=checked]:border-brand data-[state=checked]:bg-brand';

const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="border-t border-gray-100 dark:border-white/5 pt-5 first:border-t-0 first:pt-0">
    <legend className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-100">
      {title}
    </legend>
    {children}
  </fieldset>
);

const FilterContent = ({
  selectedBrands,
  selectedCategories,
  priceRange,
  setPriceRange,
  showInStockOnly,
  setShowInStockOnly,
  handleCategoryChange,
  handleBrandChange,
  clearAllFilters,
}: FilterContentProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">Filters</h2>
        <button
          type="button"
          onClick={clearAllFilters}
          className="rounded text-sm font-medium text-brand transition-colors hover:text-brand-hover"
        >
          Reset
        </button>
      </div>

      <FilterGroup title="Category">
        <div className="space-y-2.5">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-3">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                className={checkboxClass}
              />
              <Label
                htmlFor={`category-${category}`}
                className="cursor-pointer text-sm font-normal text-gray-700 dark:text-slate-300"
              >
                {categoryLabel(category)}
              </Label>
            </div>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Brand">
        <div className="-mr-2 max-h-56 space-y-2.5 overflow-y-auto pr-2">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center gap-3">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked === true)}
                className={checkboxClass}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="cursor-pointer text-sm font-normal text-gray-700 dark:text-slate-300"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={PRICE_CEILING}
          min={0}
          step={10}
          aria-label="Price range"
          className="my-2 [&_[role=slider]]:size-5 [&_[role=slider]]:border-brand [&_[role=slider]]:bg-white dark:[&_[role=slider]]:bg-slate-900 [&_[role=slider]]:shadow-card"
        />
        <div className="mt-3 flex items-center justify-between text-sm tabular-nums text-gray-700 dark:text-slate-300">
          <span>{formatPrice(priceRange[0])}</span>
          <span className="text-gray-400 dark:text-slate-500">to</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <div className="flex items-center gap-3">
          <Checkbox
            id="in-stock"
            checked={showInStockOnly}
            onCheckedChange={(checked) => setShowInStockOnly(checked === true)}
            className={checkboxClass}
          />
          <Label
            htmlFor="in-stock"
            className="cursor-pointer text-sm font-normal text-gray-700 dark:text-slate-300"
          >
            In stock only
          </Label>
        </div>
      </FilterGroup>
    </div>
  );
};

export default FilterContent;
