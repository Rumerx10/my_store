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
import { FaAddressBook, FaBoxOpen, FaStar, FaEdit, FaCommentDots } from 'react-icons/fa';
import { LogOut } from 'lucide-react';
import { FaUserGear } from 'react-icons/fa6';

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
      <div className="lg:hidden bg-navWhite fixed z-50 right-0 left-0 backdrop-blur-2xl text-white h-20 flex items-center justify-center">
        <div className="container px-4 w-full flex items-center justify-between">
          <div className="text-black">
            <Hamburger size={28} toggled={isOpen} toggle={setOpen} />
          </div>
          <Image src={'/logo.png'} alt="logo" height={100} width={120} />
          <div className="flex gap-5 text-black">
            <Link
              href="/cart"
              className="flex flex-col gap-1 items-center justify-between relative"
            >
              <div className="relative">
                <div className="absolute z-40 -right-1.5 top-0 h-4 w-4 text-xs text-white font-semibold flex justify-center items-center rounded-full bg-red-500">
                  6
                </div>
                <PiShoppingCart size={28} className="active:scale-90 duration-200" />
              </div>
              <p className="whitespace-nowrap font-medium text-xs">Cart</p>
            </Link>

            <div className="flex flex-col gap-1 relative items-center justify-center font-medium text-blue-600 cursor-pointer">
              <GrChatOption size={28} />
              <p className="whitespace-nowrap font-medium text-xs">Chat</p>
            </div>
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
          {/* Profile */}
          <div className="flex gap-2 items-center px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
            <FaUserGear size={20} className="text-gray-600" />
            <span className="font-medium">Profile</span>
          </div>

          {/* Address Book */}
          <div className="flex gap-2 items-center px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
            <FaAddressBook size={20} className="text-gray-600" />
            <span className="font-medium">Address Book</span>
          </div>

          {/* My Orders */}
          <div className="flex gap-2 items-center px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
            <FaBoxOpen size={20} className="text-gray-600" />
            <span className="font-medium">My Orders</span>
          </div>

          {/* My Reviews */}
          <div className="flex gap-2 items-center px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
            <FaStar size={20} className="text-gray-600" />
            <span className="font-medium">My Reviews</span>
          </div>

          {/* To Review */}
          <div className="flex gap-2 items-center px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
            <FaEdit size={20} className="text-gray-600" />
            <span className="font-medium">To Review</span>
          </div>

          {/* Feedback */}
          <div className="flex gap-2 items-center px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
            <FaCommentDots size={20} className="text-gray-600" />
            <span className="font-medium">Feedback</span>
          </div>

          {/* Logout */}
          <div className="flex text-red-500 gap-2 items-center justify-center px-4 py-2 border-b">
            <LogOut size={20} /> Logout
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MobileNav;
