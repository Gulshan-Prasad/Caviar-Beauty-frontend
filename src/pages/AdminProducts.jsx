import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiSearch, FiLogOut } from 'react-icons/fi';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, getImageUrl } from '@/utils/helpers';
import PageTransition from '@/components/layout/PageTransition';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products/admin/all').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
  });

  if (user?.role !== 'ADMIN') return <Navigate to={user ? '/dashboard' : '/login'} replace />;

  const products = data?.products || [];
  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()))
    : products;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
  };

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="section-subtitle">Admin Panel</p>
              <h1 className="section-title mt-3">Products</h1>
              <div className="w-16 h-[1px] bg-gold-500 mt-6" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin/products/new" className="btn-primary text-xs flex items-center space-x-2">
                <FiPlus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-xs flex items-center space-x-2">
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="mb-6 relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12 w-full"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-caviar-400">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FiPackage className="w-12 h-12 mx-auto text-caviar-300 mb-4" />
              <p className="text-caviar-500">No products found</p>
              <Link to="/admin/products/new" className="text-gold-500 hover:text-gold-600 text-sm mt-2 inline-block">Add your first product</Link>
            </div>
          ) : (
            <div className="overflow-x-auto border border-caviar-200 dark:border-caviar-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-caviar-200 dark:border-caviar-800 bg-caviar-50 dark:bg-caviar-900/50">
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Product</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">SKU</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Category</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Price</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Stock</th>
                    <th className="text-right py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-caviar-100 dark:border-caviar-800 hover:bg-caviar-50 dark:hover:bg-caviar-900/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-caviar-100 dark:bg-caviar-800 rounded overflow-hidden flex-shrink-0">
                            <img src={getImageUrl(product.images?.[0]?.url)} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-caviar-500">{product.brand?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-caviar-500 text-xs">{product.sku || '—'}</td>
                      <td className="py-4 px-4 text-caviar-500">{product.category?.name}</td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{formatPrice(product.basePrice)}</span>
                        {product.discountPrice && (
                          <span className="text-xs text-caviar-400 line-through ml-2">{formatPrice(product.discountPrice)}</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs ${
                          (product.inventory?.quantity || 0) <= 5 ? 'text-red-500' : 'text-caviar-500'
                        }`}>
                          {product.inventory?.quantity || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-2 text-caviar-400 hover:text-gold-500 transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product.id); }}
                            className="p-2 text-caviar-400 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
