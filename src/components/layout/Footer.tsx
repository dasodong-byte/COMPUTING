import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Send,
  QrCode,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { FOOTER_LINKS } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="container-cs grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-lg bg-navy-950 ring-1 ring-white/10">
              <Image src="/images/logo-emblem.png" alt={SITE.name} fill className="object-cover" sizes="44px" />
            </span>
            <span className="leading-none">
              <span className="block text-base font-extrabold text-white">COMPUTING</span>
              <span className="block text-[10px] font-semibold tracking-[0.2em] text-brand-blue">
                SERVICES <span className="text-brand-orange">SARL</span>
              </span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-100/70">
            Votre partenaire de confiance pour la transformation digitale et le
            développement de vos projets. Ensemble, construisons un avenir durable
            et prospère.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[
              { icon: Facebook, href: SITE.social.facebook, label: "Facebook" },
              { icon: Linkedin, href: SITE.social.linkedin, label: "LinkedIn" },
              { icon: Instagram, href: SITE.social.instagram, label: "Instagram" },
              { icon: Youtube, href: SITE.social.youtube, label: "YouTube" },
            ].map(({ icon: I, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-brand-blue"
              >
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Liens rapides</h3>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_LINKS.quick.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-navy-100/70 transition hover:text-brand-orange">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Nos services</h3>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_LINKS.services.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-navy-100/70 transition hover:text-brand-orange">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Contactez-nous</h3>
          <ul className="space-y-3 text-sm text-navy-100/70">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
              <span>{SITE.address.street}<br />{SITE.address.city}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-orange" />
              <a href={`tel:${SITE.phone}`} className="hover:text-brand-orange">{SITE.phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand-orange" />
              <a href={`mailto:${SITE.email}`} className="hover:text-brand-orange">{SITE.email}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 shrink-0 text-brand-orange" />
              <span>www.computing-services.fr</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Newsletter</h3>
          <p className="text-sm text-navy-100/70">Abonnez-vous pour recevoir nos actualités et offres.</p>
          <form className="mt-4 flex overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <input
              type="email"
              required
              placeholder="Votre email"
              className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-navy-100/50 focus:outline-none"
            />
            <button type="submit" aria-label="S'abonner" className="flex items-center justify-center bg-brand-orange px-3 text-white hover:bg-brand-orangeDark">
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-navy-900">
              <QrCode className="h-12 w-12" />
            </div>
            <span className="text-xs text-navy-100/70">Scanner pour<br />visiter notre site</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-cs flex flex-col items-center justify-between gap-3 py-5 text-xs text-navy-100/60 md:flex-row">
          <p>© 2024 COMPUTING SERVICES SARL - Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-brand-orange">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-brand-orange">Politique de confidentialité</Link>
            <Link href="/cgu" className="hover:text-brand-orange">Conditions générales d&apos;utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
