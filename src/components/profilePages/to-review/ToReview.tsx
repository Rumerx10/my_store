'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const ToReview = () => {
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const pendingReviews = [
    {
      id: 1,
      productName: 'Ultra HD 4K Monitor',
      productImage: '/placeholder.svg',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-20',
      price: '$299.99',
    },
    {
      id: 2,
      productName: 'Mechanical Keyboard RGB',
      productImage: '/placeholder.svg',
      orderDate: '2024-01-10',
      deliveryDate: '2024-01-18',
      price: '$89.99',
    },
    {
      id: 3,
      productName: 'Wireless Mouse Pro',
      productImage: '/placeholder.svg',
      orderDate: '2024-01-08',
      deliveryDate: '2024-01-16',
      price: '$49.99',
    },
    {
      id: 4,
      productName: 'USB-C Hub Adapter',
      productImage: '/placeholder.svg',
      orderDate: '2024-01-05',
      deliveryDate: '2024-01-12',
      price: '$39.99',
    },
  ];

  const handleSubmitReview = () => {
    console.log('[v0] Review submitted:', { productId: reviewingId, rating, title, content });
    setReviewingId(null);
    setRating(0);
    setTitle('');
    setContent('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-28 pb-12">
        <div className="container mx-auto px-4 flex flex-col">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products to Review</h1>
            <p className="text-gray-600 mt-2">
              You have {pendingReviews.length} products pending your review
            </p>
          </div>

          {/* Products Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingReviews.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Product Info */}
                <div className="flex gap-4 mb-6">
                  <Image
                    src={product.productImage || '/placeholder.svg'}
                    alt={product.productName}
                    width={100}
                    height={100}
                    className="rounded-lg bg-gray-100 object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.productName}</h3>
                    <p className="text-lg font-bold text-gray-900 mb-3">{product.price}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Delivered: {product.deliveryDate}</p>
                    </div>
                  </div>
                </div>

                {reviewingId === product.id ? (
                  // Review Form
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              size={28}
                              className={
                                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Review Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summary of your review"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Review Content */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Your Review
                      </label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full min-h-32"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSubmitReview}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Submit Review
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setReviewingId(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Review Button
                  <Button
                    onClick={() => {
                      setReviewingId(product.id);
                      setRating(0);
                      setTitle('');
                      setContent('');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Write Review
                  </Button>
                )}
              </div>
            ))}
          </div>

          {pendingReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products pending review at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToReview;
