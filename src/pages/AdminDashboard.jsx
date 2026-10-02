import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiBox, FiLogOut, FiStar } from 'react-icons/fi';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/helpers';
import PageTransition from '@/components/layout/PageTransition';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/users/dashboard').then(r => r.data),
    enabled: user?.role === 'ADMIN',
    refetchInterval: 60000,
  });

  if (user?.role !== 'ADMIN') return <Navigate to={user ? '/dashboard' : '/login'} replace />;

  const statCards = [
    { label: 'Total Users', value: stats?.stats?.totalUsers || 0, icon: FiUsers, change: stats?.stats?.changes?.totalUsers || '+0%' },
    { label: 'Total Orders', value: stats?.stats?.totalOrders || 0, icon: FiPackage, change: stats?.stats?.changes?.totalOrders || '+0%' },
    { label: 'Products', value: stats?.stats?.totalProducts || 0, icon: FiBox, change: stats?.stats?.changes?.totalProducts || '+0' },
    { label: 'Revenue', value: formatPrice(stats?.stats?.totalRevenue || 0), icon: FiDollarSign, change: stats?.stats?.changes?.totalRevenue || '+0%' },
  ];

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-12">
            <div>
              <p className="section-subtitle">Admin Panel</p>
              <h1 className="section-title mt-3">Dashboard</h1>
              <div className="w-16 h-[1px] bg-gold-500 mt-6" />
            </div>
            <button onClick={handleLogout} className="btn-secondary text-xs flex items-center space-x-2">
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 border border-caviar-200 dark:border-caviar-800">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-5 h-5 text-gold-500" />
                  <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                </div>
                <p className="text-2xl md:text-3xl font-medium">{stat.value}</p>
                <p className="text-xs text-caviar-500 tracking-wider uppercase mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 border border-caviar-200 dark:border-caviar-800">
              <h3 className="text-sm tracking-widest uppercase font-medium mb-6">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-caviar-200 dark:border-caviar-800">
                      <th className="text-left py-3 text-xs tracking-wider uppercase text-caviar-500 font-medium">Order</th>
                      <th className="text-left py-3 text-xs tracking-wider uppercase text-caviar-500 font-medium">Customer</th>
                      <th className="text-left py-3 text-xs tracking-wider uppercase text-caviar-500 font-medium">Status</th>
                      <th className="text-right py-3 text-xs tracking-wider uppercase text-caviar-500 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentOrders?.map((order) => (
                      <tr key={order.id} className="border-b border-caviar-100 dark:border-caviar-800 hover:bg-caviar-50 dark:hover:bg-caviar-900/50 transition-colors">
                        <td className="py-4 font-medium">{order.orderNumber}</td>
                        <td className="py-4 text-caviar-500">{order.user?.firstName} {order.user?.lastName}</td>
                        <td className="py-4">
                          <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${
                            order.status === 'DELIVERED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 dark:bg-red-900/30 text-red-700' :
                            'bg-gold-100 dark:bg-gold-900/30 text-gold-700'
                          }`}>{order.status}</span>
                        </td>
                        <td className="py-4 text-right">{formatPrice(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-8 border border-caviar-200 dark:border-caviar-800">
              <h3 className="text-sm tracking-widest uppercase font-medium mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Orders', href: '/admin/orders', icon: FiPackage },
                  { label: 'Products', href: '/admin/products', icon: FiShoppingBag },
                  { label: 'Users', href: '/admin/users', icon: FiUsers },
                  { label: 'Coupons', href: '/admin/coupons', icon: FiTrendingUp },
                  { label: 'Catalog', href: '/admin/catalog', icon: FiBox },
                  { label: 'Reviews', href: '/admin/reviews', icon: FiStar },
                ].map((action) => (
                  <Link key={action.label} to={action.href} className="p-6 border border-caviar-200 dark:border-caviar-800 hover:border-gold-500 dark:hover:border-gold-500 transition-colors group text-center">
                    <action.icon className="w-6 h-6 mx-auto text-caviar-400 group-hover:text-gold-500 transition-colors mb-3" />
                    <span className="text-xs tracking-widest uppercase">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
