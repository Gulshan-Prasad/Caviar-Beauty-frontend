import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import { formatPrice, getImageUrl } from '@/utils/helpers';
import PageTransition from '@/components/layout/PageTransition';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';

const statusColors = {
  PENDING: 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400',
  CONFIRMED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  SHIPPED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  RETURNED: 'bg-caviar-100 dark:bg-caviar-700 text-caviar-700 dark:text-caviar-300',
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then(r => r.data),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.post(`/orders/${id}/cancel`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['order', id] }); toast.success('Order cancelled'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Cannot cancel order'),
  });

  const returnMutation = useMutation({
    mutationFn: () => api.post(`/orders/${id}/return`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['order', id] }); toast.success('Return requested'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Cannot return order'),
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen text-center text-caviar-400">Loading order...</div>
      </PageTransition>
    );
  }

  if (!order) return <Navigate to="/dashboard" replace />;

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[960px] mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-sm text-caviar-500 hover:text-caviar-950 dark:hover:text-white mb-8 transition-colors">
            <FiArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>

          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="section-subtitle">Order</p>
              <h1 className="section-title mt-3">{order.orderNumber}</h1>
              <div className="w-16 h-[1px] bg-gold-500 mt-6" />
            </div>
            <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${statusColors[order.status] || statusColors.PENDING}`}>{order.status}</span>
          </div>

          <div className="space-y-6">
            <div className="p-8 border border-caviar-200 dark:border-caviar-800">
              <h3 className="text-sm tracking-widest uppercase font-medium mb-6">Items</h3>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-caviar-100 dark:border-caviar-800 last:border-0">
                    <div className="w-16 h-20 bg-caviar-100 dark:bg-caviar-800 flex-shrink-0">
                      <img src={getImageUrl(item.product?.images?.[0]?.url || '')} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-caviar-500 mt-1">
                        {item.color && `Color: ${item.color}`}{item.color && item.size ? ' · ' : ''}{item.size && `Size: ${item.size}`}
                      </p>
                      <p className="text-xs text-caviar-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-caviar-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-caviar-500">Shipping</span><span>{formatPrice(order.shippingCost)}</span></div>
                <div className="flex justify-between"><span className="text-caviar-500">Tax</span><span>{formatPrice(order.tax)}</span></div>
                {order.discount > 0 && <div className="flex justify-between"><span className="text-caviar-500">Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between font-medium pt-2 border-t border-caviar-200 dark:border-caviar-800"><span>Total</span><span>{formatPrice(order.total)}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 border border-caviar-200 dark:border-caviar-800">
                <h3 className="text-sm tracking-widest uppercase font-medium mb-4">Shipping</h3>
                <p className="text-sm text-caviar-600 dark:text-caviar-300">Method: {order.paymentMethod || '—'}</p>
                <p className="text-sm text-caviar-600 dark:text-caviar-300 mt-2">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                {order.shipment && (
                  <>
                    <p className="text-sm text-caviar-600 dark:text-caviar-300 mt-2">Carrier: {order.shipment.carrier}</p>
                    {order.shipment.trackingUrl ? (
                      <a href={order.shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gold-600 dark:text-gold-400 mt-2 inline-block underline">Track package: {order.shipment.trackingNumber}</a>
                    ) : (
                      <p className="text-sm text-caviar-600 dark:text-caviar-300 mt-2">Tracking: {order.shipment.trackingNumber}</p>
                    )}
                    <p className="text-sm text-caviar-600 dark:text-caviar-300 mt-2">Shipment status: <span className="font-medium">{order.shipment.status}</span></p>
                  </>
                )}
                {!order.shipment && order.trackingNumber && <p className="text-sm text-caviar-600 dark:text-caviar-300 mt-2">Tracking: {order.trackingNumber}</p>}
                {order.estimatedDelivery && <p className="text-sm text-caviar-600 dark:text-caviar-300 mt-2">Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>}
              </div>

              {order.statusHistory?.length > 0 && (
                <div className="p-8 border border-caviar-200 dark:border-caviar-800">
                  <h3 className="text-sm tracking-widest uppercase font-medium mb-6">Order Timeline</h3>
                  <div className="space-y-4">
                    {[...order.statusHistory].reverse().map((h, i) => (
                      <div key={h.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <span className={`w-3 h-3 rounded-full mt-1 ${i === 0 ? 'bg-gold-500' : 'bg-caviar-300 dark:bg-caviar-600'}`} />
                          {i < order.statusHistory.length - 1 && <span className="w-px flex-1 bg-caviar-200 dark:bg-caviar-700 min-h-[24px]" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium">{h.status}</p>
                          <p className="text-xs text-caviar-500">{new Date(h.createdAt).toLocaleString()}{h.note ? ` · ${h.note}` : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-8 border border-caviar-200 dark:border-caviar-800">
                <h3 className="text-sm tracking-widest uppercase font-medium mb-4">Actions</h3>
                <a
                  href={`${api.defaults?.baseURL || '/api'}/orders/${order.id}/invoice`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `${api.defaults?.baseURL || '/api'}/orders/${order.id}/invoice`;
                  }}
                  className="btn-secondary w-full text-xs mb-3"
                >
                  <FiPackage className="inline w-4 h-4 mr-2" />Download Invoice
                </a>
                {['PENDING', 'CONFIRMED'].includes(order.status) && (
                  <button onClick={() => { if (confirm('Cancel this order?')) cancelMutation.mutate(); }} className="btn-secondary w-full text-xs mb-3">Cancel Order</button>
                )}
                {order.status === 'DELIVERED' && (
                  <button onClick={() => returnMutation.mutate()} className="btn-secondary w-full text-xs">Request Return</button>
                )}
                {['CANCELLED', 'RETURNED'].includes(order.status) && order.paymentStatus === 'REFUNDED' && (
                  <p className="text-sm text-green-600 dark:text-green-400 mb-3">Refund issued for this order.</p>
                )}
                {['CANCELLED', 'RETURNED'].includes(order.status) && order.paymentStatus === 'REFUNDING' && (
                  <p className="text-sm text-gold-600 dark:text-gold-400 mb-3">Refund in progress. It may take 3-7 business days to reflect.</p>
                )}
                {['CANCELLED', 'RETURNED'].includes(order.status) && order.paymentStatus === 'COMPLETED' && (
                  <p className="text-sm text-caviar-400 mb-3">Refund pending, will be processed shortly.</p>
                )}
                {!['PENDING', 'CONFIRMED'].includes(order.status) && order.status !== 'DELIVERED' && order.paymentStatus !== 'REFUNDED' && order.paymentStatus !== 'REFUNDING' && (
                  <p className="text-sm text-caviar-400">No actions available for this order.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
