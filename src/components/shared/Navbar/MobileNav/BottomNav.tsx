import React, { useRef, useState } from 'react';
import { IoMdHeartEmpty } from 'react-icons/io';
import {
  MdOutlineLocalFireDepartment,
  MdOutlineCardGiftcard,
  MdOutlineHome,
  MdOutlineKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { RxCross2 } from 'react-icons/rx';
import Link from 'next/link';

const navItems = [
  { label: 'Home', src: '/', icon: <MdOutlineHome size={28} />, badge: null, badgePosition: '' },
  {
    label: 'Offers',
    src: '/offers',
    icon: <MdOutlineCardGiftcard size={28} />,
    badge: 3,
    badgePosition: '-right-1',
  },
  {
    label: 'Hot Deals',
    src: 'hot-deals',
    icon: <MdOutlineLocalFireDepartment size={28} />,
    badge: 3,
    badgePosition: 'right-2',
  },
  {
    label: 'Wish List',
    src: 'wish-list',
    icon: <IoMdHeartEmpty size={28} />,
    badge: 5,
    badgePosition: 'right-1.5',
  },
];

const BottomNav = ({searchTerm, setSearchTerm}:{searchTerm:string, setSearchTerm:(value:string)=>void}) => {
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [selected, setSelected] = useState('home');
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isActive = (label: string) => selected === label.toLowerCase();

  const handleSearch = () => {
    router.push(`/products?searchTerm=${searchTerm}`);
    setIsSearchBoxOpen(false);
  };
  return (
    <div>
      {/* Search Box */}
      <div
        className={`fixed z-50 flex items-center duration-200 top-20 w-full border-2 border-card shadow-md bg-white ${
          isSearchBoxOpen ? 'scale-100 h-12' : 'scale-0 h-0 pointer-events-none'
        }`}
      >
        <div className="relative w-full">
          <input
            ref={searchInputRef}
            placeholder="Search"
            className="text-black w-full px-4 h-full outline-0"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchTerm && (
            <div
              onClick={() => {
                setSearchTerm('');
                router.push('/products');
                searchInputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex shrink-0 rounded-full items-center justify-center border border-gray-300 hover:bg-gray-300 duration-300 cursor-pointer"
            >
              <RxCross2 size={22} />
            </div>
          )}
        </div>
        <button
          className="group bg-green hover:bg-hGreen active:bg-hGreen duration-200 px-4 py-2"
          onClick={handleSearch}
        >
          <MdOutlineKeyboardDoubleArrowRight
            color="white"
            size={28}
            className="group-active:scale-90 duration-200"
          />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="lg:hidden z-40 fixed text-white bg-base bottom-0 w-full flex items-center justify-between px-8 py-4 gap-5">
        {navItems.map(({ label, src, icon, badge, badgePosition }) => (
          <Link
            key={label}
            href={src}
            onClick={() => {
              setSelected(label.toLowerCase());
              setIsSearchBoxOpen(false);
            }}
            className={`cursor-pointer flex flex-col gap-1 items-center justify-between relative ${
              isActive(label) ? 'text-green' : 'text-white'
            }`}
          >
            <div className={isActive(label) ? 'text-green' : 'text-black'}>
              {badge != null && (
                <span
                  className={`absolute text-white top-0 h-4 w-4 text-xs font-semibold flex justify-center items-center rounded-full bg-red-500 ${badgePosition}`}
                >
                  {badge}
                </span>
              )}
              {icon}
            </div>
            <p
              className={`whitespace-nowrap font-medium text-xs ${
                isActive(label) ? 'text-green' : 'text-black'
              }`}
            >
              {label}
            </p>
          </Link>
        ))}

        {/* Search Icon */}
        <div
          className="text-black cursor-pointer flex flex-col gap-1 items-center justify-between relative"
          onClick={() => {
            setIsSearchBoxOpen(!isSearchBoxOpen);
            setSelected('search');
            searchInputRef.current?.focus();
          }}
        >
          <div className={`relative ${isActive('search') ? 'text-green' : ''}`}>
            <FiSearch size={28} />
          </div>
          <p
            className={`whitespace-nowrap font-medium text-xs ${
              isActive('search') ? 'text-green' : ''
            }`}
          >
            Search
          </p>
        </div>
      </div>

      {/* Overlay */}
      {isSearchBoxOpen && (
        <div
          className="fixed z-50 inset-0 top-32 bottom-20 backdrop-blur-sm bg-black/10 duration-200"
          onClick={() => setIsSearchBoxOpen(false)}
        />
      )}
    </div>
  );
};

export default BottomNav;
