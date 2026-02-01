'use client';
import { Button } from '@/components/ui/button';
import { Star, Edit, Trash2, MessageSquare } from 'lucide-react';
import Image from 'next/image';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      productName: 'Premium Wireless Headphones',
      productImage: '/placeholder.svg',
      rating: 5,
      title: 'Excellent sound quality!',
      content:
        'These headphones exceeded my expectations. The sound quality is crystal clear and the battery life is impressive.',
      date: '2 weeks ago',
      helpful: 24,
      verified: true,
    },
    {
      id: 2,
      productName: 'Smartphone Case',
      productImage: '/placeholder.svg',
      rating: 4,
      title: 'Good protection, great design',
      content:
        'The case offers great protection and looks sleek. Only downside is it can be a bit slippery on smooth surfaces.',
      date: '1 month ago',
      helpful: 15,
      verified: true,
    },
    {
      id: 3,
      productName: 'USB-C Charging Cable',
      productImage: '/placeholder.svg',
      rating: 3,
      title: 'Average quality',
      content: 'It works as expected but durability could be better. The cable feels a bit thin.',
      date: '2 months ago',
      helpful: 8,
      verified: true,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-28 pb-12">
        <div className="container mx-auto px-4 flex flex-col">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
            <p className="text-gray-600 mt-2">You have written {reviews.length} reviews</p>
          </div>

          {/* Reviews List */}
          <div className="mt-8 space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Product Info */}
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    src={review.productImage || '/placeholder.svg'}
                    alt={review.productName}
                    width={80}
                    height={80}
                    className="rounded-lg bg-gray-100 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Product</p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {review.productName}
                        </h3>
                      </div>
                      {review.verified && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold text-gray-700">{review.rating}.0</span>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{review.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <MessageSquare size={16} />
                      <span className="text-sm">{review.helpful} found helpful</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Edit size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
