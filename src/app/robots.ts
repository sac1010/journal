import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/register"],
    },
    sitemap: "https://journal-lvovma8v9-sac1010s-projects.vercel.app/sitemap.xml",
  };
}
