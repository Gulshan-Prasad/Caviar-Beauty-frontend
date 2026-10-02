export const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Collections', href: '/collections' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const categories = [
  { name: 'Handbags', slug: 'handbags', image: '/images/categories/handbags.jpg', description: 'Luxury handbags crafted from the finest Italian leathers.' },
  { name: 'Footwear', slug: 'footwear', image: '/images/categories/footwear.jpg', description: 'Premium footwear for every occasion.' },
  { name: 'Eyewear', slug: 'eyewear', image: '/images/categories/eyewear.jpg', description: 'Designer frames and sunglasses.' },
  { name: 'Accessories', slug: 'accessories', image: '/images/categories/accessories.jpg', description: 'Complete your look with luxury accessories.' },
  { name: 'Gift Cards', slug: 'gift-cards', image: '/images/categories/gift-cards.jpg', description: 'The perfect gift awaits.' },
  { name: 'Limited Edition', slug: 'limited-edition', image: '/images/categories/limited.jpg', description: 'Exclusive pieces, limited quantities.' },
];

export const testimonials = [
  { id: 1, name: 'Sophie Laurent', title: 'Fashion Editor', text: 'Caviar Beauty redefines luxury. The craftsmanship is unparalleled — every piece tells a story of elegance and sophistication.', rating: 5, avatar: '' },
  { id: 2, name: 'James Harrington', title: 'CEO, Harrington Group', text: 'Exceptional quality and timeless design. My Caviar Beauty collection is the highlight of my wardrobe.', rating: 5, avatar: '' },
  { id: 3, name: 'Amélie Dubois', title: 'Style Influencer', text: 'From the packaging to the product itself, every detail exudes luxury. This is what true elegance looks like.', rating: 5, avatar: '' },
  { id: 4, name: 'Marcus Chen', title: 'Creative Director', text: 'The attention to detail is extraordinary. Caviar Beauty has become my go-to for statement pieces.', rating: 5, avatar: '' },
];

export const footerLinks = {
  quickLinks: [
    { label: 'Search', to: '/products' },
    { label: 'New Arrivals', to: '/new-arrivals' },
    { label: 'Best Sellers', to: '/products' },
    { label: 'Collections', to: '/collections' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  categories: ['Handbags', 'Footwear', 'Eyewear', 'Accessories', 'Gift Cards', 'Limited Edition'],
  support: ['FAQ', 'Size Guide', 'Care Instructions', 'Track Order'],
  policies: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR Compliance'],
};
