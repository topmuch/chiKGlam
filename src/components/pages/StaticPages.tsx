'use client';

import { useState } from 'react';
import {
  ChevronRight,
  Home,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Package,
  RefreshCw,
  Truck,
  ShieldCheck,
  HelpCircle,
  Heart,
  Sparkles,
  Globe,
  ExternalLink,

  Search,
  Users,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/use-store';

/* ================================================================
   SHARED COMPONENTS
   ================================================================ */

function PageBreadcrumb({ title }: { title: string }) {
  const navigateTo = useStore((s) => s.navigateTo);
  return (
    <nav className="flex items-center gap-1.5 text-sm text-neutral-500 mb-6">
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
      >
        <Home className="size-3.5" />
        Accueil
      </button>
      <ChevronRight className="size-3 text-neutral-400" />
      <span className="text-neutral-900 font-medium">{title}</span>
    </nav>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight mb-2">
        {title}
      </h1>
      {subtitle && <p className="text-base text-neutral-500 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight mb-4">
      {children}
    </h2>
  );
}

function SectionParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-4">{children}</p>
  );
}

/* ================================================================
   ABOUT PAGE
   ================================================================ */

export function AboutPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="À Propos" />
      <PageHeader
        title="CHIC & GLAMOUR BY EVA"
        subtitle="Beauté, Élégance & Raffinement"
      />

      {/* Notre Marque - 3 photos */}
      <section className="mb-16">
        <SectionTitle>Notre Marque</SectionTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {/* Photo 1 - Cosmétiques */}
          <div className="group relative overflow-hidden rounded-2xl shadow-lg">
            <div className="aspect-[3/4] md:aspect-[2/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about/notre-marque-1.jpeg"
                alt="Maquillage minéral Chic & Glamour by Eva"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-xs font-medium tracking-widest text-white/90 uppercase">
                Nos cosmétiques
              </p>
            </div>
          </div>

          {/* Photo 2 - Artisanat sénégalais (center, elevated) */}
          <div className="group relative overflow-hidden rounded-2xl shadow-xl md:-mt-6 md:mb-[-1.5rem]">
            <div className="aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about/notre-marque-2.png"
                alt="Artisan sénégalais créant de la lingerie africaine"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-xs font-medium tracking-widest text-white/90 uppercase">
                Artisanat sénégalais
              </p>
            </div>
            <div className="hidden md:block absolute inset-0 rounded-2xl ring-2 ring-[#bc8752]/30 ring-inset" />
          </div>

          {/* Photo 3 - Maquillage */}
          <div className="group relative overflow-hidden rounded-2xl shadow-lg">
            <div className="aspect-[3/4] md:aspect-[2/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about/notre-marque-3.jpeg"
                alt="Application de maquillage professionnel"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-xs font-medium tracking-widest text-white/90 uppercase">
                Hyper pigmenté
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl text-center md:mt-12">
          <SectionParagraph>
            Nos gamme de <strong>LINGERIE africaine</strong> est fait à la main par des artisans sénégalais.
            Votre achat contribue au commerce équitable.
          </SectionParagraph>
          <SectionParagraph>
            Oui notre maquillage est <strong>minéral, végan, hyper pigmenté</strong> et se distingue
            gracieusement à toute occasion.
          </SectionParagraph>
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Brand Story */}
      <section className="mb-16">
        <SectionTitle>Notre Histoire</SectionTitle>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <SectionParagraph>
              La somptueuse marque CHIC & GLAMOUR BY EVA se positionne dans la vente de produits de
              maquillage de haute qualité minérals et végan dans un packaging respectueux de
              l&apos;environnement.
            </SectionParagraph>
            <SectionParagraph>
              Notre mission est d&apos;offrir à chaque femme un maquillage glamour en toute confiance.
              C&apos;est pourquoi nous travaillons sur la diversité de notre gamme de teintes pour offrir
              une couvrance naturelle à chaque carnation partout dans le monde.
            </SectionParagraph>
          </div>
          <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl h-80 lg:h-96 flex items-center justify-center">
            <span className="font-heading text-4xl sm:text-5xl font-bold text-neutral-400 tracking-tight">
              CHIC & GLAMOUR
            </span>
          </div>
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Lingerie Collection */}
      <section className="mb-16">
        <SectionTitle>Notre Collection Lingerie</SectionTitle>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl h-80 lg:h-96 flex items-center justify-center">
            <span className="font-heading text-4xl sm:text-5xl font-bold text-neutral-400 tracking-tight">
              SECRET DE DAME
            </span>
          </div>
          <div className="order-1 lg:order-2">
            <SectionParagraph>
              Notre gamme de LINGERIE africaine est fait à la main tout en cultivant une identité
              traditionnelle et moderne à la fois. Les boxes de séduction et kit nuisette allient
              chic, élégance et le meilleur du raffinement sénégalais.
            </SectionParagraph>
            <SectionParagraph>
              Redécouvrez la sensualité avec notre collection «&nbsp;Secret de Dame&nbsp;».
            </SectionParagraph>
          </div>
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Values */}
      <section>
        <SectionTitle>Nos Engagements</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Sparkles className="size-8 text-neutral-900 mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-neutral-950 mb-2">Qualité Premium</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Produits de maquillage minérals et végan de haute qualité.
              </p>
            </CardContent>
          </Card>
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Globe className="size-8 text-neutral-900 mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-neutral-950 mb-2">Diversité</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Une gamme de teintes pour chaque carnation, partout dans le monde.
              </p>
            </CardContent>
          </Card>
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Heart className="size-8 text-neutral-900 mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-neutral-950 mb-2">Éco-responsable</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Packaging respectueux de l&apos;environnement pour chaque produit.
              </p>
            </CardContent>
          </Card>
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-6 text-center">
              <ShieldCheck className="size-8 text-neutral-900 mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-neutral-950 mb-2">Artisanat</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Lingerie africaine fait à la main, traditionnelle et moderne.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   CGV PAGE
   ================================================================ */

export function CGVPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="CGV" />
      <PageHeader
        title="Conditions Générales de Vente"
        subtitle="Dernière mise à jour : Janvier 2025"
      />

      <div className="max-w-4xl space-y-10">
        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">Article 1 — Objet</h2>
          <SectionParagraph>
            Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits
            effectuées sur le site CHIC GLAM BY EVA (chicglambyeva.com). Toute commande implique
            l&apos;acceptation sans réserve des présentes CGV.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            Article 2 — Prix
          </h2>
          <SectionParagraph>
            Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC). CHIC GLAM
            BY EVA se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés
            sur la base des tarifs en vigueur au moment de la validation de la commande.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            Article 3 — Commande
          </h2>
          <SectionParagraph>
            Le client passe commande sur le site internet chicglambyeva.com. La validation de la
            commande implique l&apos;acceptation des présentes CGV. Toute commande est considérée comme
            ferme après confirmation par e-mail.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            Article 4 — Paiement
          </h2>
          <SectionParagraph>
            Le paiement s&apos;effectue par carte bancaire (Visa, Mastercard), PayPal, Apple Pay ou
            Google Pay. La commande est enregistrée après confirmation du paiement. Les transactions
            sont sécurisées par cryptage SSL.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            Article 5 — Livraison
          </h2>
          <SectionParagraph>
            Les délais de livraison sont donnés à titre indicatif. CHIC GLAM BY EVA s&apos;engage à
            expédier les commandes dans un délai de 24 à 48 heures ouvrées. La livraison est gratuite
            en France métropolitaine pour toute commande supérieure à 50€.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            Article 6 — Droit de Rétractation
          </h2>
          <SectionParagraph>
            Conformément à l&apos;article L221-18 du Code de la consommation, le client dispose d&apos;un
            délai de 14 jours à compter de la réception des produits pour exercer son droit de
            rétractation, sans avoir à justifier de motif ni à payer de pénalité. Les frais de
            retour restent à la charge du client.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            Article 7 — Responsabilité
          </h2>
          <SectionParagraph>
            CHIC GLAM BY EVA ne saurait être tenue responsable de l&apos;inexécution du contrat en cas
            de force majeure, de perturbation ou de grève totale ou partielle des services postaux
            et moyens de transport.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            Article 8 — Données Personnelles
          </h2>
          <SectionParagraph>
            Le traitement des données personnelles est effectué conformément à notre Politique de
            Confidentialité et au Règlement Général sur la Protection des Données (RGPD).
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            Article 9 — Litiges
          </h2>
          <SectionParagraph>
            En cas de litige, le client peut recourir à une médiation conventionnelle ou à tout mode
            alternatif de règlement des différends. Le droit applicable est le droit français. Les
            tribunaux compétents sont ceux du ressort de la Cour d&apos;appel de Paris.
          </SectionParagraph>
        </section>
      </div>
    </div>
  );
}

/* ================================================================
   PRIVACY PAGE
   ================================================================ */

export function PrivacyPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="Confidentialité" />
      <PageHeader
        title="Politique de Confidentialité"
        subtitle="Dernière mise à jour : Janvier 2025"
      />

      <div className="max-w-4xl space-y-10">
        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            1. Responsable du Traitement
          </h2>
          <SectionParagraph>
            CHIC GLAM BY EVA, domiciliée au [Adresse], est responsable du traitement des données
            personnelles collectées sur le site chicglambyeva.com. Pour toute question relative à la
            protection de vos données, contactez-nous à : privacy@chicglambyeva.com
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            2. Données Collectées
          </h2>
          <SectionParagraph>
            Nous collectons les données suivantes : nom, prénom, adresse e-mail, adresse postale,
            numéro de téléphone, informations de paiement (traitées par nos prestataires de paiement
            sécurisés), historique de commandes, données de navigation (cookies).
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            3. Finalités du Traitement
          </h2>
          <SectionParagraph>
            Vos données sont utilisées pour : le traitement et la livraison de vos commandes, la
            gestion de votre compte client, l&apos;envoi de communications commerciales (avec votre
            consentement), l&apos;amélioration de nos services, le respect de nos obligations légales.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            4. Base Légale
          </h2>
          <SectionParagraph>
            Le traitement repose sur : l&apos;exécution du contrat (commande), votre consentement
            (communications commerciales), notre intérêt légitime (amélioration des services), nos
            obligations légales (facturation, lutte contre la fraude).
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            5. Durée de Conservation
          </h2>
          <SectionParagraph>
            Les données liées aux commandes sont conservées pendant 5 ans à compter de la clôture du
            compte. Les données de prospection sont conservées 3 ans à compter du dernier contact. Les
            cookies ont une durée de vie maximale de 13 mois.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            6. Vos Droits (RGPD)
          </h2>
          <SectionParagraph>
            Conformément au RGPD, vous disposez des droits suivants : droit d&apos;accès, droit de
            rectification, droit à l&apos;effacement, droit à la limitation du traitement, droit à la
            portabilité, droit d&apos;opposition. Pour exercer ces droits, contactez-nous à
            privacy@chicglambyeva.com. Vous pouvez également introduire une réclamation auprès de la
            CNIL.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            7. Sécurité des Données
          </h2>
          <SectionParagraph>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
            protéger vos données contre tout accès non autorisé, toute modification, divulgation ou
            destruction.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            8. Cookies
          </h2>
          <SectionParagraph>
            Pour plus d&apos;informations sur l&apos;utilisation des cookies, veuillez consulter notre
            Politique de Cookies.
          </SectionParagraph>
        </section>
      </div>
    </div>
  );
}

/* ================================================================
   CONTACT PAGE
   ================================================================ */

export function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Paris, France'],
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['(+33) 7 81 09 99 80'],
    },
    {
      icon: Mail,
      title: 'E-mail',
      details: ['contact@chicglambyeva.com'],
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: ['Lun - Ven : 9h00 - 18h00', 'Sam : 10h00 - 16h00'],
    },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/p/DDKVWj_tcSq/',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Facebook',
      href: 'https://web.facebook.com/evadiagne05/',
      color: 'from-blue-600 to-blue-500',
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@chic_and_glamour_by_eva',
      color: 'from-neutral-900 to-neutral-700',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="Contact" />
      <PageHeader
        title="Contactez-Nous"
        subtitle="Notre équipe est à votre écoute pour répondre à toutes vos questions"
      />

      <div className="grid lg:grid-cols-3 gap-10 max-w-6xl">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-neutral-950">
                Envoyez-nous un message
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="size-7 text-green-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-neutral-950 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Prénom
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Nom
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Adresse e-mail
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Sujet
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Sujet de votre message"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Message
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Écrivez votre message ici..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800"
                  >
                    Envoyer le message
                    <Send className="size-4 ml-2" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Paris Map */}
          <div className="mt-10 rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.77!2d2.2770!3d48.8589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte de Paris - CHIC GLAM BY EVA"
            />
          </div>
        </div>

        {/* Contact Info + Social */}
        <div className="space-y-4">
          {contactInfo.map((info) => (
            <Card key={info.title} className="border-neutral-200 shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <info.icon className="size-5 text-neutral-900 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-heading font-semibold text-neutral-950 text-sm mb-1">
                      {info.title}
                    </h3>
                    {info.details.map((d, i) => (
                      <p key={i} className="text-sm text-neutral-500">
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Social Links */}
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="pt-5">
              <h3 className="font-heading font-semibold text-neutral-950 text-sm mb-3">
                Suivez-nous
              </h3>
              <div className="space-y-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors group"
                  >
                    <div className={`size-9 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center text-white shrink-0`}>
                      <span className="text-xs font-bold">{social.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors">
                        {social.name}
                      </p>
                      <p className="text-xs text-neutral-400">@chicglambyeva</p>
                    </div>
                    <ExternalLink className="size-3.5 text-neutral-300 ml-auto shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   FAQ PAGE
   ================================================================ */

export function FAQPage() {
  const categories = [
    {
      title: 'Commandes & Paiement',
      faqs: [
        {
          q: 'Comment passer une commande sur CHIC GLAM BY EVA ?',
          a: "Ajoutez les produits souhaités à votre panier, puis cliquez sur \"Passer la commande\". Suivez les étapes de checkout pour finaliser votre achat. Vous recevrez une confirmation par e-mail.",
        },
        {
          q: 'Quels moyens de paiement acceptez-vous ?',
          a: "Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, Apple Pay et Google Pay. Tous les paiements sont sécurisés par cryptage SSL.",
        },
        {
          q: 'Puis-je modifier ou annuler ma commande ?',
          a: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation. Après ce délai, veuillez nous contacter directement par e-mail à contact@chicglambyeva.com.",
        },
        {
          q: 'Comment utiliser un code promo ?',
          a: "Entrez votre code promo dans le champ dédié lors de l'étape de paiement. La réduction sera appliquée automatiquement sur le total de votre commande.",
        },
      ],
    },
    {
      title: 'Livraison',
      faqs: [
        {
          q: 'Quels sont les délais de livraison ?',
          a: "La livraison standard prend 3 à 5 jours ouvrés. La livraison express est garantie sous 24 à 48 heures ouvrés en France métropolitaine.",
        },
        {
          q: 'La livraison est-elle gratuite ?',
          a: "Oui, la livraison est gratuite en France métropolitaine pour toute commande supérieure à 50€. En dessous de ce montant, les frais de livraison sont de 4,99€.",
        },
        {
          q: 'Livrez-vous à l\'international ?',
          a: "Nous livrons en France métropolitaine, DOM-TOM et dans la plupart des pays européens. Les frais et délais varient selon la destination.",
        },
      ],
    },
    {
      title: 'Retours & Échanges',
      faqs: [
        {
          q: 'Quelle est votre politique de retour ?',
          a: "Vous disposez de 30 jours à compter de la réception pour retourner un produit. Le produit doit être dans son emballage d'origine, non ouvert et non utilisé.",
        },
        {
          q: 'Comment effectuer un retour ?',
          a: "Connectez-vous à votre espace client ou contactez notre service client pour obtenir une étiquette de retour. Renvoyez le colis avec l'étiquette fournie.",
        },
        {
          q: 'Combien de temps pour le remboursement ?',
          a: "Le remboursement est effectué sous 5 à 10 jours ouvrés après réception et vérification du produit retourné.",
        },
      ],
    },
    {
      title: 'Compte & Données Personnelles',
      faqs: [
        {
          q: 'Comment créer un compte ?',
          a: 'Cliquez sur "Mon Compte" en haut de la page, puis "Créer un compte". Remplissez vos informations et validez.',
        },
        {
          q: 'Mes données personnelles sont-elles sécurisées ?',
          a: "Oui, nous conformons au RGPD. Vos données sont protégées par cryptage SSL et ne sont jamais partagées avec des tiers sans votre consentement.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="FAQ" />
      <PageHeader
        title="Foire Aux Questions"
        subtitle="Retrouvez les réponses aux questions les plus fréquentes"
      />

      <div className="max-w-4xl space-y-10">
        {categories.map((cat, catIdx) => (
          <section key={cat.title}>
            <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4 flex items-center gap-2">
              <HelpCircle className="size-5" />
              {cat.title}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {cat.faqs.map((faq, faqIdx) => (
                <AccordionItem
                  key={faqIdx}
                  value={`${catIdx}-${faqIdx}`}
                  className="border-neutral-200"
                >
                  <AccordionTrigger className="text-sm sm:text-base text-neutral-800 hover:text-neutral-950 font-medium text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SHIPPING PAGE
   ================================================================ */

export function ShippingPage() {
  const methods = [
    {
      icon: Truck,
      title: 'Livraison Standard',
      delay: '3 à 5 jours ouvrés',
      price: '4,99€',
      free: 'Gratuite dès 50€',
      zones: 'France métropolitaine',
    },
    {
      icon: Package,
      title: 'Livraison Express',
      delay: '24 à 48 heures',
      price: '9,99€',
      free: '',
      zones: 'France métropolitaine',
    },
    {
      icon: Globe,
      title: 'Livraison Europe',
      delay: '5 à 10 jours ouvrés',
      price: 'À partir de 9,99€',
      free: '',
      zones: 'Union européenne',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="Livraison" />
      <PageHeader
        title="Livraison"
        subtitle="Informations sur nos méthodes de livraison et délais"
      />

      {/* Shipping Methods */}
      <section className="mb-12">
        <SectionTitle>Nos Méthodes de Livraison</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {methods.map((method) => (
            <Card key={method.title} className="border-neutral-200 shadow-sm">
              <CardContent className="pt-6">
                <method.icon className="size-8 text-neutral-900 mb-4" />
                <h3 className="font-heading font-semibold text-neutral-950 text-lg mb-1">
                  {method.title}
                </h3>
                <p className="text-sm text-neutral-500 mb-3">{method.zones}</p>
                <Separator className="mb-3" />
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm text-neutral-500">Délai :</span>
                  <span className="font-medium text-neutral-900">{method.delay}</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm text-neutral-500">Tarif :</span>
                  <span className="font-semibold text-neutral-950">{method.price}</span>
                </div>
                {method.free && (
                  <p className="text-sm font-medium text-green-700 mt-2">{method.free}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-12" />

      {/* Shipping Info */}
      <section className="max-w-4xl space-y-8">
        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-3">
            Expédition de Votre Commande
          </h2>
          <SectionParagraph>
            Nous expédions vos commandes sous 24 à 48 heures ouvrées après validation du paiement.
            Vous recevrez un e-mail de confirmation avec votre numéro de suivi dès que votre colis
            sera expédié.
          </SectionParagraph>
        </div>

        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-3">
            Transporteurs
          </h2>
          <SectionParagraph>
            Nous travaillons avec Colissimo et Chronopost pour assurer une livraison fiable et rapide
            de vos commandes. Le choix du transporteur dépend de la méthode de livraison sélectionnée.
          </SectionParagraph>
        </div>

        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-3">
            Suivi de Colis
          </h2>
          <SectionParagraph>
            Un numéro de suivi vous sera communiqué par e-mail. Vous pouvez suivre l&apos;état de votre
            livraison en temps réel sur le site du transporteur ou directement depuis votre espace
            client.
          </SectionParagraph>
        </div>

        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-3">
            Colis Endommagé
          </h2>
          <SectionParagraph>
            En cas de colis endommagé à la réception, veuillez refuser la livraison et nous
            contacter immédiatement à contact@chicglambyeva.com avec des photos du colis. Nous
            traiterons votre réclamation dans les plus brefs délais.
          </SectionParagraph>
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   RETURNS PAGE
   ================================================================ */

export function ReturnsPage() {
  const steps = [
    {
      step: '1',
      title: 'Demande de Retour',
      description:
        "Connectez-vous à votre espace client ou contactez notre service client pour initier votre demande de retour dans les 30 jours suivant la réception.",
    },
    {
      step: '2',
      title: 'Étiquette de Retour',
      description:
        "Recevez votre étiquette de retour prépayée par e-mail. Imprimez-la et collez-la sur le colis.",
    },
    {
      step: '3',
      title: 'Expédition',
      description:
        "Déposez le colis dans un point relais ou bureau de poste. Conservez votre preuve de dépôt.",
    },
    {
      step: '4',
      title: 'Remboursement',
      description:
        "Après vérification du produit, le remboursement est effectué sous 5 à 10 jours ouvrés sur votre moyen de paiement initial.",
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="Retours" />
      <PageHeader
        title="Retours & Échanges"
        subtitle="Notre politique de retour de 30 jours pour votre tranquillité d'esprit"
      />

      {/* Policy Summary */}
      <section className="mb-12">
        <div className="bg-neutral-50 rounded-2xl p-6 sm:p-8 max-w-4xl">
          <div className="flex items-start gap-4 mb-4">
            <RefreshCw className="size-6 text-neutral-900 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-heading text-lg font-bold text-neutral-950 mb-2">
                Politique de Retour de 30 Jours
              </h2>
              <SectionParagraph>
                Chez CHIC GLAM BY EVA, nous voulons que vous soyez entièrement satisfaite de vos
                achats. C&apos;est pourquoi nous offrons un délai de 30 jours pour retourner tout produit
                non utilisé et dans son emballage d&apos;origine.
              </SectionParagraph>
            </div>
          </div>
        </div>
      </section>

      {/* Return Steps */}
      <section className="mb-12">
        <SectionTitle>Comment Effectuer un Retour</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <Card key={s.step} className="border-neutral-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="size-10 rounded-full bg-neutral-950 text-white flex items-center justify-center font-heading font-bold text-lg mb-4">
                  {s.step}
                </div>
                <h3 className="font-heading font-semibold text-neutral-950 mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-12" />

      {/* Conditions */}
      <section className="max-w-4xl space-y-8">
        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-3">
            Conditions de Retour
          </h2>
          <ul className="space-y-2">
            {[
              'Le produit doit être retourné dans son emballage d\'origine, complet et intact',
              'Le produit ne doit pas avoir été ouvert ou utilisé',
              'La demande de retour doit être effectuée dans les 30 jours suivant la réception',
              'Les produits personnalisés ou d\'hygiène ouverts ne sont pas retournables',
              'Les frais de retour sont à la charge du client sauf en cas de produit défectueux',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                <ChevronRight className="size-4 text-neutral-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-3">
            Produits Non Retournables
          </h2>
          <SectionParagraph>
            Les produits d&apos;hygiène ouverts (crèmes, lotions, maquillage), les produits personnalisés,
            les cadeaux et les articles en promotion finale ne peuvent pas être retournés pour des
            raisons d&apos;hygiène et de sécurité.
          </SectionParagraph>
        </div>

        <div>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-3">
            Besoin d&apos;Aide ?
          </h2>
          <SectionParagraph>
            Notre service client est disponible du lundi au vendredi de 9h à 18h. Contactez-nous à
            contact@chicglambyeva.com ou par téléphone au +33 1 23 45 67 89.
          </SectionParagraph>
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   ORDER TRACKING PAGE — re-exported from dedicated component
   ================================================================ */

export { default as OrderTrackingPage } from '@/components/order/OrderTrackingPage';

/* ================================================================
   COOKIES PAGE
   ================================================================ */

export function CookiesPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="Cookies" />
      <PageHeader
        title="Politique de Cookies"
        subtitle="Dernière mise à jour : Janvier 2025"
      />

      <div className="max-w-4xl space-y-10">
        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            1. Qu&apos;est-ce qu&apos;un Cookie ?
          </h2>
          <SectionParagraph>
            Un cookie est un petit fichier texte déposé sur votre terminal lors de votre visite sur
            notre site. Il permet au site de mémoriser des informations relatives à votre visite
            (préférences de langue, identifiant de session, etc.).
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            2. Types de Cookies Utilisés
          </h2>
          <div className="space-y-4">
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-5">
                <h3 className="font-heading font-semibold text-neutral-950 mb-2">
                  Cookies Strictement Nécessaires
                </h3>
                <SectionParagraph>
                  Indispensables au fonctionnement du site (panier, authentification, sécurité).
                  Ils ne peuvent pas être désactivés.
                </SectionParagraph>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-5">
                <h3 className="font-heading font-semibold text-neutral-950 mb-2">
                  Cookies de Performance
                </h3>
                <SectionParagraph>
                  Collectent des informations anonymes sur l&apos;utilisation du site pour en améliorer
                  les performances (Google Analytics).
                </SectionParagraph>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-5">
                <h3 className="font-heading font-semibold text-neutral-950 mb-2">
                  Cookies Fonctionnels
                </h3>
                <SectionParagraph>
                  Permettent de mémoriser vos préférences (langue, devise, affichage) pour une
                  expérience personnalisée.
                </SectionParagraph>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-5">
                <h3 className="font-heading font-semibold text-neutral-950 mb-2">
                  Cookies Marketing
                </h3>
                <SectionParagraph>
                  Utilisés pour vous proposer des publicités pertinentes et mesurer l&apos;efficacité des
                  campagnes publicitaires.
                </SectionParagraph>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            3. Gestion des Cookies
          </h2>
          <SectionParagraph>
            Vous pouvez gérer vos préférences en matière de cookies à tout moment via le bandeau de
            cookies affiché lors de votre première visite. Vous pouvez également modifier vos
            paramètres directement dans les options de votre navigateur.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            4. Durée de Conservation
          </h2>
          <SectionParagraph>
            La durée de vie maximale des cookies est de 13 mois. Les cookies de session sont supprimés
            automatiquement à la fermeture de votre navigateur.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">5. Contact</h2>
          <SectionParagraph>
            Pour toute question concernant notre utilisation des cookies, contactez-nous à
            privacy@chicglambyeva.com.
          </SectionParagraph>
        </section>
      </div>
    </div>
  );
}

/* ================================================================
   LEGAL PAGE
   ================================================================ */

export function LegalPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="Mentions Légales" />
      <PageHeader title="Mentions Légales" subtitle="Informations légales du site" />

      <div className="max-w-4xl space-y-10">
        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            1. Éditeur du Site
          </h2>
          <div className="bg-neutral-50 rounded-xl p-5 space-y-1.5 text-sm text-neutral-700">
            <p>
              <span className="font-semibold">Raison sociale :</span> CHIC GLAM BY EVA
            </p>
            <p>
              <span className="font-semibold">Forme juridique :</span> SAS (Société par Actions Simplifiée)
            </p>
            <p>
              <span className="font-semibold">Capital social :</span> 10 000€
            </p>
            <p>
              <span className="font-semibold">Siège social :</span> 12 Rue de la Beauté, 75008 Paris, France
            </p>
            <p>
              <span className="font-semibold">SIRET :</span> 123 456 789 00012
            </p>
            <p>
              <span className="font-semibold">N° TVA Intracommunautaire :</span> FR 12 345678901
            </p>
            <p>
              <span className="font-semibold">Directeur de la publication :</span> Eva [Nom]
            </p>
            <p>
              <span className="font-semibold">E-mail :</span> contact@chicglambyeva.com
            </p>
            <p>
              <span className="font-semibold">Téléphone :</span> +33 1 23 45 67 89
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            2. Hébergeur
          </h2>
          <div className="bg-neutral-50 rounded-xl p-5 space-y-1.5 text-sm text-neutral-700">
            <p>
              <span className="font-semibold">Nom :</span> Vercel Inc.
            </p>
            <p>
              <span className="font-semibold">Adresse :</span> 440 N Barranca Ave #4133, Covina, CA 91723, USA
            </p>
            <p>
              <span className="font-semibold">Site web :</span> vercel.com
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            3. Propriété Intellectuelle
          </h2>
          <SectionParagraph>
            L&apos;ensemble des contenus du site (textes, images, vidéos, logos, icônes, sons, logiciels,
            etc.) est protégé par le droit de la propriété intellectuelle. Toute reproduction,
            représentation, modification ou adaptation, totale ou partielle, est interdite sans
            autorisation écrite préalable de CHIC GLAM BY EVA.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            4. Médiation des Litiges
          </h2>
          <SectionParagraph>
            Conformément aux articles L.612-1 et suivants du Code de la consommation, le client peut
            recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable
            du litige. Le médiateur compétent sera communiqué sur demande.
          </SectionParagraph>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-neutral-950 mb-4">
            5. Droit Applicable
          </h2>
          <SectionParagraph>
            Le présent site est soumis au droit français. En cas de litige, les tribunaux de Paris
            seront seuls compétents.
          </SectionParagraph>
        </section>
      </div>
    </div>
  );
}

/* ================================================================
   CAREERS PAGE (Placeholder)
   ================================================================ */

export function CareersPage() {
  const openings = [
    {
      title: 'Responsable Marketing Digital',
      department: 'Marketing',
      location: 'Paris, France',
      type: 'CDI',
    },
    {
      title: 'Conseillère de Vente en Ligne',
      department: 'Service Client',
      location: 'Paris, France',
      type: 'CDI',
    },
    {
      title: 'Social Media Manager',
      department: 'Communication',
      location: 'Paris / Télétravail',
      type: 'CDI',
    },
    {
      title: 'Stagiaire E-commerce',
      department: 'E-commerce',
      location: 'Paris, France',
      type: 'Stage (6 mois)',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="Carrières" />
      <PageHeader
        title="Carrières"
        subtitle="Rejoignez l'équipe CHIC GLAM BY EVA et participez à notre aventure"
      />

      {/* Culture */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-neutral-950 to-neutral-800 rounded-2xl p-8 sm:p-10 text-white max-w-4xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
            Pourquoi Nous Rejoindre ?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 mt-6">
            <div>
              <Sparkles className="size-6 text-white/70 mb-2" />
              <h3 className="font-semibold mb-1">Innovation</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Travaillez avec les dernières technologies e-commerce
              </p>
            </div>
            <div>
              <Users className="size-6 text-white/70 mb-2" />
              <h3 className="font-semibold mb-1">Équipe</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Une équipe passionnée et bienveillante
              </p>
            </div>
            <div>
              <Heart className="size-6 text-white/70 mb-2" />
              <h3 className="font-semibold mb-1">Beauté</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Univers de marques de luxe et de beauté
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="max-w-4xl">
        <SectionTitle>Offres d&apos;Emploi</SectionTitle>
        <div className="space-y-3">
          {openings.map((job) => (
            <Card key={job.title} className="border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="py-5 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-heading font-semibold text-neutral-950">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {job.department}
                    </span>
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {job.location}
                    </span>
                    <span className="text-xs font-medium text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded-full">
                      {job.type}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  Postuler
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-neutral-500 mt-6 text-center">
          Vous ne trouvez pas votre poste ? Envoyez votre candidature spontanée à{' '}
          <span className="font-medium text-neutral-900">recrutement@chicglambyeva.com</span>
        </p>
      </section>
    </div>
  );
}

/* ================================================================
   PRESS PAGE (Placeholder)
   ================================================================ */

export function PressPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="Presse" />
      <PageHeader
        title="Presse"
        subtitle="Espace dédié aux journalistes et médias"
      />

      <div className="max-w-4xl space-y-10">
        {/* Press Kit */}
        <section>
          <SectionTitle>Kit de Presse</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="size-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-neutral-600" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-neutral-950 mb-1">
                    Dossier de Presse
                  </h3>
                  <p className="text-sm text-neutral-500 mb-3">
                    Présentation de la marque, chiffres clés et actualités
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    Télécharger PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="size-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  <Globe className="size-5 text-neutral-600" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-neutral-950 mb-1">
                    Logos & Images
                  </h3>
                  <p className="text-sm text-neutral-500 mb-3">
                    Logos HD, photos de produits et visuels de marque
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    Télécharger ZIP
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Contact */}
        <section>
          <SectionTitle>Contact Presse</SectionTitle>
          <div className="bg-neutral-50 rounded-xl p-6 space-y-2 text-sm">
            <p className="font-semibold text-neutral-950">Service Presse</p>
            <p className="text-neutral-600">
              <span className="font-medium text-neutral-700">E-mail :</span>{' '}
              presse@chicglambyeva.com
            </p>
            <p className="text-neutral-600">
              <span className="font-medium text-neutral-700">Téléphone :</span> +33 1 23 45 67 90
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================================================================
   BLOG PAGE (Placeholder)
   ================================================================ */

export function BlogPage() {
  const posts = [
    {
      title: 'Les Tendances Maquillage Printemps 2025',
      excerpt: "Découvrez les couleurs et textures qui feront fureur cette saison. Du rose poudré aux tons dorés, voici notre sélection.",
      date: '15 Jan 2025',
      category: 'Beauté',
    },
    {
      title: 'Routine Skincare : Les 5 Étapes Essentielles',
      excerpt: "Une routine de soin complète pour une peau éclatante. Nos experts vous guident étape par étape.",
      date: '10 Jan 2025',
      category: 'Soins',
    },
    {
      title: 'Comment Choisir son Parfum d\'Été',
      excerpt: "Les notes fraîches et légères qui vous accompagneront tout l'été. Guide complet pour trouver votre signature olfactive.",
      date: '5 Jan 2025',
      category: 'Parfums',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PageBreadcrumb title="Blog" />
      <PageHeader
        title="Blog Beauté"
        subtitle="Conseils, tendances et actualités du monde de la beauté"
      />

      <div className="max-w-4xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post.title}
              className="border-neutral-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-t-lg flex items-center justify-center">
                <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
                  Article
                </span>
              </div>
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-neutral-400">{post.date}</span>
                </div>
                <h3 className="font-heading font-semibold text-neutral-950 text-base mb-2 group-hover:underline">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="border-dashed border-neutral-300 bg-neutral-50">
            <CardContent className="py-12">
              <Sparkles className="size-8 text-neutral-400 mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-neutral-700 mb-2">
                Bientôt Plus d&apos;Articles
              </h3>
              <p className="text-sm text-neutral-500">
                Notre blog est en cours de construction. Revenez bientôt pour découvrir nos prochains
                articles beauté !
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
