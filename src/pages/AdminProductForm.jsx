import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiLogOut, FiImage, FiPlusCircle, FiTrash2, FiInfo } from 'react-icons/fi';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import PageTransition from '@/components/layout/PageTransition';
import ImageUploader from '@/components/ui/ImageUploader';
import toast from 'react-hot-toast';

const defaultProduct = {
  name: '', slug: '', description: '', brandId: '', categoryId: '',
  basePrice: '', discountPrice: '', currency: 'INR', material: '',
  specifications: '{}', metaTitle: '', metaDesc: '',
  isFeatured: false, isNewArrival: false, isBestSeller: false, isLimited: false,
  images: [{ url: '', alt: '' }],
  variants: [{ color: '', size: '', stock: 0, price: '' }],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: () => api.get('/categories').then(r => r.data) });
  const { data: brandData } = useQuery({ queryKey: ['brands'], queryFn: () => api.get('/brands').then(r => r.data) });

  const { data: existingProduct } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => api.get(`/products/${id}`).then(r => r.data),
    enabled: isEdit,
  });

  if (user?.role !== 'ADMIN') return <Navigate to={user ? '/dashboard' : '/login'} replace />;

  const categories = catData?.categories || [];
  const brands = brandData?.brands || [];

  const [form, setForm] = useState(defaultProduct);

  useEffect(() => {
    if (isEdit && existingProduct) {
      setForm({
        name: existingProduct.name || '',
        slug: existingProduct.slug || '',
        description: existingProduct.description || '',
        brandId: existingProduct.brandId || existingProduct.brand?.id || '',
        categoryId: existingProduct.categoryId || existingProduct.category?.id || '',
        basePrice: existingProduct.basePrice?.toString() || '',
        discountPrice: existingProduct.discountPrice?.toString() || '',
        currency: existingProduct.currency || 'INR',
        material: existingProduct.material || '',
        specifications: existingProduct.specifications ? JSON.stringify(typeof existingProduct.specifications === 'string' ? JSON.parse(existingProduct.specifications) : existingProduct.specifications) : '{}',
        metaTitle: existingProduct.metaTitle || '',
        metaDesc: existingProduct.metaDesc || '',
        isFeatured: existingProduct.isFeatured || false,
        isNewArrival: existingProduct.isNewArrival || false,
        isBestSeller: existingProduct.isBestSeller || false,
        isLimited: existingProduct.isLimited || false,
        images: existingProduct.images?.length ? existingProduct.images.map(img => ({ url: img.url, alt: img.alt || '' })) : [{ url: '', alt: '' }],
        variants: existingProduct.variants?.length ? existingProduct.variants.map(v => ({ color: v.color || '', size: v.size || '', stock: v.stock || 0, price: v.price?.toString() || '' })) : [{ color: '', size: '', stock: 0, price: '' }],
      });
    }
  }, [isEdit, existingProduct]);

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created');
      navigate('/admin/products');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated');
      navigate('/admin/products');
    },
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageChange = (index, field, value) => {
    const images = [...form.images];
    images[index] = { ...images[index], [field]: value };
    setForm(prev => ({ ...prev, images }));
  };

  const addImage = () => setForm(prev => ({ ...prev, images: [...prev.images, { url: '', alt: '' }] }));
  const removeImage = (index) => { if (form.images.length > 1) setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) })); };

  const handleVariantChange = (index, field, value) => {
    const variants = [...form.variants];
    variants[index] = { ...variants[index], [field]: value };
    setForm(prev => ({ ...prev, variants }));
  };

  const addVariant = () => setForm(prev => ({ ...prev, variants: [...prev.variants, { color: '', size: '', stock: 0, price: '' }] }));
  const removeVariant = (index) => { if (form.variants.length > 1) setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) })); };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (value) => {
    setForm(prev => ({ ...prev, name: value, slug: isEdit ? prev.slug : generateSlug(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.brandId || !form.categoryId || !form.basePrice) {
      toast.error('Please fill in all required fields');
      return;
    }
    let specs = {};
    try { specs = JSON.parse(form.specifications); } catch { specs = {}; }

    const payload = {
      ...form,
      basePrice: parseFloat(form.basePrice),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
      specifications: specs,
      images: form.images.filter(img => img.url.trim()),
      variants: form.variants.filter(v => v.color || v.size || v.stock > 0 || v.price),
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
  };

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <Link to="/admin/products" className="text-caviar-400 hover:text-caviar-600 transition-colors">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <p className="section-subtitle">{isEdit ? 'Edit Product' : 'New Product'}</p>
                <h1 className="section-title mt-3">{isEdit ? form.name || 'Edit Product' : 'Add Product'}</h1>
                <div className="w-16 h-[1px] bg-gold-500 mt-6" />
              </div>
            </div>
            <button onClick={handleLogout} className="btn-secondary text-xs flex items-center space-x-2">
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Information */}
            <section className="p-8 border border-caviar-200 dark:border-caviar-800">
              <h2 className="text-sm tracking-widest uppercase font-medium mb-6 flex items-center space-x-2">
                <FiInfo className="w-4 h-4 text-gold-500" />
                <span>Basic Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Product Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)} className="input-field w-full" placeholder="e.g., Diamond Quilted Shoulder Bag" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Slug <span className="text-red-500">*</span></label>
                  <input type="text" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} className="input-field w-full" placeholder="diamond-quilted-shoulder-bag" disabled={isEdit} />
                  <p className="text-[10px] text-caviar-400 mt-1">Auto-generated from name. Use lowercase with hyphens.</p>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">SKU</label>
                  <input type="text" value={form.sku || ''} disabled className="input-field w-full opacity-50" placeholder="Auto-generated" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="input-field w-full resize-y" placeholder="Detailed product description..." />
                </div>
              </div>
            </section>

            {/* Pricing & Organization */}
            <section className="p-8 border border-caviar-200 dark:border-caviar-800">
              <h2 className="text-sm tracking-widest uppercase font-medium mb-6">Pricing & Organization</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Category <span className="text-red-500">*</span></label>
                  <select value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} className="input-field w-full">
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Brand <span className="text-red-500">*</span></label>
                  <select value={form.brandId} onChange={(e) => handleChange('brandId', e.target.value)} className="input-field w-full">
                    <option value="">Select brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Base Price <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" min="0" value={form.basePrice} onChange={(e) => handleChange('basePrice', e.target.value)} className="input-field w-full" placeholder="2890.00" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Discount Price</label>
                  <input type="number" step="0.01" min="0" value={form.discountPrice} onChange={(e) => handleChange('discountPrice', e.target.value)} className="input-field w-full" placeholder="Leave empty if no discount" />
                  <p className="text-[10px] text-caviar-400 mt-1">Leave empty if there is no discount.</p>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Currency</label>
                  <select value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} className="input-field w-full">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Material</label>
                  <input type="text" value={form.material} onChange={(e) => handleChange('material', e.target.value)} className="input-field w-full" placeholder="e.g., Italian Calfskin Leather" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-6">
                {[
                  { key: 'isFeatured', label: 'Featured' },
                  { key: 'isNewArrival', label: 'New Arrival' },
                  { key: 'isBestSeller', label: 'Best Seller' },
                  { key: 'isLimited', label: 'Limited Edition' },
                ].map(flag => (
                  <label key={flag.key} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form[flag.key]} onChange={(e) => handleChange(flag.key, e.target.checked)} className="w-4 h-4 accent-gold-500" />
                    <span>{flag.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Images */}
            <section className="p-8 border border-caviar-200 dark:border-caviar-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm tracking-widest uppercase font-medium flex items-center space-x-2">
                  <FiImage className="w-4 h-4 text-gold-500" />
                  <span>Product Images</span>
                </h2>
                <button type="button" onClick={addImage} className="text-xs text-gold-500 hover:text-gold-600 flex items-center space-x-1">
                  <FiPlusCircle className="w-3 h-3" />
                  <span>Add Image</span>
                </button>
              </div>
              <p className="text-[10px] text-caviar-400 mb-4">Recommended: 800x1000px, JPG/PNG/WebP/AVIF, max 5MB. First image is used as primary. Drag & drop or click to upload.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {form.images.map((img, i) => (
                  <div key={i} className="relative">
                    <div className="aspect-[4/5] rounded overflow-hidden">
                      <ImageUploader
                        value={img.url}
                        onChange={(url) => handleImageChange(i, 'url', url)}
                        onRemove={() => removeImage(i)}
                        index={i}
                      />
                    </div>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => handleImageChange(i, 'alt', e.target.value)}
                      className="input-field w-full text-[10px] mt-2"
                      placeholder="Alt text"
                    />
                    {i === 0 && <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider bg-gold-500 text-white px-1.5 py-0.5 rounded">Primary</span>}
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1 bg-white/90 rounded hover:bg-white transition-colors shadow-sm">
                        <FiTrash2 className="w-3 h-3 text-caviar-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Variants */}
            <section className="p-8 border border-caviar-200 dark:border-caviar-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm tracking-widest uppercase font-medium">Variants</h2>
                <button type="button" onClick={addVariant} className="text-xs text-gold-500 hover:text-gold-600 flex items-center space-x-1">
                  <FiPlusCircle className="w-3 h-3" />
                  <span>Add Variant</span>
                </button>
              </div>
              {form.variants.map((v, i) => (
                <div key={i} className="flex items-start space-x-3 mb-3 p-4 bg-caviar-50 dark:bg-caviar-900/30">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase font-medium mb-1">Color</label>
                      <input type="text" value={v.color} onChange={(e) => handleVariantChange(i, 'color', e.target.value)} className="input-field w-full text-xs" placeholder="e.g., Black" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase font-medium mb-1">Size</label>
                      <input type="text" value={v.size} onChange={(e) => handleVariantChange(i, 'size', e.target.value)} className="input-field w-full text-xs" placeholder="e.g., Medium, 38" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase font-medium mb-1">Stock <span className="text-red-500">*</span></label>
                      <input type="number" min="0" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', parseInt(e.target.value) || 0)} className="input-field w-full text-xs" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase font-medium mb-1">Price override</label>
                      <input type="number" step="0.01" min="0" value={v.price} onChange={(e) => handleVariantChange(i, 'price', e.target.value)} className="input-field w-full text-xs" placeholder="Uses base price" />
                    </div>
                  </div>
                  {form.variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(i)} className="p-1 text-caviar-400 hover:text-red-500 mt-5">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </section>

            {/* Specifications */}
            <section className="p-8 border border-caviar-200 dark:border-caviar-800">
              <h2 className="text-sm tracking-widest uppercase font-medium mb-6">Specifications & SEO</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Specifications (JSON)</label>
                  <textarea rows={4} value={form.specifications} onChange={(e) => handleChange('specifications', e.target.value)} className="input-field w-full resize-y text-xs font-mono" placeholder='{"dimensions": "28 x 18 x 8 cm", "closure": "Magnetic snap", "hardware": "Gold-toned"}' />
                  <p className="text-[10px] text-caviar-400 mt-1">Enter specifications as a JSON object with key-value pairs.</p>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Meta Title</label>
                  <input type="text" value={form.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} className="input-field w-full" placeholder="SEO title (optional)" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Meta Description</label>
                  <input type="text" value={form.metaDesc} onChange={(e) => handleChange('metaDesc', e.target.value)} className="input-field w-full" placeholder="SEO description (optional)" />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="flex items-center justify-end space-x-4 pb-12">
              <Link to="/admin/products" className="btn-secondary text-xs">Cancel</Link>
              <button type="submit" className="btn-primary text-xs flex items-center space-x-2">
                <FiSave className="w-4 h-4" />
                <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
