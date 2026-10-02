import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { FiGrid, FiPlus, FiTrash2, FiLogOut, FiEdit2 } from 'react-icons/fi';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import PageTransition from '@/components/layout/PageTransition';
import toast from 'react-hot-toast';

const emptyForm = { name: '', slug: '', description: '' };

function EntitySection({ title, entity, listKey, searchKey, queryKey, apiPath, fields }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({ queryKey: [queryKey], queryFn: () => api.get(`${apiPath}/admin/all`).then(r => r.data) });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post(apiPath, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); toast.success(`${entity} created`); setForm(emptyForm); setEditing(null); },
    onError: (err) => toast.error(err.response?.data?.error || 'Create failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`${apiPath}/${id}`, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); toast.success(`${entity} updated`); setForm(emptyForm); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`${apiPath}/${id}`),
    onSuccess: (res) => { queryClient.invalidateQueries({ queryKey: [queryKey] }); toast.success(res.data.message || `${entity} deleted`); },
  });

  const list = (data?.[listKey] || []).filter(x => !search || x.name?.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.slug) return toast.error('Name and slug required');
    if (editing) updateMutation.mutate({ id: editing.id, payload: form });
    else createMutation.mutate(form);
  };

  const startEdit = (item) => { setEditing(item); setForm({ name: item.name, slug: item.slug, description: item.description || '' }); };

  return (
    <div className="p-6 border border-caviar-200 dark:border-caviar-800">
      <h3 className="text-sm tracking-widest uppercase font-medium mb-6">{title}</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder={`${entity} name`} />
        <input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} className="input-field" placeholder="slug" />
        <div className="flex space-x-2">
          <input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="input-field flex-1" placeholder="Description (optional)" />
          <button type="submit" className="btn-primary text-xs px-4 flex items-center space-x-1"><FiPlus className="w-3 h-3" /><span>{editing ? 'Save' : 'Add'}</span></button>
        </div>
        {editing && <button type="button" onClick={() => { setForm(emptyForm); setEditing(null); }} className="text-xs text-caviar-400 hover:text-red-500 md:col-start-3 -mt-3">Cancel edit</button>}
      </form>

      <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field mb-4" placeholder={`Search ${entity.toLowerCase()}s...`} />

      {isLoading ? (
        <p className="text-center py-8 text-caviar-400">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-center py-8 text-caviar-400">No {entity.toLowerCase()}s found</p>
      ) : (
        <div className="space-y-2">
          {list.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border border-caviar-200 dark:border-caviar-800">
              <div>
                <p className="text-sm font-medium">{item.name} <span className="text-caviar-400 text-xs">({item.slug})</span></p>
                <p className="text-xs text-caviar-500">{item._count?.products || 0} products · {item.description || ''}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => startEdit(item)} className="p-1.5 text-caviar-400 hover:text-gold-500"><FiEdit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => { if (confirm(`Delete ${entity.toLowerCase()} "${item.name}"?`)) deleteMutation.mutate(item.id); }} className="p-1.5 text-caviar-400 hover:text-red-500"><FiTrash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminCategoriesBrands() {
  const { user, logout } = useAuthStore();

  if (user?.role !== 'ADMIN') return <Navigate to={user ? '/dashboard' : '/login'} replace />;

  const handleLogout = async () => { await logout(); toast.success('Logged out'); };

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="section-subtitle">Admin Panel</p>
              <h1 className="section-title mt-3">Catalog</h1>
              <div className="w-16 h-[1px] bg-gold-500 mt-6" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="btn-secondary text-xs">Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary text-xs flex items-center space-x-2"><FiLogOut className="w-4 h-4" /><span>Logout</span></button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EntitySection
              title="Categories"
              entity="Category"
              listKey="categories"
              queryKey="admin-categories"
              apiPath="/categories"
            />
            <EntitySection
              title="Brands"
              entity="Brand"
              listKey="brands"
              queryKey="admin-brands"
              apiPath="/brands"
            />
            <EntitySection
              title="Collections"
              entity="Collection"
              listKey="collections"
              queryKey="admin-collections"
              apiPath="/catalog/collections"
            />
            <EntitySection
              title="Tags"
              entity="Tag"
              listKey="tags"
              queryKey="admin-tags"
              apiPath="/catalog/tags"
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
