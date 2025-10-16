import Image from 'next/image';
import { Star, ShoppingCart, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductType } from '@/types/product';
import Link from 'next/link';

const ProductCardGrid = ({
  product,
  isNew = false,
}: {
  product: ProductType;
  isNew?: boolean;
  discount?: number;
  textColor?: string;
}) => {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border bg-white/10 backdrop-blur-md hover:bg-white/20 hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col justify-between p-0 h-full">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Badges */}
            <div className="absolute top-3 left-3">
              {product.badge && (
                <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-lg">
                  {product.badge}
                </Badge>
              )}
              {isNew && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 ml-2 shadow-lg">
                  New
                </Badge>
              )}
            </div>
            <div className="absolute bottom-2 right-2">
              <Heart className="fill-red text-red" />
            </div>
          </div>

          <div className={`relative p-4 flex-grow`}>
            <h3 className="lg:text-xl !font-normal text-black line-clamp-2 transition-colors">
              {product.name}
            </h3>
            <div className="flex gap-2 items-center w-full text-xl lg:text-2xl font-bold text-black">
              ${product.price}
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-sm font-medium text-gray-500 line-through">
                  ${product.originalPrice}
                </div>
              )}
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
                <span className="hidden md:block mr-1">|</span> {product.reviews} sold
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCardGrid;
