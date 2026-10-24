import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/profile",
        "/login",
        "/signup",
        "/verify",
        "/reset-password",
        "/update-password",
        "/news/create",
        "/news/edit/",
        "/art/create",
        "/art/edit/",
        "/engineer/create",
        "/engineer/edit/",
      ],
    },
    sitemap: "https://www.solcafe.ca/sitemap.xml",
  };
}
