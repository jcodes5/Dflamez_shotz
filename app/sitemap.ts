import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dflamezshotz.com"
  const routes = ["", "/about", "/services", "/hire", "/gallery", "/blog", "/contact", "/book"]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/contact" || route === "/hire" ? 0.8 : 0.7,
  }))
}