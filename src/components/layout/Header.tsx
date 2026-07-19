"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { MAIN_NAV } from "@/lib/nav";
import { SITE } from "@/lib/site";
import { useCart } from "@/context/CartContext";
import { AccountMenu } from "@/components/layout/AccountMenu";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="hidden bg-navy-800 text-white lg:block">
        <div className="container-cs flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-orange" />
              {SITE.address.street}, {SITE.address.city}
            </span>
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 hover:text-brand-orange">
              <Phone className="h-3.5 w-3.5 text-brand-orange" />
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 hover:text-brand-orange">
              <Mail className="h-3.5 w-3.5 text-brand-orange" />
              {SITE.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href={SITE.social.facebook} aria-label="Facebook" className="hover:text-brand-orange"><Facebook className="h-4 w-4" /></a>
            <a href={SITE.social.linkedin} aria-label="LinkedIn" className="hover:text-brand-orange"><Linkedin className="h-4 w-4" /></a>
            <a href={SITE.social.instagram} aria-label="Instagram" className="hover:text-brand-orange"><Instagram className="h-4 w-4" /></a>
            <a href={SITE.social.youtube} aria-label="YouTube" className="hover:text-brand-orange"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-navy-100 bg-white shadow-sm">
        <div className="container-cs flex h-[70px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-lg bg-navy-950 ring-1 ring-navy-100">
              <Image src="/images/logo-emblem.png" alt={SITE.name} fill className="object-cover" sizes="44px" />
            </span>
            <span className="leading-none">
              <span className="block text-lg font-extrabold tracking-tight text-navy-800">COMPUTING</span>
              <span className="block text-[11px] font-semibold tracking-[0.2em] text-brand-blue">
                SERVICES <span className="text-brand-orange">SARL</span>
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {MAIN_NAV.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-navy-800 hover:text-brand-blue">
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <div className="invisible absolute left-0 top-full w-64 translate-y-2 rounded-xl border border-navy-100 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block rounded-md px-3 py-2 text-sm text-navy-800 hover:bg-navy-50 hover:text-brand-blue">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-navy-800 hover:text-brand-blue">
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/panier" aria-label="Panier" className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-navy-100 text-navy-800 hover:border-brand-blue hover:text-brand-blue">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <AccountMenu />
            <Link href="/contact#devis" className="btn-primary hidden md:inline-flex">
              Demander un devis <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-navy-100 text-navy-800 xl:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-navy-100 bg-white xl:hidden">
            <nav className="container-cs flex flex-col py-3">
              {MAIN_NAV.map((item) =>
                item.children ? (
                  <div key={item.href}>
                    <button
                      className="flex w-full items-center justify-between py-2.5 text-sm font-medium text-navy-800"
                      onClick={() => setServicesOpen((v) => !v)}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {servicesOpen && (
                      <div className="ml-3 flex flex-col border-l border-navy-100 pl-3">
                        {item.children.map((c) => (
                          <Link key={c.href} href={c.href} className="py-2 text-sm text-navy-600" onClick={() => setMobileOpen(false)}>
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={item.href} href={item.href} className="py-2.5 text-sm font-medium text-navy-800" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                )
              )}
              <Link href="/contact#devis" className="btn-primary mt-3" onClick={() => setMobileOpen(false)}>
                Demander un devis <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
