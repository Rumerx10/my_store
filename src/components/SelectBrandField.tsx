'use client';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Label } from './ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';
import { BRANDS } from '@/docs/products';
import { cn } from '@/lib/utils';
const SelectBrandField = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <div>
      <Label htmlFor="brand">Brand</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            className=" h-10 mt-1 text-sm border rounded-md flex items-center py-2 px-3 w-[300px] justify-between"
          >
            {value ? value : <span className="text-sm text-gray-500">Select or type a brand</span>}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search or type a brand..."
              onValueChange={(val) => setValue(val)}
            />
            <CommandList>
              <CommandEmpty>No brand found.</CommandEmpty>
              <CommandGroup>
                {BRANDS.map((brand) => (
                  <CommandItem
                    key={brand}
                    value={brand}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn('mr-2 h-4 w-4', value === brand ? 'opacity-100' : 'opacity-0')}
                    />
                    {brand}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectBrandField;
