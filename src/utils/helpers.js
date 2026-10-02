export const formatPrice = (price, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(price);
};

export const calculateDiscount = (price, discountPrice) => {
  if (!discountPrice) return 0;
  return Math.round((1 - discountPrice / price) * 100);
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const truncate = (text, length = 100) => text.length > length ? text.slice(0, length) + '...' : text;

export const getImageUrl = (url) => {
  if (!url) return 'https://placehold.co/800x1000/caviar-100/caviar-500?text=Caviar+Beauty';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    return /^https?:\/\//.test(apiUrl) ? `${new URL(apiUrl).origin}${url}` : url;
  }
  const svgUrl = url.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '.svg');
  return svgUrl;
};

export const generateRating = (rating) => {
  return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 'full' : i < rating ? 'half' : 'empty');
};
