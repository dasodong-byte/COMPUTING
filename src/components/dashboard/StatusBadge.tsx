import { statusBadgeClass } from "@/lib/commerce";

export function StatusBadge({ label, status }: { label: string; status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(status)}`}>
      {label}
    </span>
  );
}
