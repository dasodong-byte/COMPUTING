"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { homeForRoles } from "@/lib/auth/rbac";

export function AccountMenu() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <span className="hidden h-10 w-10 animate-pulse rounded-md bg-navy-50 md:inline-block" />;
  }

  if (!user) {
    return (
      <Link
        href="/connexion"
        className="inline-flex h-10 items-center gap-1.5 rounded-md border border-navy-100 px-3 text-sm font-medium text-navy-800 hover:border-brand-blue hover:text-brand-blue"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Connexion</span>
      </Link>
    );
  }

  const home = homeForRoles(user.roles);

  async function onLogout() {
    await logout();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-1.5 rounded-md border border-navy-100 px-3 text-sm font-medium text-navy-800 hover:border-brand-blue hover:text-brand-blue"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-bold text-brand-blue">
          {user.firstName?.[0]?.toUpperCase() ?? "U"}
        </span>
        <span className="hidden max-w-[100px] truncate sm:inline">{user.firstName}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-navy-100 bg-white p-2 shadow-xl">
            <div className="px-3 py-2">
              <p className="truncate text-sm font-semibold text-navy-800">{user.name}</p>
              <p className="truncate text-xs text-navy-600">{user.email}</p>
            </div>
            <Link
              href={home}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-navy-800 hover:bg-navy-50 hover:text-brand-blue"
            >
              <LayoutDashboard className="h-4 w-4" /> Mon espace
            </Link>
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-navy-800 hover:bg-navy-50 hover:text-brand-orange"
            >
              <LogOut className="h-4 w-4" /> Se déconnecter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
