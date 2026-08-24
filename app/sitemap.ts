import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bahriahanif.edu.pk";
  const currentDate = new Date().toISOString();

  const routes = [
    "",
    "/about",
    "/groups",
    "/groups/pre-medical",
    "/groups/pre-engineering",
    "/groups/computer-science",
    "/admissions",
    "/notice-board",
    "/results",
    "/facilities",
    "/faculty",
    "/gallery",
    "/alumni",
    "/announcements",
    "/portal",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === "/notice-board" || route === "/announcements" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/groups") ? 0.9 : 0.8,
  }));
}
