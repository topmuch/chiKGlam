'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Truck, Sparkles, Gift } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

/* ─────────────── animation helpers ─────────────── */
function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────── section title component ─────────────── */
function SectionTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-10 text-center md:mb-14">
      <h2 className="text-3xl font-bold tracking-widest text-[#1a1a1a] md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm tracking-widest text-[#bc8752]">
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-4 h-[2px] w-16 bg-[#bc8752]" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ */
/* ───────────────────── MAIN PAGE ───────────────────── */
/* ═══════════════════════════════════════════════════════ */
export default function Home() {
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* ──── HERO ──── */}
        <section
          id="accueil"
          className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
        >
          {/* gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2018] to-[#3a2a1a]" />
          {/* gold overlay pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,_#bc8752_0%,_transparent_60%)]" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
            <FadeIn>
              <p className="mb-4 text-xs tracking-[0.35em] text-[#bc8752] sm:text-sm">
                BIENVENUE CHEZ
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h1 className="text-4xl font-extrabold leading-tight tracking-wider text-white sm:text-5xl md:text-6xl lg:text-7xl">
                CHIC &amp;{' '}
                <span className="text-[#bc8752]">GLAMOUR</span>
                <br />
                BY EVA
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
                Maquillage minéral &amp; végan | Lingerie africaine artisanale
              </p>
            </FadeIn>
            <FadeIn delay={0.45}>
              <Button
                size="lg"
                onClick={() => handleScrollTo('#notre-marque')}
                className="mt-10 h-12 bg-[#bc8752] px-8 text-sm font-semibold tracking-widest text-white hover:bg-[#a8763f] transition-all duration-300"
              >
                DÉCOUVRIR LA BOUTIQUE
              </Button>
            </FadeIn>
          </div>

          {/* bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* ──── NOTRE MARQUE (with 3 photos) ──── */}
        <section id="notre-marque" className="py-16 sm:py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <SectionTitle title="NOTRE MARQUE" subtitle="Notre histoire" />
            </FadeIn>

            {/* 3 photo grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {/* Photo 1 - Left */}
              <FadeIn delay={0.1}>
                <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                  <div className="aspect-[3/4] md:aspect-[2/3]">
                    <Image
                      src="/images/about/notre-marque-1.jpeg"
                      alt="Maquillage minéral Chic & Glamour by Eva"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs font-medium tracking-widest text-white/90 uppercase">
                      Nos cosmétiques
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* Photo 2 - Center (larger, elevated) */}
              <FadeIn delay={0.2}>
                <div className="group relative overflow-hidden rounded-2xl shadow-xl md:-mt-6 md:mb-[-1.5rem]">
                  <div className="aspect-[3/4] md:aspect-[2/3] md:aspect-[3/4]">
                    <Image
                      src="/images/about/notre-marque-2.png"
                      alt="Artisan sénégalais créant de la lingerie africaine"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs font-medium tracking-widest text-white/90 uppercase">
                      Artisanat sénégalais
                    </p>
                  </div>
                  {/* Gold accent border on desktop */}
                  <div className="hidden md:block absolute inset-0 rounded-2xl ring-2 ring-[#bc8752]/30 ring-inset" />
                </div>
              </FadeIn>

              {/* Photo 3 - Right */}
              <FadeIn delay={0.3}>
                <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                  <div className="aspect-[3/4] md:aspect-[2/3]">
                    <Image
                      src="/images/about/notre-marque-3.jpeg"
                      alt="Application de maquillage professionnel"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs font-medium tracking-widest text-white/90 uppercase">
                      Hyper pigmenté
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Brand text under photos */}
            <FadeIn delay={0.15}>
              <div className="mx-auto mt-10 max-w-3xl text-center md:mt-14">
                <p className="text-sm leading-relaxed text-[#1a1a1a]/80 sm:text-base md:text-lg">
                  Nos gamme de <span className="font-semibold text-[#bc8752]">LINGERIE africaine</span> est fait à la
                  main par des artisans sénégalais. Votre achat contribue au commerce équitable.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#1a1a1a]/80 sm:text-base md:text-lg">
                  Oui notre maquillage est <span className="font-semibold text-[#bc8752]">minéral, végan, hyper
                  pigmenté</span> et se distingue gracieusement à toute occasion.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ──── À PROPOS ──── */}
        <section className="bg-[#faf8f5] py-16 sm:py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <SectionTitle title="À PROPOS" subtitle="Chic & Glamour by Eva" />
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="space-y-6 text-center">
                <p className="text-sm leading-[1.9] text-[#1a1a1a]/75 sm:text-base md:text-lg">
                  La somptueuse marque <span className="font-semibold text-[#bc8752]">Chic &amp; Glamour by
                  Eva</span> se positionne dans la vente de produits de maquillage de haute qualité minérals et végan
                  dans un packaging respectueux de l&apos;environnement.
                </p>
                <p className="text-sm leading-[1.9] text-[#1a1a1a]/75 sm:text-base md:text-lg">
                  Notre mission est d&apos;offrir à chaque femme un maquillage glamour en toute confiance. C&apos;est
                  pourquoi nous travaillons sur la diversité de notre gamme de teintes pour offrir une couvrance
                  naturelle à chaque carnation partout dans le monde.
                </p>
                <p className="text-sm leading-[1.9] text-[#1a1a1a]/75 sm:text-base md:text-lg">
                  Notre gamme de <span className="font-semibold text-[#bc8752]">LINGERIE africaine</span> est fait à
                  la main tout en cultivant une identité traditionnelle et moderne à la fois. Les boxes de séduction et
                  kit nuisette allient chic, élégance et le meilleur du raffinement sénégalais. Redécouvrez la
                  sensualité avec notre collection{' '}
                  <span className="italic text-[#bc8752]">«&nbsp;secret de dame&nbsp;»</span>
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ──── FEATURES ──── */}
        <section id="boutique" className="py-16 sm:py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <SectionTitle title="NOS ENGAGEMENTS" subtitle="Pourquoi nous choisir" />
            </FadeIn>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              <FadeIn delay={0.1}>
                <Card className="group border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#bc8752]/10">
                      <Truck className="h-7 w-7 text-[#bc8752]" />
                    </div>
                    <h3 className="mb-3 text-sm font-bold tracking-widest text-[#1a1a1a]">
                      LIVRAISON RAPIDE
                    </h3>
                    <p className="text-sm leading-relaxed text-[#1a1a1a]/60">
                      Livraison en 2-4 jours ouvrés en France métropolitaine
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <Card className="group border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#bc8752]/10">
                      <Sparkles className="h-7 w-7 text-[#bc8752]" />
                    </div>
                    <h3 className="mb-3 text-sm font-bold tracking-widest text-[#1a1a1a]">
                      PRODUITS D&apos;EXCELLENTE QUALITÉ
                    </h3>
                    <p className="text-sm leading-relaxed text-[#1a1a1a]/60">
                      Maquillage minéral et végan, lingerie artisanale du Sénégal
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.3}>
                <Card className="group border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#bc8752]/10">
                      <Gift className="h-7 w-7 text-[#bc8752]" />
                    </div>
                    <h3 className="mb-3 text-sm font-bold tracking-widest text-[#1a1a1a]">
                      PACKAGING CHIC &amp; GLAM
                    </h3>
                    <p className="text-sm leading-relaxed text-[#1a1a1a]/60">
                      Un packaging sécurisant et pétillant pour voyager à travers le monde
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
