import { PrismaClient } from "@prisma/client";
import { CATEGORIES, PRODUCTS } from "../src/lib/products";
import { POSTS } from "../src/lib/posts";
import { TESTIMONIALS, PARTNERS } from "../src/lib/services";
import { hashPassword } from "../src/lib/auth/password";
import {
  ROLES,
  ROLE_PERMISSIONS,
  ROLE_LABELS,
  PERMISSION_DESCRIPTIONS,
  type RoleName,
} from "../src/lib/auth/rbac";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || "Password123!";

async function seedRbac() {
  // Roles
  const roleByName: Record<string, string> = {};
  for (const name of Object.values(ROLES)) {
    const role = await prisma.role.upsert({
      where: { name },
      update: { description: ROLE_LABELS[name] },
      create: { name, description: ROLE_LABELS[name] },
    });
    roleByName[name] = role.id;
  }

  // Permissions
  const permByKey: Record<string, string> = {};
  for (const [key, description] of Object.entries(PERMISSION_DESCRIPTIONS)) {
    const perm = await prisma.permission.upsert({
      where: { key },
      update: { description },
      create: { key, description },
    });
    permByKey[key] = perm.id;
  }

  // Role → Permission wiring
  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleByName[roleName];
    for (const permKey of perms) {
      const permissionId = permByKey[permKey];
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {},
        create: { roleId, permissionId },
      });
    }
  }

  return roleByName;
}

async function seedUsers(roleByName: Record<string, string>) {
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);

  const demo: {
    email: string;
    firstName: string;
    lastName: string;
    role: RoleName;
    isCustomer?: boolean;
    isEmployee?: boolean;
  }[] = [
    { email: "admin@computing-services.fr", firstName: "Admin", lastName: "CS", role: ROLES.ADMIN, isEmployee: true },
    { email: "staff@computing-services.fr", firstName: "Staff", lastName: "CS", role: ROLES.STAFF, isEmployee: true },
    { email: "client@computing-services.fr", firstName: "Client", lastName: "Démo", role: ROLES.CLIENT, isCustomer: true },
  ];

  for (const d of demo) {
    const user = await prisma.user.upsert({
      where: { email: d.email },
      update: { passwordHash, firstName: d.firstName, lastName: d.lastName },
      create: {
        email: d.email,
        passwordHash,
        firstName: d.firstName,
        lastName: d.lastName,
        emailVerified: new Date(),
      },
    });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: roleByName[d.role] } },
      update: {},
      create: { userId: user.id, roleId: roleByName[d.role] },
    });

    if (d.isCustomer) {
      await prisma.customer.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id },
      });
    }
    if (d.isEmployee) {
      await prisma.employee.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id, jobTitle: d.role === ROLES.ADMIN ? "Administrateur" : "Agent" },
      });
    }
  }
}

async function seedCatalog() {
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon },
      create: { name: c.name, slug: c.slug, icon: c.icon },
    });
  }

  for (const p of PRODUCTS) {
    const category = await prisma.category.findUnique({ where: { slug: p.category } });
    if (!category) continue;

    const brandSlug = p.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const brand = await prisma.brand.upsert({
      where: { slug: brandSlug },
      update: {},
      create: { name: p.brand, slug: brandSlug },
    });

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { price: p.price, stock: p.stock },
      create: {
        name: p.name,
        slug: p.slug,
        shortDesc: p.short,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        stock: p.stock,
        rating: p.rating,
        featured: Boolean(p.featured),
        isNew: Boolean(p.isNew),
        published: true,
        categoryId: category.id,
        brandId: brand.id,
        specs: {
          create: p.specs.map((s) => ({ label: s.label, value: s.value })),
        },
      },
    });
  }
}

async function seedContent() {
  for (const post of POSTS) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content.join("\n\n"),
        status: "PUBLISHED",
        publishedAt: new Date(post.date),
      },
    });
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    for (let i = 0; i < TESTIMONIALS.length; i++) {
      const t = TESTIMONIALS[i];
      await prisma.testimonial.create({
        data: { name: t.name, role: t.role, quote: t.quote, rating: t.rating, position: i },
      });
    }
  }

  const partnerCount = await prisma.partner.count();
  if (partnerCount === 0) {
    for (let i = 0; i < PARTNERS.length; i++) {
      await prisma.partner.create({ data: { name: PARTNERS[i], position: i } });
    }
  }
}

async function main() {
  console.log("🌱 Seeding Computing Services SARL database…");
  const roleByName = await seedRbac();
  await seedUsers(roleByName);
  await seedCatalog();
  await seedContent();
  console.log("✅ Seed completed.");
  console.log(`   Demo accounts (password: ${DEFAULT_PASSWORD}):`);
  console.log("   - admin@computing-services.fr (ADMIN)");
  console.log("   - staff@computing-services.fr (STAFF)");
  console.log("   - client@computing-services.fr (CLIENT)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
