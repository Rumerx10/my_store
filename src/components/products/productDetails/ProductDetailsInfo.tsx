import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { IProduct } from '@/types/api_types';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/features/cart/cartSlice';
import { RootState } from '@/redux/store';
import { addToWishlist } from '@/redux/features/wishlist/wishlistSlice';
import toast from 'react-hot-toast';

interface ProductDetailsInfoProps {
  product: IProduct;
  quantity: number;
  setQuantity: (value: number) => void;
  setActiveTab: (value: string) => void;
}

export function ProductDetailsInfo({
  product,
  setActiveTab,
  quantity,
  setQuantity,
}: ProductDetailsInfoProps) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items).map(
    (item) => item.id,
  );

  const handleAddToCart = (e: React.MouseEvent, product: IProduct) => {
    e.preventDefault();
    e.stopPropagation();
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images[0] || 'placeholder.svg',
      rating: product.rating,
      sold: 21,
    };
    dispatch(addToCart(cartItem));
    toast.success(`${product.title} is added to cart successfully. Quantity: ${quantity}`);
  };

  const handleWishlist = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    const productToAdd = {
      id: id,
      title: product.title,
      price: product.price,
      rating: product.rating,
      sold: 23,
      stock: product.stock,
      image: product.images[0],
    };
    dispatch(addToWishlist(productToAdd));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {/* Stock Info */}
          {product.stock !== 0 && (
            <Badge variant="outline" className="flex items-center gap-2 bg-green">
              <Check className="w-5 h-5" />
              <span className="font-medium">
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left in stock`}
              </span>
            </Badge>
          )}
        </div>
        <h1 className="text-2xl !font-medium text-gray-900 mb-4">{product.title}</h1>
        {/* Price */}
        <div className="my-3 flex flex-col gap-1 items-start">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-semibold text-gray-900">৳{product.price}</div>
          </div>
        </div>
        {/* Rating */}
        <Link
          href="#reviews"
          onClick={() => setActiveTab('reviews')}
          className="cursor-pointer flex flex-col gap-4 mb-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-lg font-semibold text-gray-900 ml-2">{product.rating}</span>
            </div>
            <span className="text-gray-600 hover:text-blue-700 ">
              | {product.reviews.length.toLocaleString()} reviews
            </span>
          </div>
        </Link>
      </div>

      {/* Quantity */}
      <div>
        <Label className="text-black font-semibold mb-3 block">Quantity</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center overflow-hidden border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 font-semibold min-w-[60px] text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= 10}
              className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-gray-600">Max 10 per order</span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex mt-2 gap-2 items-center justify-between">
          <Button
            size="lg"
            variant="secondary"
            className="w-full flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg"
            disabled={product.stock === 0}
            onClick={(e) => handleAddToCart(e, product)}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
          <div
            onClick={(e) => handleWishlist(e, product.id)}
            className="border rounded-md p-2 cursor-pointer"
          >
            <Heart
              className={`shrink-0 duration-300 cursor-pointer ${wishlistItems.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </div>
        </div>

        <Button
          size="lg"
          variant="outline"
          className="w-full py-4 text-lg font-semibold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors bg-transparent"
          disabled={product.stock === 0}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
