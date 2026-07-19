"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, ShieldCheck, User, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "register";

export function LoginPanel({
  title,
  accent,
  mode = "login",
}: {
  title: string;
  accent: "blue" | "orange";
  mode?: Mode;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const btn = accent === "orange" ? "btn-primary" : "btn-blue";
  const isRegister = mode === "register";
  const nextParam = params.get("next");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      await refresh();
      const target = nextParam || data.redirectTo || "/espace-client";
      router.push(target);
      router.refresh();
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
      setLoading(false);
    }
  }

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
          <p className="mt-1 text-sm text-navy-600">
            {isRegister
              ? "Créez votre compte pour commander et suivre vos dossiers."
              : "Connectez-vous pour accéder à votre espace."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-800">Prénom</label>
                <div className="flex items-center rounded-lg border border-navy-100 px-3 focus-within:border-brand-blue">
                  <User className="h-4 w-4 text-navy-600" />
                  <input name="firstName" required placeholder="Jean" className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-800">Nom</label>
                <div className="flex items-center rounded-lg border border-navy-100 px-3 focus-within:border-brand-blue">
                  <User className="h-4 w-4 text-navy-600" />
                  <input name="lastName" required placeholder="Dupont" className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none" />
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-800">Email</label>
            <div className="flex items-center rounded-lg border border-navy-100 px-3 focus-within:border-brand-blue">
              <Mail className="h-4 w-4 text-navy-600" />
              <input type="email" name="email" required placeholder="vous@exemple.com" className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-800">Mot de passe</label>
            <div className="flex items-center rounded-lg border border-navy-100 px-3 focus-within:border-brand-blue">
              <Lock className="h-4 w-4 text-navy-600" />
              <input type="password" name="password" required minLength={isRegister ? 8 : undefined} placeholder="••••••••" className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none" />
            </div>
          </div>
          {isRegister && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Téléphone (optionnel)</label>
              <div className="flex items-center rounded-lg border border-navy-100 px-3 focus-within:border-brand-blue">
                <User className="h-4 w-4 text-navy-600" />
                <input name="phone" placeholder="+243 …" className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none" />
              </div>
            </div>
          )}
          {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className={`${btn} w-full ${loading ? "opacity-70" : ""}`}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isRegister ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-navy-600">
          {isRegister ? (
            <>
              Déjà un compte ?{" "}
              <Link href="/connexion" className="font-semibold text-brand-blue hover:underline">
                Se connecter
              </Link>
            </>
          ) : (
            <>
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="font-semibold text-brand-blue hover:underline">
                Créer un compte
              </Link>
            </>
          )}
        </p>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-navy-600">
          <ShieldCheck className="h-4 w-4 text-brand-orange" /> Connexion sécurisée &amp; confidentielle
        </p>
      </div>
    </div>
  );
}
