import { useEffect } from 'react';

const SITE_URL = import.meta.env.VITE_FRONTEND_URL || 'https://caviarbeauty.com';

const setMeta = (attr, key, content) => {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  if (content) meta.content = content;
};

const upsertLink = (rel, href) => {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
};

const upsertJsonLd = (id, data) => {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

export const useSeo = (title, description, options = {}) => {
  useEffect(() => {
    const { image, path, jsonLd } = options;
    const fullTitle = title ? `${title} | Caviar Beauty` : 'Caviar Beauty | Luxury Fashion';
    document.title = fullTitle;

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:site_name', 'Caviar Beauty');
    setMeta('property', 'og:type', options.type || 'website');
    setMeta('property', 'og:image', image || '/favicon.svg');
    setMeta('property', 'og:url', `${SITE_URL}${path || '/'}`);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);

    if (path) upsertLink('canonical', `${SITE_URL}${path}`);
    if (jsonLd) upsertJsonLd(`jsonld-${path?.replace(/[^a-z0-9]/gi, '') || 'home'}`, jsonLd);
  }, [title, description, options.image, options.path, options.type, options.jsonLd]);
};

export default useSeo;