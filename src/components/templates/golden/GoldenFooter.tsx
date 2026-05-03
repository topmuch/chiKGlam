'use client';

import { useState } from 'react';
import {
  Instagram,
  Facebook,
  Send,
  Truck,
  ShieldCheck,
  RotateCcw,
  Lock,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/use-store';
import { categories } from '@/data/products';

// ─── Custom TikTok SVG icon ────────────────────────────────────
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.82 4.82 0 01-3.77-1.58V6.69h3.77z" />
    </svg>
  );
}

// ─── Colors (Golden Design System) ──────────────────────────────
const C = {
  primary: '#bc8752',
  primaryLight: '#d4a06a',
  primaryDark: '#a07040',
  black: '#000000',
  tertiary: '#FAF7F2',
  quaternary: '#F5EDE3',
  border: '#E8E2DA',
  sectionBg: '#F9F6F2',
  textLight: '#555555',
  textMuted: '#999999',
  darkBg: '#1a1a1a',
};

// ─── Data ───────────────────────────────────────────────────────
const quickLinks = [
  { label: 'Accueil', page: 'home' as const },
  { label: 'Boutique', page: 'category' as const, slug: 'boutique' },
  { label: 'Blog', page: 'blog' as const },
  { label: 'À propos', page: 'about' as const },
  { label: 'FAQ', page: 'faq' as const },
  { label: 'Contact', page: 'contact-page' as const },
];

const categoryLinks = categories.map((cat) => ({
  label: cat.name.charAt(0) + cat.name.slice(1).toLowerCase(),
  slug: cat.slug,
}));

const contactInfo = [
  { icon: MapPin, text: 'Dakar, Sénégal' },
  { icon: Phone, text: '+221 77 123 45 67' },
  { icon: Mail, text: 'contact@chicglambyeva.com' },
];

const trustBadges = [
  { icon: Truck, label: 'Livraison gratuite dès 50€', sub: "Dès 50€ d'achat" },
  { icon: ShieldCheck, label: 'Produits Authentiques', sub: 'Garantie 100%' },
  { icon: RotateCcw, label: 'Retours Faciles', sub: 'Sous 15 jours' },
  { icon: Lock, label: 'Paiement Sécurisé', sub: 'Crypté SSL' },
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/p/DDKVWj_tcSq/' },
  { icon: Facebook, label: 'Facebook', href: 'https://web.facebook.com/evadiagne05/' },
  { icon: TikTokIcon, label: 'TikTok', href: 'https://www.tiktok.com/@chic_and_glamour_by_eva' },
];

const paymentMethods = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Orange Money'];

const legalLinks = [
  { label: 'Politique de Confidentialité', page: 'privacy' as const },
  { label: 'Conditions Générales', page: 'cgv' as const },
  { label: 'Politique de Cookies', page: 'cookies' as const },
];

// ─── Component ──────────────────────────────────────────────────
export default function GoldenFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigateTo = useStore((s) => s.navigateTo);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleCategoryClick = (slug: string) => {
    navigateTo('category', { category: slug });
  };

  return (
    <footer className="mt-auto">
      {/* ================================================================
          1. NEWSLETTER SECTION
          ================================================================ */}
      <section style={{ backgroundColor: C.primary }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide mb-3"
              style={{ color: C.black }}
            >
              REJOIGNEZ NOTRE BEAUTÉ COMMUNAUTÉ
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.black }}>
              Soyez la première informée des nouveautés, offres exclusives et conseils beauté.
              Recevez <strong>-10%</strong> sur votre première commande.
            </p>
          </div>

          {/* Email subscribe form */}
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto mb-10"
          >
            <Input
              type="email"
              placeholder="Entrez votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg text-sm sm:flex-1"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #FFFFFF',
                color: C.black,
              }}
              required
            />
            <Button
              type="submit"
              className="h-11 px-8 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: '#FFFFFF',
                color: C.black,
              }}
            >
              {subscribed ? (
                'Abonné ✓'
              ) : (
                <>
                  S&apos;abonner
                  <Send className="size-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {subscribed && (
            <p className="text-center text-sm font-medium mb-8" style={{ color: C.black }}>
              Merci pour votre inscription ! Vérifiez votre e-mail pour votre code de réduction.
            </p>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center group">
                <div
                  className="size-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300"
                  style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                >
                  <badge.icon className="size-5" style={{ color: C.black }} />
                </div>
                <p className="text-xs font-semibold" style={{ color: C.black }}>
                  {badge.label}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(0,0,0,0.65)' }}>
                  {badge.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          2. MAIN FOOTER
          ================================================================ */}
      <section style={{ backgroundColor: C.primary }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* ── Column 1: Brand + Description + Social ── */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3
                className="font-heading font-bold text-xl tracking-wider uppercase mb-4"
                style={{ color: '#000000' }}
              >
                CHIC GLAM BY EVA
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Votre destination beauté et séduction. Maquillage professionnel, lingerie artisanale et
                accessoires tendance — le tout avec l&apos;élégance africaine. Vegan &amp; cruelty-free.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="size-9 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      border: '1px solid rgba(0,0,0,0.15)',
                      color: 'rgba(0,0,0,0.5)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)';
                      e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
                      e.currentTarget.style.color = '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgba(0,0,0,0.5)';
                    }}
                  >
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Column 2: Quick Links ── */}
            <div>
              <h4
                className="font-heading font-semibold text-xs uppercase tracking-[0.1em] mb-5"
                style={{ color: '#000000' }}
              >
                Liens Rapides
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => {
                        if ('slug' in link && link.slug) {
                          navigateTo(link.page, { category: link.slug });
                        } else {
                          navigateTo(link.page);
                        }
                      }}
                      className="group flex items-center gap-1.5 text-sm transition-colors duration-200"
                      style={{ color: 'rgba(0,0,0,0.6)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(0,0,0,0.6)';
                      }}
                    >
                      <ChevronRight
                        className="size-3 transition-colors duration-200"
                        style={{ color: 'rgba(0,0,0,0.2)' }}
                      />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 3: Categories ── */}
            <div>
              <h4
                className="font-heading font-semibold text-xs uppercase tracking-[0.1em] mb-5"
                style={{ color: '#000000' }}
              >
                Catégories
              </h4>
              <ul className="space-y-3">
                {categoryLinks.map((link) => (
                  <li key={link.slug}>
                    <button
                      onClick={() => handleCategoryClick(link.slug)}
                      className="group flex items-center gap-1.5 text-sm transition-colors duration-200"
                      style={{ color: 'rgba(0,0,0,0.6)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(0,0,0,0.6)';
                      }}
                    >
                      <ChevronRight
                        className="size-3 transition-colors duration-200"
                        style={{ color: 'rgba(0,0,0,0.2)' }}
                      />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 4: Contact Info ── */}
            <div>
              <h4
                className="font-heading font-semibold text-xs uppercase tracking-[0.1em] mb-5"
                style={{ color: '#000000' }}
              >
                Contact
              </h4>
              <ul className="space-y-4">
                {contactInfo.map((info) => (
                  <li key={info.text} className="flex items-start gap-3">
                    <info.icon
                      className="size-4 mt-0.5 shrink-0"
                      style={{ color: '#000000' }}
                    />
                    <span className="text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>
                      {info.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Mini social in contact column */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                <p className="text-xs mb-3" style={{ color: 'rgba(0,0,0,0.5)' }}>
                  Suivez-nous
                </p>
                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="size-8 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.08)',
                        color: 'rgba(0,0,0,0.5)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.12)';
                        e.currentTarget.style.color = '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.08)';
                        e.currentTarget.style.color = 'rgba(0,0,0,0.5)';
                      }}
                    >
                      <social.icon className="size-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          3. BOTTOM BAR
          ================================================================ */}
      <section
        style={{
          backgroundColor: C.primaryDark,
          borderTop: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright + Legal links */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
              <p className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                &copy; {new Date().getFullYear()} CHIC GLAM BY EVA. Tous droits réservés.
              </p>
              <div className="hidden sm:block w-px h-3" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
              <div className="flex flex-wrap items-center justify-center gap-3">
                {legalLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => navigateTo(link.page)}
                    className="text-xs transition-colors duration-200"
                    style={{ color: 'rgba(0,0,0,0.5)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(0,0,0,0.5)';
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment method badges */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.08)',
                    color: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
