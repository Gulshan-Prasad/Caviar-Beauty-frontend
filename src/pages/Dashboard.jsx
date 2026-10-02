import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiHeart, FiMapPin, FiUser, FiLogOut, FiShoppingBag, FiAlertCircle, FiSave, FiCamera, FiEdit2 } from 'react-icons/fi';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { uploadFile } from '@/utils/api';
import { formatPrice, getImageUrl } from '@/utils/helpers';
import PageTransition from '@/components/layout/PageTransition';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'orders', label: 'Orders', icon: FiPackage },
  { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
  { id: 'addresses', label: 'Addresses', icon: FiMapPin },
  { id: 'profile', label: 'Profile', icon: FiUser },
];

export default function Dashboard() {
  const { user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const { data: orders } = useQuery({ queryKey: ['my-orders'], queryFn: () => api.get('/orders').then(r => r.data.orders), enabled: activeTab === 'orders' });
  const { data: wishlist } = useQuery({ queryKey: ['my-wishlist'], queryFn: () => api.get('/wishlist').then(r => r.data.items), enabled: activeTab === 'wishlist' });
  const { data: addresses } = useQuery({ queryKey: ['my-addresses'], queryFn: () => api.get('/addresses').then(r => r.data.addresses), enabled: activeTab === 'addresses' });

  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          {!user?.isVerified && (
            <div className="mb-8 p-4 border border-gold-500/30 bg-gold-50 dark:bg-gold-900/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiAlertCircle className="w-5 h-5 text-gold-600" />
                <p className="text-sm text-gold-700 dark:text-gold-300">Please verify your email address</p>
              </div>
              <Link to="/verify-email" className="text-xs tracking-wider uppercase text-gold-600 hover:text-gold-700 font-medium border-b border-gold-600">Verify Now</Link>
            </div>
          )}
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-subtitle">Welcome back</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title mt-3">{user?.firstName} {user?.lastName}</motion.h1>
              <div className="w-16 h-[1px] bg-gold-500 mt-6" />
            </div>
            <button onClick={handleLogout} className="btn-secondary text-xs flex items-center space-x-2"><FiLogOut className="w-4 h-4" /><span>Logout</span></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Orders', value: orders?.length || 0, icon: FiPackage },
              { label: 'Wishlist', value: wishlist?.length || 0, icon: FiHeart },
              { label: 'Cart Items', value: 0, icon: FiShoppingBag },
              { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024', icon: FiUser },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 border border-caviar-200 dark:border-caviar-800">
                <stat.icon className="w-5 h-5 text-gold-500 mb-3" />
                <p className="text-2xl font-medium">{stat.value}</p>
                <p className="text-xs text-caviar-500 tracking-wider uppercase mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex space-x-1 border-b border-caviar-200 dark:border-caviar-800 mb-8">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 px-5 py-3 text-xs tracking-wider uppercase transition-colors border-b-2 -mb-[1px] ${activeTab === tab.id ? 'border-gold-500 text-gold-500' : 'border-transparent text-caviar-400 hover:text-caviar-600'}`}>
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'orders' && (
            <div className="p-8 border border-caviar-200 dark:border-caviar-800">
              <h3 className="text-sm tracking-widest uppercase font-medium mb-6">All Orders</h3>
              {(!orders || orders.length === 0) && <p className="text-sm text-caviar-400">No orders yet</p>}
              <div className="space-y-4">
                {orders?.map((order) => (
                  <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between py-3 border-b border-caviar-100 dark:border-caviar-800 last:border-0 hover:bg-caviar-50 dark:hover:bg-caviar-900/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-caviar-400">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatPrice(order.total)}</p>
                      <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${order.status === 'DELIVERED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : order.status === 'CANCELLED' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400'}`}>{order.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="p-8 border border-caviar-200 dark:border-caviar-800">
              <h3 className="text-sm tracking-widest uppercase font-medium mb-6">Wishlist</h3>
              {(!wishlist || wishlist.length === 0) && <p className="text-sm text-caviar-400">Your wishlist is empty</p>}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlist?.map((item) => (
                  <Link key={item.id || item.productId} to={`/products/${item.product?.slug || item.productId}`} className="group">
                    <div className="aspect-square bg-caviar-100 dark:bg-caviar-900 overflow-hidden mb-2">
                      <img src={getImageUrl(item.product?.images?.[0]?.url || '')} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="text-xs font-medium truncate">{item.product?.name || 'Product'}</p>
                    <p className="text-xs text-gold-600">{item.product?.discountPrice || item.product?.basePrice ? formatPrice(item.product.discountPrice || item.product.basePrice) : ''}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="p-8 border border-caviar-200 dark:border-caviar-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm tracking-widest uppercase font-medium">Saved Addresses</h3>
              </div>
              {(!addresses || addresses.length === 0) && <p className="text-sm text-caviar-400">No addresses saved yet. Addresses are saved when you place an order.</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses?.map((address) => (
                  <div key={address.id} className="p-5 border border-caviar-200 dark:border-caviar-800">
                    <p className="text-sm font-medium">{address.firstName} {address.lastName}</p>
                    <p className="text-xs text-caviar-500 mt-2 leading-relaxed">{address.street}<br />{address.city}, {address.state} {address.zipCode}<br />{address.country}</p>
                    {address.phone && <p className="text-xs text-caviar-500 mt-2">{address.phone}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && <ProfileForm user={user} updateProfile={updateProfile} />}

          {activeTab !== 'profile' && (
            <div className="mt-8 p-8 border border-caviar-200 dark:border-caviar-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm tracking-widest uppercase font-medium">Account Details</h3>
                <button type="button" onClick={() => setActiveTab('profile')} className="text-xs text-gold-500 hover:text-gold-600 flex items-center space-x-1"><FiEdit2 className="w-3 h-3" /><span>Edit</span></button>
              </div>
              <div className="space-y-4 text-sm">
                <div><span className="text-caviar-400 block text-xs uppercase tracking-wider">Name</span><span className="font-medium">{user?.firstName} {user?.lastName}</span></div>
                <div><span className="text-caviar-400 block text-xs uppercase tracking-wider">Email</span><span>{user?.email}</span></div>
                <div><span className="text-caviar-400 block text-xs uppercase tracking-wider">Phone</span><span>{user?.phone || 'Not set'}</span></div>
                <div><span className="text-caviar-400 block text-xs uppercase tracking-wider">Member Since</span><span>{user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

function ProfileForm({ user, updateProfile }) {
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      setAvatar(url);
    } catch {
      toast.error('Avatar upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      await updateProfile({ firstName, lastName, phone, avatar });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error('Fill in both password fields');
    setChangingPassword(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword(''); setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password change failed');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This permanently deletes your account and all associated data.')) return;
    const password = prompt('Enter your password to confirm:');
    if (password === null) return;
    setDeleting(true);
    try {
      await api.delete('/auth/account', { data: { password } });
      toast.success('Account deleted');
      window.location.href = '/';
    } catch (err) {
      toast.error(err.response?.data?.error || 'Account deletion failed');
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 border border-caviar-200 dark:border-caviar-800">
      <h3 className="text-sm tracking-widest uppercase font-medium mb-8">Edit Profile</h3>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-caviar-100 dark:bg-caviar-900">
            {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <FiUser className="w-8 h-8 text-caviar-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
            <label className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer">
              <FiCamera className="w-5 h-5 text-white opacity-0 hover:opacity-100 transition-opacity" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium">{firstName} {lastName}</p>
            <p className="text-xs text-caviar-400">{uploading ? 'Uploading...' : 'Click to change photo'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase font-medium mb-2">First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase font-medium mb-2">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" required />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase font-medium mb-2">Email</label>
          <input type="email" value={user?.email || ''} className="input-field opacity-60" disabled />
          <p className="text-[10px] text-caviar-400 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase font-medium mb-2">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+1 (555) 000-0000" />
        </div>

        <button type="submit" disabled={saving} className="btn-primary text-xs flex items-center space-x-2">
          <FiSave className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-caviar-200 dark:border-caviar-800">
        <h4 className="text-sm tracking-widest uppercase font-medium mb-6">Change Password</h4>
        <form onSubmit={handlePasswordChange} className="max-w-lg space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase font-medium mb-2">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase font-medium mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" placeholder="8+ chars, upper, lower, number, symbol" />
          </div>
          <button type="submit" disabled={changingPassword} className="btn-secondary text-xs">{changingPassword ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>

      <div className="mt-10 pt-8 border-t border-caviar-200 dark:border-caviar-800">
        <button onClick={handleDeleteAccount} disabled={deleting} className="text-xs tracking-wider uppercase px-4 py-2.5 border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}
