import { PrismaClient } from "@prisma/client";
import { CATEGORIES, PRODUCTS } from "../src/lib/products";
import { POSTS } from "../src/lib/posts";
import { TESTIMONIALS, PARTNERS } from "../src/lib/services";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Computing Services SARL database…");

  // Roles
  const roleNames = ["ADMIN", "STAFF", "CLIENT"];
  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
  }

  // Categories
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon },
      create: { name: c.name, slug: c.slug, icon: c.icon },
    });
  }

  // Brands + Products
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
      update: {},
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

  // Blog
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

  // Testimonials
  for (let i = 0; i < TESTIMONIALS.length; i++) {
    const t = TESTIMONIALS[i];
    await prisma.testimonial.create({
      data: { name: t.name, role: t.role, quote: t.quote, rating: t.rating, position: i },
    });
  }

  // Partners
  for (let i = 0; i < PARTNERS.length; i++) {
    await prisma.partner.create({ data: { name: PARTNERS[i], position: i } });
  }

  console.log("✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
