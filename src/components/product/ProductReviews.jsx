import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { useInView } from '@/hooks/useInView';
import { useAuthStore } from '@/store/authStore';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function ProductReviews({ reviews, productId }) {
  const { ref, isInView } = useInView();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  const submitMutation = useMutation({
    mutationFn: () => api.post('/reviews', { productId, rating, title, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast.success('Review submitted. Thank you!');
      setRating(0); setTitle(''); setComment('');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to submit review'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    submitMutation.mutate();
  };

  return (
    <section ref={ref} className="mt-16 pt-16 border-t border-caviar-200 dark:border-caviar-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-lg tracking-widest uppercase font-medium mb-8">Customer Reviews ({reviews.length})</h3>

        {isAuthenticated && (
          <form onSubmit={handleSubmit} className="mb-10 p-6 border border-caviar-200 dark:border-caviar-800">
            <h4 className="text-xs tracking-widest uppercase font-medium mb-4">Write a Review</h4>
            <div className="flex items-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} className="p-0.5">
                  <FiStar className={`w-5 h-5 ${n <= (hover || rating) ? 'fill-gold-500 text-gold-500' : 'text-caviar-300 dark:text-caviar-600'}`} />
                </button>
              ))}
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Review title (optional)"
              className="input-field mb-3"
              maxLength={80}
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              className="input-field mb-4 resize-none"
            />
            <button type="submit" disabled={submitMutation.isPending} className="btn-primary text-xs">
              {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        <div className="space-y-8">
          {reviews.length === 0 && (
            <p className="text-caviar-400">No reviews yet. Be the first to review this product.</p>
          )}
          {reviews.slice(0, 5).map((review) => (
            <div key={review.id} className="pb-6 border-b border-caviar-100 dark:border-caviar-800 last:border-0">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-caviar-100 dark:bg-caviar-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium">{review.user.firstName[0]}{review.user.lastName[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1 flex-wrap">
                    <p className="text-sm font-medium">{review.user.firstName} {review.user.lastName}</p>
                    {review.isVerified && (
                      <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700">Verified Buyer</span>
                    )}
                    <span className="text-caviar-300">·</span>
                    <div className="flex items-center space-x-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FiStar key={i} className="w-3 h-3 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                  </div>
                  {review.title && <p className="text-sm font-medium mt-2">{review.title}</p>}
                  {review.comment && <p className="text-sm text-caviar-600 dark:text-caviar-300 mt-1">{review.comment}</p>}
                  <p className="text-xs text-caviar-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
