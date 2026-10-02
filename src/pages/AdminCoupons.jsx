import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { FiPercent, FiPlus, FiTrash2, FiLogOut, FiEdit2 } from 'react-icons/fi';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import PageTransition from '@/components/layout/PageTransition';
import toast from 'react-hot-toast';

const emptyForm = { code: '', discountType: 'percentage', discountValue: '', minOrder: '', maxDiscount: '', usageLimit: '', expiresAt: '', description: '' };

export default function AdminCoupons() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({ queryKey: ['admin-coupons'], queryFn: () => api.get('/coupons').then(r => r.data) });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/coupons', payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Coupon created'); setForm(emptyForm); setEditing(null); },
    onError: (err) => toast.error(err.response?.data?.error || 'Create failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/coupons/${id}`, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Coupon updated'); setForm(emptyForm); setEditing(null); },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/coupons/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Coupon deleted'); },
  });

  if (user?.role !== 'ADMIN') return <Navigate to={user ? '/dashboard' : '/login'} replace />;

  const handleLogout = async () => { await logout(); toast.success('Logged out'); };

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) return toast.error('Code and value are required');
    const payload = { ...form, discountValue: parseFloat(form.discountValue) };
    if (editing) updateMutation.mutate({ id: editing.id, payload });
    else createMutation.mutate(payload);
  };

  const startEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code, discountType: coupon.discountType, discountValue: String(coupon.discountValue),
      minOrder: coupon.minOrder || '', maxDiscount: coupon.maxDiscount || '', usageLimit: coupon.usageLimit || '',
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '', description: coupon.description || '',
    });
  };

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="section-subtitle">Admin Panel</p>
              <h1 className="section-title mt-3">Coupons</h1>
              <div className="w-16 h-[1px] bg-gold-500 mt-6" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="btn-secondary text-xs">Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary text-xs flex items-center space-x-2"><FiLogOut className="w-4 h-4" /><span>Logout</span></button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <form onSubmit={handleSubmit} className="p-6 border border-caviar-200 dark:border-caviar-800 space-y-4">
                <h3 className="text-sm tracking-widest uppercase font-medium">{editing ? 'Edit Coupon' : 'New Coupon'}</h3>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Code</label>
                  <input value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} className="input-field" placeholder="SAVE20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Type</label>
                    <select value={form.discountType} onChange={(e) => set('discountType', e.target.value)} className="input-field">
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Value</label>
                    <input type="number" step="0.01" min="0" value={form.discountValue} onChange={(e) => set('discountValue', e.target.value)} className="input-field" placeholder="20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Min Order</label>
                    <input type="number" value={form.minOrder} onChange={(e) => set('minOrder', e.target.value)} className="input-field" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Max Discount</label>
                    <input type="number" value={form.maxDiscount} onChange={(e) => set('maxDiscount', e.target.value)} className="input-field" placeholder="Optional" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Usage Limit</label>
                    <input type="number" value={form.usageLimit} onChange={(e) => set('usageLimit', e.target.value)} className="input-field" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Expires</label>
                    <input type="date" value={form.expiresAt} onChange={(e) => set('expiresAt', e.target.value)} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-caviar-500 mb-2">Description</label>
                  <input value={form.description} onChange={(e) => set('description', e.target.value)} className="input-field" placeholder="Optional" />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary text-xs flex-1 flex items-center justify-center space-x-2">
                    <FiPlus className="w-3 h-3" /><span>{editing ? 'Update' : 'Create'}</span>
                  </button>
                  {editing && (
                    <button type="button" onClick={() => { setForm(emptyForm); setEditing(null); }} className="btn-secondary text-xs">Cancel</button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="text-center py-20 text-caviar-400">Loading coupons...</div>
              ) : data?.coupons?.length === 0 ? (
                <div className="text-center py-20 border border-caviar-200 dark:border-caviar-800">
                  <FiPercent className="w-12 h-12 mx-auto text-caviar-300 mb-4" />
                  <p className="text-caviar-500">No coupons yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.coupons?.map((coupon) => (
                    <div key={coupon.id} className="flex items-center justify-between p-5 border border-caviar-200 dark:border-caviar-800">
                      <div>
                        <div className="flex items-center space-x-3">
                          <p className="font-medium">{coupon.code}</p>
                          <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${coupon.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-caviar-100 dark:bg-caviar-700 text-caviar-500'}`}>
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-caviar-400 mt-1">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                          {coupon.minOrder ? ` · min ₹${coupon.minOrder}` : ''}
                          {coupon.usageLimit ? ` · used ${coupon.usedCount}/${coupon.usageLimit}` : ''}
                          {coupon.expiresAt ? ` · expires ${new Date(coupon.expiresAt).toLocaleDateString()}` : ''}
                        </p>
                        {coupon.description && <p className="text-xs text-caviar-500 mt-1">{coupon.description}</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => startEdit(coupon)} className="p-2 text-caviar-400 hover:text-gold-500"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm('Delete this coupon?')) deleteMutation.mutate(coupon.id); }} className="p-2 text-caviar-400 hover:text-red-500"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
