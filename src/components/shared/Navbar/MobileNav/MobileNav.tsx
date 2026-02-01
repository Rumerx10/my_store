'use client';
import Image from 'next/image';
import { useState } from 'react';
import BottomNav from './BottomNav';
// import { usePathname } from 'next/navigation';
import { Turn as Hamburger } from 'hamburger-react';
import { PiShoppingCart } from 'react-icons/pi';
// import { NavLinks } from '@/docs/navLinks';
import { GrChatOption } from 'react-icons/gr';
import Link from 'next/link';
import { menuItems } from '@/docs/navLinks';

const MobileNav = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div>
      <div className="lg:hidden bg-navWhite fixed z-50 right-0 left-0 backdrop-blur-2xl text-white h-18 flex items-center justify-center">
        <div className="container px-4 w-full flex items-center justify-between">
          <div className="text-black">
            <Hamburger size={24} toggled={isOpen} toggle={setOpen} />
          </div>
          <Link href="/">
            <Image src={'/logo.png'} alt="logo" height={100} width={120} />
          </Link>
          <div className="flex gap-5 text-black">
            <Link
              href="/cart"
              className="flex flex-col gap-1 items-center justify-between relative"
            >
              <div className="relative">
                <div className="absolute z-40 -right-1 top-0 h-3.5 w-3.5 text-xs text-white font-semibold flex justify-center items-center rounded-full bg-red-500">
                  6
                </div>
                <PiShoppingCart size={24} className="active:scale-90 duration-200" />
              </div>
              <p className="whitespace-nowrap font-medium text-xs">Cart</p>
            </Link>

            <Link
              href="/chat"
              className="flex flex-col gap-1 relative items-center justify-center font-medium text-gray-700 cursor-pointer"
            >
              <GrChatOption size={24} />
              <p className="whitespace-nowrap font-medium text-xs">Chat</p>
            </Link>
          </div>
        </div>
      </div>
      <BottomNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* <CategorySidebar isOpen={isOpen} setOpen={setOpen} activeLabel={activeLabel} mobile={true} /> */}
      <aside
        className={`lg:hidden fixed z-50 top-20 inset-0 duration-300 ${isOpen ? 'backdrop-blur-md bg-black/30 opacity-100' : 'opacity-0 pointer-events-none'} `}
        onClick={() => setOpen(false)}
      >
        <div
          className={`absolute duration-300 bg-white ${isOpen ? 'translate-x-0' : '-translate-x-full'} top-0 bottom-0 left-0 w-[60%] shadow-xl z-50`}
        >
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
        </div>
      </aside>
    </div>
  );
};

export default MobileNav;
