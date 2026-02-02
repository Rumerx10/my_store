'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Search, ArrowLeft, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import EmptyWhislist from './EmptyWhislist';
import {
  clearWishlist,
  IWishlistItem,
  removeFromWishlist,
} from '@/redux/features/wishlist/wishlistSlice';
import { addToCart } from '@/redux/features/cart/cartSlice';

export default function Wishlist() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOutOfStock] = useState(true);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const dispatch = useDispatch();

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = wishlistItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = showOutOfStock || item.stock;
      return matchesSearch && matchesStock;
    });
    return filtered;
  }, [wishlistItems, searchQuery, showOutOfStock]);

  const handleRemoveFromWishlist = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeFromWishlist(id));
  };
  const handleAddToCart = (e: React.MouseEvent, item: IWishlistItem) => {
    e.preventDefault();
    e.stopPropagation();
    const newItem = {
      id: item.id,
      title: item.title,
      price: item.price,
      rating: item.rating,
      sold: item.sold,
      quantity: 1,
      image: item.image,
    };
    dispatch(addToCart(newItem));
    dispatch(removeFromWishlist(item.id));
  };
  const handleAddAllToCart = () => {
    const cartItems = wishlistItems.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      rating: item.rating,
      sold: item.sold,
      quantity: 1,
      image: item.image,
    }));
    cartItems.forEach((item) => {
      dispatch(addToCart(item));
    });
    dispatch(clearWishlist());
  };

  return wishlistItems.length === 0 ? (
    <EmptyWhislist />
  ) : (
    <div className="min-h-screen bg-gray-50">
      <div className="container  flex flex-col mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">
              Showing {filteredAndSortedItems.length} of {wishlistItems.length} items
            </p>
          </div>
          <div className="flex gap-2 md:gap-5 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <div className="">
              <Button
                variant="ghost"
                size="lg"
                className="bg-black/10 text-gray-600 hover:text-gray-900"
                onClick={handleAddAllToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add all to cart
              </Button>
            </div>
            <Link href="/products" className="hidden md:block">
              <Button
                variant="ghost"
                size="lg"
                className="bg-black/10 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
        {/* Products Grid/List */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedItems.map((item) => {
              return (
                <Link key={item.id} href={`/products/${item.id}`} className="flex w-full h-full">
                  <Card className="w-full group overflow-hidden border bg-white/10 backdrop-blur-md hover:bg-white/20 hover:shadow-xl transition-all duration-300">
                    <CardContent className="flex flex-col justify-between p-0 h-full">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/0 group-hover:from-black/20 to-transparent duration-300">
                          <div
                            onClick={(e) => handleRemoveFromWishlist(e, item.id)}
                            className="absolute bottom-2 right-2 p-1 hover:bg-gray-200 duration-300 rounded-full"
                          >
                            <Heart className="fill-red text-red" />
                          </div>
                        </div>
                      </div>
                      <div
                        className={`border-t-2 flex flex-col justify-between relative p-4 flex-grow`}
                      >
                        <h3 className="lg:text-xl !font-normal text-black line-clamp-2 transition-colors">
                          {item.title}
                        </h3>
                        <div>
                          <div className="flex gap-2 items-center w-full text-xl lg:text-2xl font-bold text-black">
                            ${item.price}
                          </div>
                          <div className="flex flex-col md:flex-row gap-0 md:gap-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-black ml-1">{item.rating}</span>
                            </div>
                            <p className="flex items-center w-full text-sm text-black whitespace-nowrap">
                              <span className="hidden md:block mr-1">|</span> {item.sold} sold
                            </p>
                          </div>
                          <div className="flex mt-2 gap-2 items-center justify-between">
                            <Button
                              size="lg"
                              variant="secondary"
                              className="w-full flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg"
                              disabled={item.stock === 0}
                              onClick={(e) => handleAddToCart(e, item)}
                            >
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-orange-600 mb-2">No items found</h3>
            <p className="text-orange-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setSearchQuery('');
              }}
              className="bg-blue-700 hover:bg-blue-800 hover:text-white text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
