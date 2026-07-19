"use client";

import { useState } from "react";
import { LogIn, Mail, Lock, ShieldCheck } from "lucide-react";

export function LoginPanel({
  title,
  accent,
}: {
  title: string;
  accent: "blue" | "orange";
}) {
  const [msg, setMsg] = useState("");
  const btn = accent === "orange" ? "btn-primary" : "btn-blue";

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-8">
        <div className="mb-6 text-center">
          <span
            className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${
              accent === "orange" ? "bg-brand-orange/10 text-brand-orange" : "bg-brand-blue/10 text-brand-blue"
            }`}
          >
            <LogIn className="h-7 w-7" />
          </span>
          <h1 className="text-xl font-extrabold text-navy-800">{title}</h1>
          <p className="mt-1 text-sm text-navy-600">Connectez-vous pour accéder à votre espace.</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setMsg("Authentification de démonstration — le backend sécurisé (JWT) sera connecté prochainement.");
          }}
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-800">Email</label>
            <div className="flex items-center rounded-lg border border-navy-100 px-3 focus-within:border-brand-blue">
              <Mail className="h-4 w-4 text-navy-600" />
              <input type="email" required placeholder="vous@exemple.com" className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-800">Mot de passe</label>
            <div className="flex items-center rounded-lg border border-navy-100 px-3 focus-within:border-brand-blue">
              <Lock className="h-4 w-4 text-navy-600" />
              <input type="password" required placeholder="••••••••" className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none" />
            </div>
          </div>
          {msg && <p className="rounded-lg bg-navy-50 p-3 text-xs text-navy-600">{msg}</p>}
          <button type="submit" className={`${btn} w-full`}>Se connecter</button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-navy-600">
          <ShieldCheck className="h-4 w-4 text-brand-orange" /> Connexion sécurisée & confidentielle
        </p>
      </div>
    </div>
  );
}
