"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const { logout } = useAuth();

  async function onClick() {
    await logout();
    router.push("/connexion");
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-lg border border-navy-100 px-4 py-2 text-sm font-medium text-navy-800 hover:border-brand-orange hover:text-brand-orange"
      }
    >
      <LogOut className="h-4 w-4" /> Se déconnecter
    </button>
  );
}
