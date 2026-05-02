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
  Download,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTemplate } from '@/hooks/use-template';
import { useStore } from '@/store/use-store';

// Custom TikTok SVG icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.82 4.82 0 01-3.77-1.58V6.69h3.77z" />
    </svg>
  );
}

const helpLinks = [
  { label: 'Livraison', page: 'shipping' as const },
  { label: 'Retours', page: 'returns' as const },
  { label: 'FAQ', page: 'faq' as const },
  { label: 'Contact', page: 'contact-page' as const },
  { label: 'Suivi de commande', page: 'order-tracking' as const },
];

const aboutLinks = [
  { label: 'À propos de CHIC GLAM BY EVA', page: 'about' as const },
  { label: 'Carrières', page: 'careers' as const },
  { label: 'Presse', page: 'press' as const },
  { label: 'Blog', page: 'blog' as const },
];

const categoryLinks = [
  { label: 'Maquillage', href: '#', slug: 'makeup' },
  { label: 'Lingerie', href: '#', slug: 'lingerie' },
  { label: 'Accessoires', href: '#', slug: 'accessoires' },
  { label: 'Carte Cadeaux', href: '#', slug: 'cadeaux' },
];

const trustBadges = [
  { icon: Truck, label: 'Livraison Gratuite', sub: 'Dès 50€ d\'achat' },
  { icon: ShieldCheck, label: 'Produits Authentiques', sub: 'Garantie 100% authentique' },
  { icon: RotateCcw, label: 'Retours Faciles', sub: 'Politique de retour 30 jours' },
  { icon: Lock, label: 'Paiement Sécurisé', sub: 'Paiement crypté SSL' },
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/p/DDKVWj_tcSq/' },
  { icon: Facebook, label: 'Facebook', href: 'https://web.facebook.com/evadiagne05/' },
  { icon: TikTokIcon, label: 'TikTok', href: 'https://www.tiktok.com/@chic_and_glamour_by_eva' },
];

const paymentMethods = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigateTo = useStore((s) => s.navigateTo);
  const { isGold } = useTemplate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="mt-auto">
      {/* ============ PRE-FOOTER: Newsletter Section ============ */}
      <section className={isGold ? 'bg-[#bc8752]' : 'bg-[#F5F5F5]'}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className={`font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3 ${isGold ? 'text-white' : 'text-neutral-900'}`}>
              Rejoignez la Communauté CHIC GLAM BY EVA
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${isGold ? 'text-white/80' : 'text-neutral-600'}`}>
              Inscrivez-vous pour des offres exclusives, conseils beauté et{' '}
              <span className={`font-semibold ${isGold ? 'text-white' : 'text-neutral-900'}`}>10% de réduction sur votre première commande</span>
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
              className="h-11 rounded-lg border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm focus-visible:ring-black/20 focus-visible:border-neutral-900 sm:flex-1"
              required
            />
            <Button
              type="submit"
              className={`h-11 px-8 rounded-lg text-sm font-semibold transition-colors ${isGold ? 'bg-white text-[#bc8752] hover:bg-white/90' : 'bg-black text-white hover:bg-neutral-800'}`}
            >
              {subscribed ? (
                'Abonné !'
              ) : (
                <>
                  S'abonner
                  <Send className="size-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {subscribed && (
            <p className="text-center text-sm text-green-700 font-medium mb-6">
              Merci pour votre inscription ! Vérifiez votre e-mail pour votre code de réduction.
            </p>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center">
                <badge.icon className={`size-6 mb-2 ${isGold ? 'text-white' : 'text-neutral-700'}`} />
                <p className={`text-xs font-semibold ${isGold ? 'text-white' : 'text-neutral-800'}`}>{badge.label}</p>
                <p className={`text-[11px] mt-0.5 ${isGold ? 'text-white/70' : 'text-neutral-500'}`}>{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MAIN FOOTER ============ */}
      <section className={`text-white ${isGold ? 'bg-[#bc8752]/90' : 'bg-neutral-950'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0">
            {/* Column 1: Brand + Social + App */}
            <div className="lg:pr-10">
              <h3 className="font-heading font-bold text-xl tracking-tight mb-4">
                CHIC GLAM BY EVA
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Votre destination pour la beauté de luxe et les soins premium. Découvrez des collections
                soigneusement sélectionnées auprès des marques de beauté les plus convoitées.
              </p>
              <div className="flex items-center gap-3 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`size-9 rounded-full border border-white/20 flex items-center justify-center hover:border-white/50 transition-colors ${isGold ? 'text-white/60 hover:text-white' : 'text-white/50 hover:text-white'}`}
                  >
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-2 text-white/40">
                <Download className="size-4" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-white/60">Télécharger l'App</span>
                  <span className="text-[10px] text-white/35">iOS &amp; Android</span>
                </div>
              </div>
            </div>

            {/* Vertical divider (desktop) */}
            <div className="hidden lg:block absolute left-[25%] top-12 bottom-12 w-px bg-white/10" />

            {/* Column 2: Help & Information */}
            <div className="lg:px-10 lg:border-l lg:border-white/10">
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-5">
                Aide &amp; Informations
              </h4>
              <ul className="space-y-3">
                {helpLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigateTo(link.page)}
                      className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <ChevronRight className="size-3 text-white/20 group-hover:text-white/60 transition-colors" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: About Us */}
            <div className="lg:px-10 lg:border-l lg:border-white/10">
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-5">
                À Propos
              </h4>
              <ul className="space-y-3">
                {aboutLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigateTo(link.page)}
                      className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <ChevronRight className="size-3 text-white/20 group-hover:text-white/60 transition-colors" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Categories */}
            <div className="lg:pl-10 lg:border-l lg:border-white/10">
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-5">
                Categories
              </h4>
              <ul className="space-y-3">
                {categoryLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <ChevronRight className="size-3 text-white/20 group-hover:text-white/60 transition-colors" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BOTTOM BAR ============ */}
      <section className={`border-t border-white/10 ${isGold ? 'bg-[#bc8752]/90' : 'bg-neutral-950'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright + Legal links */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
              <p className="text-xs text-white/40">
                &copy; {new Date().getFullYear()} CHIC GLAM BY EVA. Tous droits réservés.
              </p>
              <div className="hidden sm:block w-px h-3 bg-white/20" />
              <div className="flex items-center gap-3">
                {[
                  { label: 'Politique de Confidentialité', page: 'privacy' as const },
                  { label: 'Conditions Générales', page: 'cgv' as const },
                  { label: 'Politique de Cookies', page: 'cookies' as const },
                ].map((link) => (
                  <button
                    key={link.label}
                    onClick={() => navigateTo(link.page)}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment method badges */}
            <div className="flex items-center gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="text-[10px] font-semibold uppercase tracking-wide bg-white/10 text-white/50 px-2.5 py-1.5 rounded-sm border border-white/5"
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
