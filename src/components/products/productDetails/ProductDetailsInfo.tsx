import { Button } from '@/components/ui/button';
import { Star, Heart, Share2, ShoppingCart, Plus, Minus, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { IProduct } from '@/types/api_types';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addToCart } from '@/redux/features/cart/cartSlice';

interface ProductColor {
  name: string;
  value: string;
  available: boolean;
}
interface ProductDetailsInfoProps {
  product: IProduct;
  // selectedColor: ProductColor;
  // setSelectedColor: (color: ProductColor) => void;
  quantity: number;
  isWishlisted: boolean;
  setIsWishlisted: (wishlisted: boolean) => void;
  // discount: number;
  // savings: number;
  updateQuantity: (newQuantity: number) => void;
  setActiveTab: (value: string) => void;
}

export function ProductDetailsInfo({
  product,
  isWishlisted,
  setIsWishlisted,
  setActiveTab,
}: ProductDetailsInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAtToCart = () => {
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
    alert(`${product.title} is added to cart successfullay. Quantity: ${quantity}`);
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
          {/* <Badge className="text-white bg-red">
            <div>{props.discount}% off</div>
          </Badge> */}
        </div>
        <h1 className="text-2xl !font-medium text-gray-900 mb-4">{product.title}</h1>
        {/* Price */}
        <div className="my-3 flex flex-col gap-1 items-start">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-semibold text-gray-900">৳{product.price}</div>
            {/* {PRODUCT.originalPrice > product.price && (
              <div product="text-xl text-gray-500 line-through">৳{product.originalPrice}</div>
            )} */}
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

      {/* Color Selection */}
      {/* <div>
        <Label className="text-black font-semibold mb-3 block">
          Color: {props.selectedColor.name}
        </Label>
        <div className="flex gap-3">
          {PRODUCT.colors.map((color: ProductColor) => (
            <button
              key={color.name}
              onClick={() => color.available && props.setSelectedColor(color)}
              disabled={!color.available}
              className={`relative w-8 h-8 rounded-full border-2 transition-all ${props.selectedColor.name === color.name ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'} ${!color.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                backgroundColor: color.value,
              }}
            >
              {props.selectedColor.name === color.name && (
                <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
              {!color.available && (
                <X className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </button>
          ))}
        </div>
      </div> */}

      {/* Quantity */}
      <div>
        <Label className="text-black font-semibold mb-3 block">Quantity</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center overflow-hidden border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 font-semibold min-w-[60px] text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={quantity >= 10}
              className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-gray-600">Max 10 per order</span>
        </div>
      </div>

      <div className="border py-6 px-6 lg:px-6 w-full rounded-[4px]">
        <h1 className="text-center font-semibold  underline mb-8">Pricing Details</h1>
        <div>
          <div className="flex items-center justify-center text-xs lg:text-sm text-black-dim">
            <div className="basis-[40%]">
              <p className="font-semibold">Product Quantity</p>
            </div>
            <div className="basis-[60%]">
              <p>{quantity}</p>
            </div>
          </div>
          <span className="w-full h-[1px] block bg-gray-200 mt-4 mb-4 "></span>
          <div className="flex items-center justify-center text-xs lg:text-sm text-black-dim">
            <div className="basis-[40%]">
              <p className="font-semibold">Product Price</p>
            </div>
            <div className="basis-[60%]">
              <p>৳{product.price}</p>
            </div>
          </div>
          <span className="w-full h-[1px] block bg-gray-200 mt-4 mb-4 "></span>
          <div className="flex items-center justify-center text-xs lg:text-sm text-black-dim">
            <div className="basis-[40%]">
              <p className="font-semibold">Pay On Delivery</p>
            </div>
            <div className="basis-[60%]">
              <p>৳ {(product.price * quantity).toFixed(2)} + Shipping Charge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 text-lg shadow-lg"
            disabled={product.stock === 0}
            onClick={handleAtToCart}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`px-4 py-4 ${isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
          </Button>
          <Button size="lg" variant="outline" className="px-4 py-4 bg-transparent">
            <Share2 className="w-5 h-5" />
          </Button>
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
