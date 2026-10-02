// GA4 helper — every function is a safe no-op when VITE_GA_MEASUREMENT_ID is unset,
// so the site works fine without analytics configured.

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
let initialized = false;

export function isAnalyticsEnabled() {
  return !!MEASUREMENT_ID;
}

// Load gtag.js once and initialize. Call from main.jsx on app start.
export function initAnalytics() {
  if (!MEASUREMENT_ID || initialized || typeof window === 'undefined') return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  const gtag = function () { window.dataLayer.push(arguments); };
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

// Fire any GA4 event, e.g. trackEvent('add_to_cart', { currency, value, items })
export function trackEvent(name, params = {}) {
  if (!MEASUREMENT_ID) return;
  window.gtag?.('event', name, params);
}

// Track an SPA route change as a page_view (initial view is handled manually too).
export function trackPageView(path) {
  if (!MEASUREMENT_ID) return;
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
  });
}

// Map a backend cart/order item to the GA4 enhanced-ecommerce item shape.
export function toGaItems(items = []) {
  return items.map((item) => {
    const product = item.product || item;
    return {
      item_id: String(product.id ?? item.productId ?? item.id ?? ''),
      item_name: product.name ?? item.name ?? 'Unknown',
      price: Number(product.discountPrice ?? product.basePrice ?? item.price ?? 0),
      quantity: Number(item.quantity ?? 1),
    };
  });
}

// Convenience: fire a standard e-commerce event with currency + items baked in.
export function trackEcommerceEvent(name, { items = [], value, ...extra } = {}) {
  trackEvent(name, { currency: 'INR', items: toGaItems(items), ...(value !== undefined ? { value } : {}), ...extra });
}
