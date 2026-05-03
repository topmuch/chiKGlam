'use client';

import { useState } from 'react';
import { Instagram, Facebook, Send, Truck, ShieldCheck, RotateCcw, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/use-store';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.82 4.82 0 01-3.77-1.58V6.69h3.77z" />
    </svg>
  );
}

const quickLinks = [
  { label: 'Accueil', page: 'home' as const },
  { label: 'Boutique', page: 'category' as const, slug: 'boutique' },
  { label: 'Blog', page: 'blog' as const },
  { label: 'À propos', page: 'about' as const },
  { label: 'FAQ', page: 'faq' as const },
  { label: 'Contact', page: 'contact-page' as const },
];

const categoryLinks = [
  { label: 'Maquillage', slug: 'makeup' },
  { label: 'Lingerie', slug: 'lingerie' },
  { label: 'Accessoires', slug: 'accessoires' },
  { label: 'Carte Cadeaux', slug: 'cadeaux' },
];

const trustBadges = [
  { icon: Truck, label: 'Livraison Gratuite', sub: "Dès 50€ d'achat" },
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

export default function GlamshopFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigateTo = useStore((s) => s.navigateTo);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 4000); }
  };

  return (
    <footer className="mt-auto">
      {/* Newsletter section — #bc8752 */}
      <section style={{ backgroundColor: '#bc8752' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-black">
              Rejoignez la Communauté CHIC GLAM BY EVA
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-black/80">
              Inscrivez-vous pour des offres exclusives, conseils beauté et{' '}
              <span className="font-semibold text-black">10% de réduction sur votre première commande</span>
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto mb-10">
            <Input type="email" placeholder="Entrez votre adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-lg border-black/20 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm sm:flex-1" required />
            <Button type="submit" className="h-11 px-8 rounded-lg text-sm font-semibold transition-colors bg-white hover:bg-white/90" style={{ color: '#bc8752' }}>
              {subscribed ? 'Abonné !' : (<><span>S&apos;abonner</span><Send className="size-4 ml-2" /></>)}
            </Button>
          </form>
          {subscribed && <p className="text-center text-sm text-black font-medium mb-6">Merci pour votre inscription ! Vérifiez votre e-mail.</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center">
                <badge.icon className="size-10 mb-2 text-black" />
                <p className="text-sm font-semibold text-black">{badge.label}</p>
                <p className="text-xs mt-0.5 text-black/70">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer — #bc8752 */}
      <section style={{ backgroundColor: '#bc8752' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <h3 className="font-heading font-bold text-xl tracking-tight mb-4 text-black">CHIC GLAM BY EVA</h3>
              <p className="text-sm text-black/80 leading-relaxed mb-6">
                Votre destination beauté et séduction. Maquillage professionnel, lingerie artisanale et accessoires tendance.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="size-9 rounded-full border border-black/20 flex items-center justify-center text-black/60 hover:text-black hover:border-black/50 transition-colors">
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold text-xs uppercase tracking-[0.1em] mb-5 text-black">Liens Rapides</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <button onClick={() => { if ('slug' in link && link.slug) navigateTo(link.page, { category: link.slug }); else navigateTo(link.page); }} className="group flex items-center gap-1.5 text-sm text-black/60 hover:text-black transition-colors">
                      <ChevronRight className="size-3 text-black/20" />{link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Categories */}
            <div>
              <h4 className="font-heading font-semibold text-xs uppercase tracking-[0.1em] mb-5 text-black">Catégories</h4>
              <ul className="space-y-3">
                {categoryLinks.map((link) => (
                  <li key={link.slug}>
                    <button onClick={() => navigateTo('category', { category: link.slug })} className="group flex items-center gap-1.5 text-sm text-black/60 hover:text-black transition-colors">
                      <ChevronRight className="size-3 text-black/20" />{link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-heading font-semibold text-xs uppercase tracking-[0.1em] mb-5 text-black">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-black/70"><span>Dakar, Sénégal</span></li>
                <li className="flex items-center gap-2 text-sm text-black/70"><span>+221 77 123 45 67</span></li>
                <li className="flex items-center gap-2 text-sm text-black/70"><span>contact@chicglambyeva.com</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar — #a07040 */}
      <section style={{ backgroundColor: '#a07040', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
              <p className="text-xs text-black/60">&copy; {new Date().getFullYear()} CHIC GLAM BY EVA. Tous droits réservés.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[{ label: 'Politique de Confidentialité', page: 'privacy' as const }, { label: 'Conditions Générales', page: 'cgv' as const }, { label: 'Politique de Cookies', page: 'cookies' as const }].map((link) => (
                  <button key={link.label} onClick={() => navigateTo(link.page)} className="text-xs text-black/60 hover:text-black/90 transition-colors">{link.label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {paymentMethods.map((method) => (
                <span key={method} className="text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-md bg-black/10 text-black/70 border border-black/10">{method}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
