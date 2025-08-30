'use client';

import { useState } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav/MobileNav';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <DesktopNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <MobileNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
  );
};

export default Navbar;
