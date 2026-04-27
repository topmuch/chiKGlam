'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { AppPage } from '@/app/page'

interface HeaderProps {
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
}

const NAV_LINKS: { label: string; page: AppPage; section?: string }[] = [
  { label: 'ACCUEIL', page: 'home', section: '#accueil' },
  { label: 'CONTACT', page: 'home', section: '#contact' },
]

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (link: typeof NAV_LINKS[number]) => {
    setMobileOpen(false)
    if (currentPage !== link.page) {
      onNavigate(link.page)
      return
    }
    if (link.section) {
      const el = document.querySelector(link.section)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick(NAV_LINKS[0])}
            className="flex items-center gap-2"
          >
            <span className="text-lg font-bold tracking-wider text-white md:text-xl lg:text-2xl">
              CHIC & <span className="text-[#bc8752]">GLAMOUR</span> BY EVA
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={cn(
                  'text-sm font-medium tracking-widest transition-colors',
                  currentPage === link.page && !link.section
                    ? 'text-[#bc8752]'
                    : 'text-white/80 hover:text-[#bc8752]'
                )}
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => onNavigate('home')}
              className="bg-[#bc8752] text-white hover:bg-[#a8763f] text-xs tracking-widest"
            >
              DÉCOUVRIR
            </Button>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <SheetContent
              side="right"
              className="w-72 bg-[#1a1a1a] border-[#bc8752]/20"
            >
              <SheetHeader>
                <SheetTitle className="text-[#bc8752] text-lg tracking-wider">
                  MENU
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8 px-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <button
                      onClick={() => handleNavClick(link)}
                      className={cn(
                        'text-left text-base font-medium tracking-widest py-2 border-b border-white/10 transition-colors',
                        currentPage === link.page && !link.section
                          ? 'text-[#bc8752]'
                          : 'text-white/80 hover:text-[#bc8752]'
                      )}
                    >
                      {link.label}
                    </button>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    onClick={() => onNavigate('home')}
                    className="mt-4 bg-[#bc8752] text-white hover:bg-[#a8763f] w-full tracking-widest"
                  >
                    DÉCOUVRIR LA BOUTIQUE
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
