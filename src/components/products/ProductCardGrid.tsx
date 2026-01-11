'use client';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { IProduct } from '@/types/api_types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addToWishlist } from '@/redux/features/wishlist/wishlistSlice';

const ProductCardGrid = ({ product }: { product: IProduct; textColor?: string }) => {
  const dispatch = useDispatch();
  const wishlistProducts = useSelector((state: RootState) => state.wishlist.items).map(
    (product) => product.id,
  );
  console.log('Wishlist Products ::', wishlistProducts);

  const handleAddToWishlist = (e: React.MouseEvent, product: IProduct) => {
    e.preventDefault();
    e.stopPropagation();
    const productToAdd = {
      id: product.id,
      title: product.title,
      price: product.price,
      rating: product.rating,
      sold: 23,
      stock: product.stock,
      image: product.images[0],
    };
    console.log('Product To Add :::', productToAdd);
    dispatch(addToWishlist(productToAdd));
  };
  return (
    <Link href={`/products/${product.id}`} className="flex w-full h-full">
      <Card className="w-full group overflow-hidden border bg-white/10 backdrop-blur-md hover:bg-white/20 hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col justify-between p-0 h-full">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images?.[0] || '/placeholder.svg'}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-110 duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/0 group-hover:from-black/20 to-transparent duration-300">
              <div
                onClick={(e) => handleAddToWishlist(e, product)}
                className="absolute bottom-2 right-2 p-1 hover:bg-gray-200 duration-300 rounded-full"
              >
                <Heart
                  className={`shrink-0 duration-300 cursor-pointer ${wishlistProducts.includes(product.id) ? 'fill-red text-red' : 'text-gray-200 group-hover:text-white'}`}
                />
              </div>
            </div>
          </div>

          <div className={`flex flex-col justify-between relative p-4 flex-grow`}>
            <h3 className="lg:text-xl !font-normal text-black line-clamp-2 transition-colors">
              {product.title}
            </h3>
            <div>
              <div className="flex gap-2 items-center w-full text-xl lg:text-2xl font-bold text-black">
                ${product.price}
                {/* {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-sm font-medium text-gray-500 line-through">
                    ${product.originalPrice}
                  </div>
                )} */}
              </div>
              <div className="flex flex-col md:flex-row gap-0 md:gap-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-black ml-1">{product.rating}</span>
                </div>
                <p className="flex items-center w-full text-sm text-black whitespace-nowrap">
                  <span className="hidden md:block mr-1">|</span> {product.reviews.length} sold
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCardGrid;
