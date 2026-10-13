'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav/MobileNav';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const submitSearch = () => {
    const term = searchTerm.trim();
    router.push(term ? `/products?searchTerm=${encodeURIComponent(term)}` : '/products');
  };

  return (
    <header>
      <DesktopNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        submitSearch={submitSearch}
      />
      <MobileNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        submitSearch={submitSearch}
      />
    </header>
  );
};

export default Navbar;
