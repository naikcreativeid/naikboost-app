import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://naikboost.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/contact", "/syarat-ketentuan", "/kebijakan-privasi"],
        disallow: ["/admin", "/dashboard", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
