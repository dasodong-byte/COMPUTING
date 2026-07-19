import {
  Laptop,
  Plane,
  Ship,
  Printer,
  Home,
  Armchair,
  Users,
  Cpu,
  Award,
  ShieldCheck,
  Clock,
  Lightbulb,
  Handshake,
  Mouse,
  Server,
  NotebookPen,
  AppWindow,
  type LucideProps,
} from "lucide-react";

const MAP = {
  Laptop,
  Plane,
  Ship,
  Printer,
  Home,
  Armchair,
  Users,
  Cpu,
  Award,
  ShieldCheck,
  Clock,
  Lightbulb,
  Handshake,
  Mouse,
  Server,
  NotebookPen,
  AppWindow,
} as const;

export type IconName = keyof typeof MAP;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = MAP[name as IconName] ?? Cpu;
  return <Cmp {...props} />;
}
