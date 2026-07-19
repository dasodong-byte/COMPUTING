import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { NotificationsList } from "@/components/dashboard/NotificationsList";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/notifications");

  const items = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <>
      <PageHeader title="Notifications" crumbs={[{ label: "Notifications" }]} />
      <section className="container-cs section">
        <div className="mx-auto max-w-2xl">
          <NotificationsList
            initial={items.map((n) => ({
              id: n.id,
              title: n.title,
              body: n.body,
              read: n.read,
              createdAt: n.createdAt.toISOString(),
            }))}
          />
        </div>
      </section>
    </>
  );
}
