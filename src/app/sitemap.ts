import { MetadataRoute } from "next"
import { caseStudies } from "@/data/case-studies"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://webautomate.agency"

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/work",
    "/case-studies",
    "/automation-use-cases",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  const caseStudyRoutes = caseStudies.map((cs) => ({
    url: `${baseUrl}/case-studies/${cs.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...caseStudyRoutes]
}
