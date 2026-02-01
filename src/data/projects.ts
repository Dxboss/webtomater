export interface Project {
  slug: string
  title: string
  role: string
  summary: string
  url?: string
  image?: string
}

export const projects: Project[] = [
  {
    slug: "eunan-tech-training-institute",
    title: "Eunan Tech Training Institute",
    role: "Development",
    summary: "A comprehensive platform for tech training and education.",
    url: "https://eunantech.com",
  },
  {
    slug: "sms-wine-nine",
    title: "SMS Wine Nine",
    role: "Design & Development",
    summary: "An e-commerce solution for wine distribution.",
    url: "https://smswinenine.com",
  },
  {
    slug: "tridah-media",
    title: "Tridah Media",
    role: "Full Stack",
    summary: "Digital agency portfolio and service management.",
    url: "https://tridahmedia.com",
  },
]
