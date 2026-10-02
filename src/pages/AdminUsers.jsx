import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { FiUsers, FiSearch, FiLogOut } from 'react-icons/fi';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import PageTransition from '@/components/layout/PageTransition';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/users').then(r => r.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => api.put(`/users/${id}/role`, { role }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Role updated'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => isActive ? api.delete(`/users/${id}`) : api.put(`/users/${id}/reactivate`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User status updated'); },
  });

  if (user?.role !== 'ADMIN') return <Navigate to={user ? '/dashboard' : '/login'} replace />;

  const handleLogout = async () => { await logout(); toast.success('Logged out'); };

  const users = (data?.users || []).filter(u => !search || u.email?.toLowerCase().includes(search.toLowerCase()) || `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="section-subtitle">Admin Panel</p>
              <h1 className="section-title mt-3">Users</h1>
              <div className="w-16 h-[1px] bg-gold-500 mt-6" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="btn-secondary text-xs">Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary text-xs flex items-center space-x-2"><FiLogOut className="w-4 h-4" /><span>Logout</span></button>
            </div>
          </div>

          <div className="mb-6 relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12 w-full" />
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-caviar-400">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <FiUsers className="w-12 h-12 mx-auto text-caviar-300 mb-4" />
              <p className="text-caviar-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-caviar-200 dark:border-caviar-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-caviar-200 dark:border-caviar-800 bg-caviar-50 dark:bg-caviar-900/50">
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">User</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Email</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Joined</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Role</th>
                    <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Status</th>
                    <th className="text-right py-4 px-4 text-xs tracking-wider uppercase text-caviar-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-caviar-100 dark:border-caviar-800 hover:bg-caviar-50 dark:hover:bg-caviar-900/50 transition-colors">
                      <td className="py-4 px-4 font-medium">{u.firstName} {u.lastName}</td>
                      <td className="py-4 px-4 text-caviar-500">{u.email}</td>
                      <td className="py-4 px-4 text-caviar-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <select
                          value={u.role}
                          disabled={u.role === 'ADMIN' && user.id === u.id}
                          onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value })}
                          className="bg-transparent text-sm border border-caviar-300 dark:border-caviar-600 px-2 py-1"
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${u.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => toggleMutation.mutate({ id: u.id, isActive: u.isActive })}
                            className={`text-xs tracking-wider uppercase px-3 py-1.5 border transition-colors ${
                              u.isActive ? 'border-red-400 text-red-500 hover:bg-red-500 hover:text-white' : 'border-green-400 text-green-600 hover:bg-green-500 hover:text-white'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
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
