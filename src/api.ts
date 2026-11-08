import axios from 'axios';
import { products as fallback, type Collection, type Product } from './data';

const API = import.meta.env.VITE_STRAPI_URL || 'https://api.pseudoclan.com';
const ENDPOINT = import.meta.env.VITE_STRAPI_PRODUCTS_ENDPOINT || '/api/products';

const toCollection = (raw: unknown): Collection | null => {
  const v = String(raw ?? '').toLowerCase();
  if (v.includes('devot')) return 'devotional';
  if (v.includes('lounge')) return 'lounge';
  if (v.includes('mountain') || v.includes('tee') || v.includes('hoodie') || v.includes('street')) return 'mountainwear';
  return null;
};

/** Loads Aaroh products (tagged mountainwear / devotional / lounge) from Strapi; falls back to the bundled catalogue when the API is unavailable or empty. */
export async function loadProducts(): Promise<Product[]> {
  try {
    const r = await axios.get(ENDPOINT, { baseURL: API, params: { populate: '*' } });
    const rows: any[] = r.data?.data || [];
    if (!rows.length) return fallback;
    const mapped = rows.flatMap((x): Product[] => {
      const a = x.attributes || x;
      const url: string | undefined = a.image?.data?.attributes?.url || a.image?.url;
      const collection = toCollection(a.collection?.data?.attributes?.name || a.collection || a.category?.data?.attributes?.name || a.category);
      if (!collection) return []; // not an Aaroh apparel product
      return [{
        id: x.id,
        name: a.name || a.title || 'Aaroh Essential',
        hindi: a.hindi || a.hindiName,
        detail: a.detail || a.subtitle,
        price: +(a.price || 0),
        collection,
        image: url ? (url.startsWith('http') ? url : API + url) : '/images/emblem-small.jpg',
        alt: a.alt || a.name,
        badge: a.badge,
      }];
    });
    return mapped.length ? mapped : fallback;
  } catch {
    return fallback;
  }
}
