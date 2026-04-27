'use client'

import { Instagram, Facebook } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { AppPage } from '@/app/page'

interface FooterProps {
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
}

const QUICK_LINKS: { label: string; page: AppPage }[] = [
  { label: 'Accueil', page: 'home' },
  { label: 'À propos', page: 'about' },
  { label: 'Contact', page: 'home' },
]

export default function Footer({ currentPage, onNavigate }: FooterProps) {
  const handleLinkClick = (page: AppPage) => {
    if (currentPage !== page) {
      onNavigate(page)
      return
    }
    const contactEl = document.querySelector('#contact')
    if (contactEl && page === 'home') {
      contactEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-[#1a1a1a] text-white" id="contact">
      <Separator className="bg-[#bc8752]/30" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-wider mb-4">
              CHIC & <span className="text-[#bc8752]">GLAMOUR</span> BY EVA
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Maquillage minéral &amp; végan | Lingerie africaine artisanale
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest text-[#bc8752] mb-4">
              LIENS RAPIDES
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLinkClick(link.page)}
                    className="text-sm text-white/60 transition-colors hover:text-[#bc8752]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest text-[#bc8752] mb-4">
              SUIVEZ-NOUS
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#bc8752]/30 text-white/60 transition-all hover:bg-[#bc8752] hover:text-white hover:border-[#bc8752]"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#bc8752]/30 text-white/60 transition-all hover:bg-[#bc8752] hover:text-white hover:border-[#bc8752]"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#bc8752]/30 text-white/60 transition-all hover:bg-[#bc8752] hover:text-white hover:border-[#bc8752]"
                aria-label="TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.1a8.16 8.16 0 005.58 2.17v-3.45a4.83 4.83 0 01-1-.61z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-[#bc8752]/20 my-8" />

        <div className="text-center">
          <p className="text-xs text-white/40 tracking-wider">
            &copy; 2025 Chic &amp; Glamour by EVA. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
