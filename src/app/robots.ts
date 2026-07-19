import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/espace-client", "/espace-staff", "/commande", "/panier"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
