import Link from 'next/link';
import { Heart, ShoppingCart, TrendingUp, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyWhislist = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Heart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-6">
              Start adding items to your wishlist to keep track of products you love.
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-12">
            <div className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-1">Save Favorites</h3>
              <p className="text-sm text-gray-600">Keep track of items you love</p>
            </div>
            {/* <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Price Tracking</h3>
              <p className="text-sm text-gray-600">Get notified of price drops</p>
            </div> */}
            <div className="text-center">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold mb-1">Easy Shopping</h3>
              <p className="text-sm text-gray-600">Add multiple items to cart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyWhislist;
