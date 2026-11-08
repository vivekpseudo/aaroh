export type Collection = 'mountainwear' | 'devotional' | 'lounge';

export type Product = {
  id: number | string;
  name: string;
  /** Optional Devanagari name shown beside the English one. */
  hindi?: string;
  /** Short line under the name, e.g. "Charcoal · Oversized". */
  detail?: string;
  price: number;
  collection: Collection;
  image: string;
  alt?: string;
  badge?: string;
};

export type CartItem = Product & { quantity: number };

export const money = (n: number) => '₹' + n.toLocaleString('en-IN');

// TODO: confirm prices. Tee/hoodie prices carried over from the previous storefront;
// lounge-set price is a placeholder.
const TEE = 1499;
const HOODIE = 2499;
const LOUNGE_SET = 3999;

export const products: Product[] = [
  // Mountainwear — "New in"
  { id: 'm1', name: 'Higher Than Yesterday Tee', detail: 'Charcoal · Oversized', price: TEE, collection: 'mountainwear', image: '/images/tee-higher-than-yesterday.jpg', alt: 'Charcoal oversized tee, Aaroh logo front', badge: 'New' },
  { id: 'm2', name: 'Same Roots, Higher Paths Tee', detail: 'Ivory · Oversized', price: TEE, collection: 'mountainwear', image: '/images/tee-same-roots.jpg', alt: 'Ivory tee with ink mountain and sun print' },
  { id: 'm3', name: 'Rise. Evolve. Become. Hoodie', detail: 'Olive · Relaxed', price: HOODIE, collection: 'mountainwear', image: '/images/hoodie-rise-evolve-become.jpg', alt: 'Olive hoodie with gold Aaroh logo' },
  { id: 'm4', name: 'Do The Work. Let Go. Tee', detail: 'Sand · Oversized', price: TEE, collection: 'mountainwear', image: '/images/tee-do-the-work.jpg', alt: 'Sand tee with Do the work, let go print' },
  { id: 'm5', name: 'Rooted in Wisdom Hoodie', detail: 'Black · Relaxed', price: HOODIE, collection: 'mountainwear', image: '/images/hoodie-rooted-in-wisdom.jpg', alt: 'Black hoodie with small gold Aaroh chest logo' },

  // Devotional
  { id: 'd1', name: 'Maryada', hindi: 'मर्यादा', detail: 'Ram · Ivory', price: TEE, collection: 'devotional', image: '/images/devotional-maryada.jpg', alt: 'Maryada tee front and back, Ram artwork with Hindi text' },
  { id: 'd2', name: 'Karma Yoga', hindi: 'कर्मयोग', detail: 'Krishna · Teal', price: TEE, collection: 'devotional', image: '/images/devotional-karma-yoga.jpg', alt: 'Karma Yoga tee front and back, Krishna artwork' },
  { id: 'd3', name: 'Inner Peace', hindi: 'शांत', detail: 'Shiva · Black', price: TEE, collection: 'devotional', image: '/images/devotional-inner-peace.jpg', alt: 'Inner Peace tee front and back, Shiva artwork' },
  { id: 'd4', name: 'Bhakti', hindi: 'भक्ति', detail: 'Hanuman · Olive', price: TEE, collection: 'devotional', image: '/images/devotional-bhakti.jpg', alt: 'Bhakti tee front and back, Hanuman artwork on olive' },

  // Harmony lounge sets
  { id: 'l1', name: 'Set · Cream', hindi: 'शांति', price: LOUNGE_SET, collection: 'lounge', image: '/images/lounge-shanti.jpg', alt: 'Shanti lounge set in cream with lotus prints' },
  { id: 'l2', name: 'Set · Pink', hindi: 'नई शुरुआत', price: LOUNGE_SET, collection: 'lounge', image: '/images/lounge-nayi-shuruaat.jpg', alt: 'Nayi Shuruaat lounge set in pink with mountain prints' },
  { id: 'l3', name: 'Set · Sage', hindi: 'प्रकृति', price: LOUNGE_SET, collection: 'lounge', image: '/images/lounge-prakriti.jpg', alt: 'Prakriti lounge set in sage green with leaf prints' },
  { id: 'l4', name: 'Set · Lavender', hindi: 'योग', price: LOUNGE_SET, collection: 'lounge', image: '/images/lounge-yog.jpg', alt: 'Yog lounge set in lavender with meditation print' },
];

export const lookbook = [
  { src: '/images/look-charcoal-tee.jpg', alt: 'Charcoal tee back print worn' },
  { src: '/images/look-ivory-tee.jpg', alt: 'Ivory tee back print worn' },
  { src: '/images/look-olive-hoodie.jpg', alt: 'Olive hoodie worn' },
  { src: '/images/look-sand-tee.jpg', alt: 'Sand tee worn' },
  { src: '/images/look-black-hoodie.jpg', alt: 'Black hoodie back print worn' },
];
