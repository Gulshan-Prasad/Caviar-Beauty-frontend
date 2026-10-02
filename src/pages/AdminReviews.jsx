import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { FiStar, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import PageTransition from '@/components/layout/PageTransition';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  const params = new URLSearchParams();
  if (statusFilter) params.set('status', statusFilter);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', statusFilter],
    queryFn: () => api.get(`/reviews/admin/all?${params}`).then(r => r.data),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/reviews/${id}/active`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success('Review status updated');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
  });

  if (user?.role !== 'ADMIN') return <Navigate to={user ? '/dashboard' : '/login'} replace />;

  const handleLogout = async () => { await logout(); toast.success('Logged out'); };

  const reviews = data?.reviews || [];

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="section-subtitle">Admin Panel</p>
              <h1 className="section-title mt-3">Reviews</h1>
              <div className="w-16 h-[1px] bg-gold-500 mt-6" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="btn-secondary text-xs">Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary text-xs flex items-center space-x-2"><FiLogOut className="w-4 h-4" /><span>Logout</span></button>
            </div>
          </div>

          <div className="mb-6 flex items-center space-x-2">
            {[['', 'All'], ['active', 'Active'], ['inactive', 'Hidden']].map(([val, label]) => (
              <button
                key={val || 'all'}
                onClick={() => setStatusFilter(val)}
                className={`text-xs tracking-wider uppercase px-3 py-1.5 border transition-colors ${statusFilter === val ? 'bg-gold-500 border-gold-500 text-white' : 'border-caviar-300 dark:border-caviar-600 text-caviar-500 hover:border-gold-500'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-caviar-400">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20">
              <FiMessageSquare className="w-12 h-12 mx-auto text-caviar-300 mb-4" />
              <p className="text-caviar-500">No reviews found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-caviar-200 dark:border-caviar-800 p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[260px]">
                      <div className="flex items-center space-x-3 flex-wrap">
                        <p className="text-sm font-medium">{review.user.firstName} {review.user.lastName}</p>
                        <a href={`mailto:${review.user.email}`} className="text-xs text-caviar-500 hover:text-gold-500">{review.user.email}</a>
                        <span className="text-caviar-300">·</span>
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <FiStar key={i} className="w-3 h-3 fill-gold-500 text-gold-500" />
                          ))}
                        </div>
                      </div>
                      {review.title && <p className="text-sm font-medium mt-2">{review.title}</p>}
                      {review.comment && <p className="text-sm text-caviar-600 dark:text-caviar-300 mt-1">{review.comment}</p>}
                      <p className="text-xs text-caviar-400 mt-2">
                        Product: <Link to={`/product/${review.product?.slug}`} className="text-gold-600 dark:text-gold-400 underline">{review.product?.name}</Link>
                      </p>
                      <p className="text-xs text-caviar-400 mt-1">{new Date(review.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${review.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        {review.isActive ? 'Active' : 'Hidden'}
                      </span>
                      {review.isVerified && (
                        <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">Verified Buyer</span>
                      )}
                      <button
                        onClick={() => toggleMutation.mutate({ id: review.id, isActive: !review.isActive })}
                        className={`text-xs tracking-wider uppercase px-3 py-1.5 border transition-colors ${
                          review.isActive ? 'border-red-400 text-red-500 hover:bg-red-500 hover:text-white' : 'border-green-400 text-green-600 hover:bg-green-500 hover:text-white'
                        }`}
                      >
                        {review.isActive ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}