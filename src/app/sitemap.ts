import type { MetadataRoute } from "next";
import { projects } from "@/config/portfolio";
import { siteOrigin } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return [];
  const paths = ["/", ...projects.map(project => project.url).filter(
    (url): url is string => Boolean(url?.startsWith("/projects/")),
  )];
  return paths.map(path => ({ url: new URL(path, siteOrigin).href }));
}
