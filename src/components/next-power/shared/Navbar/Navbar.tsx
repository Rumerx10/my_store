'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav/MobileNav';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const submitSearch = () => {
    const term = searchTerm.trim();
    router.push(
      term ? `/next-power/products?searchTerm=${encodeURIComponent(term)}` : '/next-power/products',
    );
  };

  // Clearing the box also removes the search from the product list it filtered.
  const clearSearch = () => {
    setSearchTerm('');
    if (pathname !== '/next-power/products') return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has('searchTerm')) return;
    params.delete('searchTerm');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <header>
      <DesktopNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        submitSearch={submitSearch}
        clearSearch={clearSearch}
      />
      <MobileNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        submitSearch={submitSearch}
        clearSearch={clearSearch}
      />
    </header>
  );
};

export default Navbar;
