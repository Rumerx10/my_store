'use client';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Search, Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { menuItems } from '@/docs/navLinks';

const DesktopNav = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countCartItems = useSelector((state: RootState) => state.cart.items.length);
  const countWishlistItems = useSelector((state: RootState) => state.wishlist.items.length);

  useEffect(() => {
    setCartItemCount(countCartItems);
    setWishlistItemCount(countWishlistItems);
  }, [countCartItems, countWishlistItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    router.push(`/products?searchTerm=${searchTerm?.trim()}`);
  };



  return (
    <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="w-full flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              className="h-10 w-auto"
              src={'/logo.png'}
              alt="logo"
              height={40}
              width={120}
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative flex items-center">
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm?.(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search products..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm?.('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-12 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <button
                onClick={handleSearch}
                className="absolute right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <Link
              href="/wish-list"
              className="relative flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <Heart size={24} className="group-hover:scale-110 transition-transform" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/user.webp"
                    alt="profile"
                    height={32}
                    width={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-in fade-in-0 zoom-in-95 origin-top-right">
                  <div className="py-2">
                    {menuItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <IconComponent size={18} className="text-gray-500 flex-shrink-0" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                    <hr className="my-2" />
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={18} className="flex-shrink-0" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
