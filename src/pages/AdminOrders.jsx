import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiSearch, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/helpers';
import PageTransition from '@/components/layout/PageTransition';
import toast from 'react-hot-toast';

const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];

const statusColors = {
  PENDING: 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400',
  CONFIRMED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  SHIPPED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  RETURNED: 'bg-caviar-100 dark:bg-caviar-700 text-caviar-700 dark:text-caviar-300',
};

export default function AdminOrders() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (statusFilter) params.set('status', statusFilter);
  params.set('page', String(page));

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', search, statusFilter, page],
    queryFn: () => api.get(`/orders/admin/all?${params}`).then(r => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, trackingNumber }) => api.put(`/orders/${id}/status`, { status, trackingNumber }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order updated');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
  });

  const refundMutation = useMutation({
    mutationFn: ({ id, reason }) => api.post(`/payments/${id}/refund`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Refund initiated');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Refund failed'),
  });

  const shipMutation = useMutation({
    mutationFn: ({ id, carrier, trackingNumber }) => api.post(`/shipments/${id}/ship`, { carrier, trackingNumber }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order shipped');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Ship failed'),
  });

  const deliverMutation = useMutation({
    mutationFn: (id) => api.post(`/shipments/${id}/deliver`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order delivered');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to mark delivered'),
  });

  if (user?.role !== 'ADMIN') return <Navigate to={user ? '/dashboard' : '/login'} replace />;

  const handleLogout = async () => { await logout(); toast.success('Logged out'); };

  const orders = data?.orders || [];

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="section-subtitle">Admin Panel</p>
              <h1 className="section-title mt-3">Orders</h1>
              <div className="w-16 h-[1px] bg-gold-500 mt-6" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="btn-secondary text-xs">Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary text-xs flex items-center space-x-2"><FiLogOut className="w-4 h-4" /><span>Logout</span></button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
              <input type="text" placeholder="Search order # or customer..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-12 w-full" />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field">
              <option value="">All statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-caviar-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <FiPackage className="w-12 h-12 mx-auto text-caviar-300 mb-4" />
              <p className="text-caviar-500">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-caviar-200 dark:border-caviar-800">
                  <button onClick={() => setExpanded(expanded === order.id ? null : order.id)} className="w-full flex items-center justify-between p-5 text-left hover:bg-caviar-50 dark:hover:bg-caviar-900/50 transition-colors">
                    <div className="flex items-center space-x-6 flex-wrap">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-caviar-400">{new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p className="text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                        <p className="text-xs text-caviar-400">{order.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${statusColors[order.status] || statusColors.PENDING}`}>{order.status}</span>
                      <span className="font-medium">{formatPrice(order.total)}</span>
                    </div>
                  </button>

                  {expanded === order.id && (
                    <div className="border-t border-caviar-200 dark:border-caviar-800 p-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xs tracking-widest uppercase font-medium mb-4">Items</h4>
                          <div className="space-y-2">
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm py-1 border-b border-caviar-100 dark:border-caviar-800 last:border-0">
                                <span>{item.name} <span className="text-caviar-400">x{item.quantity}</span></span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-caviar-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-caviar-500">Shipping</span><span>{formatPrice(order.shippingCost)}</span></div>
                            <div className="flex justify-between"><span className="text-caviar-500">Tax</span><span>{formatPrice(order.tax)}</span></div>
                            {order.discount > 0 && <div className="flex justify-between"><span className="text-caviar-500">Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                            <div className="flex justify-between font-medium pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs tracking-widest uppercase font-medium mb-4">Manage</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Status</label>
                              <select
                                value={order.status}
                                onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value })}
                                className="input-field"
                              >
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Tracking Number</label>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  defaultValue={order.trackingNumber || ''}
                                  placeholder="e.g., 1Z999AA10123456784"
                                  className="input-field flex-1"
                                  id={`tracking-${order.id}`}
                                />
                                <button
                                  onClick={() => statusMutation.mutate({ id: order.id, status: order.status, trackingNumber: document.getElementById(`tracking-${order.id}`)?.value })}
                                  className="btn-primary text-xs"
                                >Save</button>
                              </div>
                            </div>
                            {['CONFIRMED', 'PENDING'].includes(order.status) && order.paymentStatus === 'COMPLETED' && (
                              <div>
                                <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Ship Order</label>
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Carrier, e.g. Delhivery"
                                    className="input-field flex-1"
                                    id={`carrier-${order.id}`}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Tracking #"
                                    className="input-field flex-1"
                                    id={`ship-tracking-${order.id}`}
                                  />
                                  <button
                                    disabled={shipMutation.isPending}
                                    onClick={() => shipMutation.mutate({
                                      id: order.id,
                                      carrier: document.getElementById(`carrier-${order.id}`)?.value,
                                      trackingNumber: document.getElementById(`ship-tracking-${order.id}`)?.value,
                                    })}
                                    className="btn-primary text-xs"
                                  >Ship</button>
                                </div>
                              </div>
                            )}
                            {order.status === 'SHIPPED' && (
                              <button
                                onClick={() => deliverMutation.mutate(order.id)}
                                disabled={deliverMutation.isPending}
                                className="btn-primary text-xs"
                              >Mark Delivered</button>
                            )}
                            <p className="text-xs text-caviar-400">Payment: {order.paymentMethod || '—'} · {order.paymentStatus}</p>
                            {order.shipment && (
                              <p className="text-xs text-caviar-500">Shipment: {order.shipment.carrier} · {order.shipment.trackingNumber} · <span className="text-purple-600 dark:text-purple-400">{order.shipment.status}</span></p>
                            )}
                            {order.statusHistory?.length > 0 && (
                              <div>
                                <p className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">History</p>
                                <div className="space-y-1">
                                  {[...order.statusHistory].reverse().map((h) => (
                                    <div key={h.id} className="flex items-center justify-between text-xs">
                                      <span className="font-medium">{h.status}</span>
                                      <span className="text-caviar-400">{new Date(h.createdAt).toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="pt-2 border-t border-caviar-200 dark:border-caviar-800">
                              {order.refunds?.length > 0 && (
                                <p className="text-xs text-caviar-500 mb-2">
                                  Refund: {order.refunds[order.refunds.length - 1].status} · {formatPrice(order.refunds[order.refunds.length - 1].amount)}
                                  {order.refunds[order.refunds.length - 1].razorpayRefundId && <span className="block truncate">{order.refunds[order.refunds.length - 1].razorpayRefundId}</span>}
                                </p>
                              )}
                              {['CANCELLED', 'RETURNED'].includes(order.status) && order.paymentStatus === 'COMPLETED' && (
                                <button
                                  onClick={() => {
                                    const reason = prompt('Refund reason (optional)') || 'Cancellation/Return refund';
                                    refundMutation.mutate({ id: order.id, reason });
                                  }}
                                  className="btn-primary text-xs"
                                >Initiate Refund</button>
                              )}
                              {['CANCELLED', 'RETURNED'].includes(order.status) && order.paymentStatus === 'REFUNDED' && (
                                <p className="text-xs text-green-600 dark:text-green-400">Refund completed</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {data?.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-caviar-300 dark:border-caviar-600 disabled:opacity-40"><FiChevronLeft className="w-4 h-4" /></button>
                  <span className="text-sm">Page {page} of {data.totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="p-2 border border-caviar-300 dark:border-caviar-600 disabled:opacity-40"><FiChevronRight className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
