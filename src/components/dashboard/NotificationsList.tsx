"use client";

import { useState } from "react";
import { CheckCheck, Bell } from "lucide-react";

type Item = { id: string; title: string; body: string | null; read: boolean; createdAt: string };

export function NotificationsList({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const hasUnread = items.some((i) => !i.read);

  async function markAll() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-navy-100 p-12 text-center text-navy-600">
        <Bell className="mx-auto h-8 w-8 text-navy-300" />
        <p className="mt-2">Aucune notification pour le moment.</p>
      </div>
    );
  }

  return (
    <div>
      {hasUnread && (
        <div className="mb-4 flex justify-end">
          <button onClick={markAll} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline">
            <CheckCheck className="h-4 w-4" /> Tout marquer comme lu
          </button>
        </div>
      )}
      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id} className={`rounded-xl border p-4 ${n.read ? "border-navy-100 bg-white" : "border-brand-blue/30 bg-navy-50"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-navy-800">{n.title}</p>
                {n.body && <p className="mt-0.5 text-sm text-navy-600">{n.body}</p>}
              </div>
              {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-blue" />}
            </div>
            <p className="mt-2 text-xs text-navy-500">{new Date(n.createdAt).toLocaleString("fr-FR")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
