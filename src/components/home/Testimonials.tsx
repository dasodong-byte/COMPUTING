"use client";

import { useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/services";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const prev = () => setI((v) => (v - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setI((v) => (v + 1) % TESTIMONIALS.length);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-extrabold uppercase text-navy-800">
          Ils nous font <span className="text-brand-orange">confiance</span>
        </h3>
        <button className="text-xs font-semibold text-brand-blue hover:underline">
          Voir tous les témoignages →
        </button>
      </div>

      <div className="relative flex-1 rounded-2xl bg-navy-800 p-6 text-white">
        <Quote className="h-8 w-8 text-brand-orange/60" />
        <p className="mt-3 text-sm leading-relaxed text-navy-100/90">{t.quote}</p>
        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
            {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </span>
          <div>
            <div className="text-sm font-bold">{t.name}</div>
            <div className="text-xs text-navy-100/70">{t.role}</div>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, k) => (
                <Star key={k} className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          <button onClick={prev} aria-label="Précédent" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next} aria-label="Suivant" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {TESTIMONIALS.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Témoignage ${k + 1}`}
            className={`h-2 rounded-full transition-all ${k === i ? "w-5 bg-brand-orange" : "w-2 bg-navy-100"}`}
          />
        ))}
      </div>
    </div>
  );
}
