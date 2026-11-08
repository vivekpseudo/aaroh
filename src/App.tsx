import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Drawer, message } from 'antd';
import { loadProducts } from './api';
import { lookbook, money, products as initialProducts, type CartItem, type Collection, type Product } from './data';

const NAV = [
  { href: '#new', label: 'New In' },
  { href: '#street', label: 'Mountainwear' },
  { href: '#devotional', label: 'Devotional' },
  { href: '#lounge', label: 'Lounge Sets' },
];

const CART_KEY = 'aaroh-cart';

function readCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

/* ---------- Icons (stroke, currentColor) ---------- */

const Icon = ({ children, size = 20 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
    {children}
  </svg>
);
const SearchIcon = () => <Icon><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>;
const AccountIcon = () => <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></Icon>;
const BagIcon = () => <Icon><path d="M5 8h14l-1 13H6z" /><path d="M9 8V6a3 3 0 016 0v2" /></Icon>;
const MenuIcon = () => <Icon><path d="M4 7h16M4 12h16M4 17h16" /></Icon>;

const VALUES: { label: string; path: ReactNode }[] = [
  { label: 'Rise', path: <><path d="M6 28h28" /><path d="M11 28a9 9 0 0118 0" /><path d="M20 10v4M9 15l3 3M31 15l-3 3" /></> },
  { label: 'Growth', path: <><path d="M20 34V14" /><path d="M20 14c0-6 4-9 8-9 0 6-4 9-8 9zM20 20c0-5-4-8-8-8 0 5 4 8 8 8z" /></> },
  { label: 'Flow', path: <path d="M6 14c4-3 8 3 14 0s10-3 14 0M6 21c4-3 8 3 14 0s10-3 14 0M6 28c4-3 8 3 14 0s10-3 14 0" /> },
  { label: 'Inner self', path: <><circle cx="20" cy="20" r="14" /><path d="M20 30V12c4 3 5 9 0 14" /></> },
  { label: 'Purpose', path: <path d="M4 32l11-16 6 8 4-5 11 13z" /> },
];

/* ---------- Shared bits ---------- */

function SectionHead({ eyebrow, title, sub, cta }: { eyebrow?: string; title: string; sub?: string; cta?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div className="flex flex-col gap-2.5">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="h2">{title}</h2>
        {sub && <p className="m-0 text-[15px] font-light text-aaroh-soft">{sub}</p>}
      </div>
      {cta}
    </div>
  );
}

function AddButton({ onAdd, name }: { onAdd: () => void; name: string }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Add ${name} to bag`}
      className="btn-dark absolute inset-x-3 bottom-3 py-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
    >
      Add to bag
    </button>
  );
}

function ProductCard({ p, onAdd, variant }: { p: Product; onAdd: (p: Product) => void; variant: Collection }) {
  const name = p.hindi ? (
    variant === 'lounge' ? (
      <><span className="font-hindi">{p.hindi}</span> {p.name}</>
    ) : (
      <>{p.name} <span className="font-hindi text-aaroh-muted">· {p.hindi}</span></>
    )
  ) : (
    p.name
  );

  if (variant === 'mountainwear') {
    return (
      <article className="group flex flex-col gap-3">
        <div className="relative flex aspect-square items-center justify-center bg-aaroh-sand">
          <img src={p.image} alt={p.alt || p.name} className="h-[92%] w-[92%] object-contain mix-blend-multiply" loading="lazy" />
          {p.badge && (
            <span className="absolute left-3 top-3 bg-aaroh-ink px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-aaroh-ground">{p.badge}</span>
          )}
          <AddButton onAdd={() => onAdd(p)} name={p.name} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-[15px] font-normal">{name}</h3>
          {p.detail && <span className="text-[13px] text-aaroh-muted">{p.detail}</span>}
          <span className="text-[15px] font-medium">{money(p.price)}</span>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col gap-3">
      <div className="relative overflow-hidden">
        <img
          src={p.image}
          alt={p.alt || p.name}
          loading="lazy"
          className={`w-full object-cover transition duration-700 group-hover:scale-[1.03] ${variant === 'lounge' ? 'aspect-[1/1.05]' : 'aspect-[5/4]'}`}
        />
        <AddButton onAdd={() => onAdd(p)} name={variant === 'lounge' && p.hindi ? `${p.hindi} ${p.name}` : p.name} />
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="m-0 text-[15px] font-normal">{name}</h3>
          {p.detail && <span className="text-[13px] text-aaroh-muted">{p.detail}</span>}
        </div>
        <span className="text-[15px] font-medium">{money(p.price)}</span>
      </div>
    </article>
  );
}

/* ---------- App ---------- */

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadProducts().then(setProducts);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, [cart]);

  const by = useMemo(
    () => (c: Collection) => products.filter((p) => p.collection === c),
    [products],
  );
  const count = cart.reduce((s, x) => s + x.quantity, 0);
  const total = cart.reduce((s, x) => s + x.price * x.quantity, 0);

  const add = (p: Product) => {
    setCart((c) => (c.some((x) => x.id === p.id) ? c.map((x) => (x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x)) : [...c, { ...p, quantity: 1 }]));
    setBagOpen(true);
  };
  const setQty = (id: Product['id'], q: number) =>
    setCart((c) => (q <= 0 ? c.filter((x) => x.id !== id) : c.map((x) => (x.id === id ? { ...x, quantity: q } : x))));

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire to the newsletter provider / Strapi endpoint.
    message.success('Welcome to the ascent. Check your inbox soon.');
    setEmail('');
  };

  const mountain = by('mountainwear');
  const devotional = by('devotional');
  const lounge = by('lounge');

  return (
    <div className="min-h-screen bg-aaroh-ground font-sans text-aaroh-ink">
      {/* Announcement */}
      <div className="bg-aaroh-ink px-4 py-2.5 text-center text-xs uppercase tracking-[0.24em] text-aaroh-ground">
        Rise. Evolve. Become. &nbsp;·&nbsp; Free shipping on orders over ₹1,999
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-aaroh-line bg-aaroh-ground/95 backdrop-blur">
        <nav className="page flex items-center justify-between gap-6 py-[18px]" aria-label="Main">
          <div className="flex flex-1 items-center">
            <button type="button" className="icon-btn -ml-3 lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </button>
            <div className="hidden gap-8 whitespace-nowrap text-[13px] uppercase tracking-[0.18em] lg:flex">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="hover:text-aaroh-gold">{n.label}</a>
              ))}
            </div>
          </div>
          <a href="#top" aria-label="Aaroh home" className="flex flex-col items-center gap-0.5">
            <span className="pl-[0.42em] text-[24px] font-light leading-none tracking-[0.42em] sm:text-[30px]">AAROH</span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-aaroh-muted">Wear your rise</span>
          </a>
          <div className="flex flex-1 justify-end gap-1 sm:gap-2">
            <button type="button" className="icon-btn hidden sm:inline-flex" aria-label="Search"><SearchIcon /></button>
            <button type="button" className="icon-btn hidden sm:inline-flex" aria-label="Account"><AccountIcon /></button>
            <button type="button" className="icon-btn relative" aria-label={`Bag, ${count} item${count === 1 ? '' : 's'}`} onClick={() => setBagOpen(true)}>
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-aaroh-ink px-1 text-[10px] text-aaroh-ground">{count}</span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="top" className="page pb-[72px] pt-10 sm:pt-14">
          <div className="grid items-center gap-12 md:grid-cols-[1.05fr_1fr]">
            <div className="flex flex-col gap-7">
              <div className="flex items-center gap-4 text-aaroh-gold">
                <span className="h-px w-12 bg-aaroh-accent" />
                <span className="font-hindi text-[22px]">आरोह</span>
                <span className="text-xs uppercase tracking-[0.3em]">the ascent</span>
              </div>
              <h1 className="m-0 font-display text-[56px] font-normal leading-[0.95] tracking-[-0.01em] sm:text-[80px] lg:text-[96px]">
                Wear your <em className="text-aaroh-gold">rise.</em>
              </h1>
              <p className="m-0 max-w-[480px] text-lg font-light leading-[1.7] text-aaroh-body">
                Rooted in wisdom, made for today. Mountain-inspired streetwear, devotional tees and easy lounge sets for every step of the climb.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#new" className="btn-dark">Shop new in</a>
                <a href="#lounge" className="btn-outline">Explore lounge sets</a>
              </div>
              <div className="flex gap-8 pt-3 text-xs uppercase tracking-[0.24em] text-aaroh-muted">
                <span>Rise.</span><span>Evolve.</span><span>Become.</span>
              </div>
            </div>
            <div className="relative flex aspect-[1/1.05] items-center justify-center overflow-hidden bg-aaroh-panel">
              <img
                src="/images/emblem-hero.jpg"
                alt="Aaroh emblem: an ink-and-gold mountain peak rising before a golden sun"
                className="h-[92%] w-[86%] object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </section>

        {/* Value strip */}
        <section className="border-y border-aaroh-line">
          {/* TODO: confirm fabric and returns claims */}
          <div className="page grid grid-cols-2 gap-4 py-[22px] text-center text-xs uppercase tracking-[0.2em] text-aaroh-body md:grid-cols-4">
            <span>Heavyweight cotton</span><span>Designed in India</span><span>Hindi &amp; English prints</span><span>Easy returns</span>
          </div>
        </section>

        {/* Collections */}
        <section className="page pb-12 pt-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="h2">Three paths, one ascent</h2>
            <p className="m-0 max-w-[380px] text-[15px] font-light leading-[1.7] text-aaroh-soft">
              Choose the line that fits the day — the climb, the prayer, or the pause.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { href: '#street', img: '/images/look-charcoal-tee.jpg', alt: 'Man wearing a charcoal Aaroh tee with a gold mountain back print', title: 'Mountainwear', sub: <>Tees &amp; hoodies →</> },
              { href: '#devotional', img: '/images/devotional-karma-yoga.jpg', alt: 'Teal devotional tee with Krishna artwork and Hindi Gita verse', title: 'Devotional', sub: <span className="font-hindi text-[15px]">श्रद्धा से →</span> },
              { href: '#lounge', img: '/images/lounge-shanti.jpg', alt: 'Woman in a cream lounge set with lotus prints and matching tote', title: 'Lounge Sets', sub: <>4-piece sets →</> },
            ].map((c) => (
              <a key={c.href} href={c.href} className="group flex flex-col gap-4">
                <div className="aspect-[4/5] overflow-hidden bg-aaroh-card">
                  <img src={c.img} alt={c.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-[0.22em] group-hover:text-aaroh-gold">{c.title}</span>
                  <span className="text-[13px] text-aaroh-muted">{c.sub}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* New in / Mountainwear */}
        <section id="new" className="page scroll-mt-24 pb-24 pt-12">
          <div id="street" className="scroll-mt-24">
            <SectionHead eyebrow="New in · Mountainwear" title="Higher than yesterday" cta={<a href="#street" className="link-underline">View all</a>} />
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {mountain.map((p) => <ProductCard key={p.id} p={p} onAdd={add} variant="mountainwear" />)}
          </div>
        </section>

        {/* Brand story */}
        <section id="story" className="scroll-mt-20 bg-aaroh-ink text-aaroh-ground">
          <div className="page grid items-center gap-16 py-[104px] md:grid-cols-2">
            <div className="flex flex-col gap-7">
              <span className="font-hindi text-[64px] leading-[1.1] text-aaroh-accent">आरोह</span>
              <h2 className="m-0 font-display text-[40px] font-normal leading-[1.1] sm:text-5xl">Ancient wisdom.<br />Modern spirit.</h2>
              <p className="m-0 max-w-[500px] text-[17px] font-light leading-[1.8] text-aaroh-mist">
                Aaroh means the ascent — the rising notes of a raga, the climb toward a summit. Every piece carries a quiet reminder: the rise is inner first, and you wear it outward.
              </p>
              <ul className="m-0 grid max-w-[520px] list-none grid-cols-5 gap-3 p-0 pt-4 text-aaroh-accent">
                {VALUES.map((v) => (
                  <li key={v.label} className="flex flex-col items-center gap-2.5">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">{v.path}</svg>
                    <span className="text-center text-[11px] uppercase tracking-[0.2em] text-aaroh-mist">{v.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="/images/look-olive-hoodie.jpg" alt="Olive Aaroh hoodie worn outdoors" loading="lazy" className="aspect-[3/4] w-full object-cover" />
              <img src="/images/look-black-hoodie.jpg" alt="Black Aaroh hoodie with Rooted in Wisdom back print" loading="lazy" className="mt-14 aspect-[3/4] w-full object-cover" />
            </div>
          </div>
        </section>

        {/* Devotional */}
        <section id="devotional" className="page scroll-mt-24 pb-16 pt-[104px]">
          <SectionHead eyebrow="Devotional collection" title="Wear what you believe" cta={<a href="#devotional" className="link-underline">Shop all 12 designs</a>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {devotional.map((p) => <ProductCard key={p.id} p={p} onAdd={add} variant="devotional" />)}
          </div>
        </section>

        {/* Sunrise band */}
        <section className="page pb-16 pt-8">
          <div className="relative flex min-h-[420px] items-center overflow-hidden bg-[#3A342B]">
            <img src="/images/sunrise-band.jpg" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-85" />
            <div className="relative m-4 flex max-w-[560px] flex-col gap-5 bg-aaroh-ink/70 p-8 text-aaroh-ground sm:m-8 sm:p-12">
              <span className="text-xs uppercase tracking-[0.3em] text-aaroh-accent">Beyond the ordinary</span>
              <h2 className="m-0 font-display text-[36px] font-normal leading-[1.1] sm:text-[44px]">Inner rise.<br />Outer expression.</h2>
              <a href="#story" className="btn self-start bg-aaroh-ground px-7 text-aaroh-ink hover:bg-white">Read our story</a>
            </div>
          </div>
        </section>

        {/* Lounge sets */}
        <section id="lounge" className="scroll-mt-20 bg-aaroh-sand">
          <div className="page py-24">
            <SectionHead
              eyebrow="Harmony lounge sets"
              title="Slow mornings, soft words"
              sub="Tee · Pants · Shrug · Tote — eight colourways, each with its own Hindi affirmation."
              cta={<a href="#lounge" className="link-underline">Shop all 8 sets</a>}
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {lounge.map((p) => <ProductCard key={p.id} p={p} onAdd={add} variant="lounge" />)}
            </div>
          </div>
        </section>

        {/* Lookbook */}
        <section className="page pb-12 pt-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <h2 className="h2">#WearYourRise</h2>
            {/* TODO: add the Instagram handle */}
            <span className="text-[13px] uppercase tracking-[0.2em] text-aaroh-muted">Tag us to be featured</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {lookbook.map((l) => (
              <img key={l.src} src={l.src} alt={l.alt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="page pb-24 pt-16">
          <div className="flex flex-col items-center gap-5 border border-aaroh-brass px-6 py-14 text-center sm:px-8">
            <img src="/images/emblem-small.jpg" alt="" className="h-auto w-[72px] mix-blend-multiply" />
            <h2 className="m-0 font-display text-[40px] font-normal">Join the ascent</h2>
            <p className="m-0 text-[15px] font-light text-aaroh-soft">New drops, quiet reminders and first access — no noise.</p>
            <form onSubmit={subscribe} className="flex w-full max-w-[480px] flex-wrap gap-2">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="h-12 min-w-[200px] flex-1 border border-aaroh-ink bg-aaroh-paper px-4 text-[15px] outline-none focus:border-aaroh-gold"
              />
              <button type="submit" className="btn-dark h-12 px-7 py-0">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-aaroh-ink text-aaroh-mist">
        <div className="page grid grid-cols-2 gap-10 pb-8 pt-[72px] md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <span className="text-[26px] font-light tracking-[0.42em] text-aaroh-ground">AAROH</span>
            <span className="font-hindi text-[22px] text-aaroh-accent">आरोह</span>
            <span className="text-xs uppercase tracking-[0.3em]">Wear your rise</span>
          </div>
          {[
            { title: 'Shop', links: [['#street', 'Mountainwear'], ['#devotional', 'Devotional tees'], ['#lounge', 'Lounge sets'], ['#new', 'New in']] },
            { title: 'Help', links: [['#top', 'Size guide'], ['#top', 'Shipping & returns'], ['#top', 'Track order'], ['#top', 'Contact']] },
            { title: 'Aaroh', links: [['#story', 'Our story'], ['#story', 'Craft & fabric'], ['#top', 'Instagram']] },
          ].map((col) => (
            <div key={col.title} className="flex flex-col gap-3 text-sm">
              <span className="text-xs uppercase tracking-[0.24em] text-aaroh-accent">{col.title}</span>
              {col.links.map(([href, label]) => (
                <a key={label} href={href} className="hover:text-aaroh-ground">{label}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="page flex flex-wrap justify-between gap-4 border-t border-aaroh-rule py-6 text-xs tracking-[0.12em]">
          <span>© Aaroh. Rooted in wisdom, made for today.</span>
          <span>Rise. Evolve. Become.</span>
        </div>
      </footer>

      {/* Mobile menu */}
      <Drawer placement="left" open={menuOpen} onClose={() => setMenuOpen(false)} width={300} title={<span className="font-light tracking-[0.42em]">AAROH</span>}>
        <nav className="flex flex-col gap-6 text-sm uppercase tracking-[0.2em]" aria-label="Mobile">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>{n.label}</a>
          ))}
        </nav>
      </Drawer>

      {/* Bag */}
      <Drawer open={bagOpen} onClose={() => setBagOpen(false)} title={<span className="font-display text-[28px] font-normal">Your bag</span>} width={400}>
        {cart.length ? (
          <div className="flex h-full flex-col">
            <ul className="m-0 flex-1 list-none p-0">
              {cart.map((x) => (
                <li key={x.id} className="mb-5 flex gap-4 border-b border-aaroh-line pb-5">
                  <img src={x.image} alt="" className="h-24 w-20 bg-aaroh-sand object-cover" />
                  <div className="flex flex-1 flex-col gap-1">
                    <h4 className="m-0 text-sm font-normal">{x.hindi ? <><span className="font-hindi">{x.hindi}</span> {x.name}</> : x.name}</h4>
                    {x.detail && <span className="text-xs text-aaroh-muted">{x.detail}</span>}
                    <span className="text-sm font-medium">{money(x.price)}</span>
                    <div className="mt-auto flex items-center gap-1">
                      <button type="button" className="h-9 w-9 border border-aaroh-line" aria-label={`Decrease ${x.name}`} onClick={() => setQty(x.id, x.quantity - 1)}>−</button>
                      <span className="w-8 text-center text-sm" aria-live="polite">{x.quantity}</span>
                      <button type="button" className="h-9 w-9 border border-aaroh-line" aria-label={`Increase ${x.name}`} onClick={() => setQty(x.id, x.quantity + 1)}>+</button>
                      <button type="button" className="ml-auto text-xs uppercase tracking-[0.16em] text-aaroh-muted underline" onClick={() => setQty(x.id, 0)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 border-t border-aaroh-line pt-5">
              <div className="flex justify-between text-sm"><span className="uppercase tracking-[0.2em]">Subtotal</span><span className="font-medium">{money(total)}</span></div>
              <p className="m-0 text-xs text-aaroh-muted">{total >= 1999 ? 'You’ve unlocked free shipping.' : `Add ${money(1999 - total)} more for free shipping.`}</p>
              <button type="button" className="btn-dark w-full">Checkout · {money(total)}</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            <p className="m-0 font-display text-2xl">Your bag is empty.</p>
            <a href="#new" className="btn-outline" onClick={() => setBagOpen(false)}>Shop new in</a>
          </div>
        )}
      </Drawer>
    </div>
  );
}
