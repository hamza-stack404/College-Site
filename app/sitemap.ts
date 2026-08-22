import { MetadataRoute } from "next";
import { programsData } from "@/lib/data/programs";
import { newsArticlesData, campusEventsData } from "@/lib/data/news-events";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bahriahanif.edu.pk";

  const staticRoutes = [
    "",
    "/about",
    "/academics",
    "/admissions",
    "/campus-life",
    "/faculty",
    "/news-events",
    "/gallery",
    "/alumni",
    "/contact",
    "/portal",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const programRoutes = programsData.map((program) => ({
    url: `${baseUrl}/academics/${program.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const newsRoutes = newsArticlesData.map((article) => ({
    url: `${baseUrl}/news-events/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const eventRoutes = campusEventsData.map((event) => ({
    url: `${baseUrl}/news-events/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...programRoutes, ...newsRoutes, ...eventRoutes];
}
