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
    image: "/images/case-studies/eunan-tech.png",
  },
  {
    slug: "sms-wine-nine",
    title: "SMS Wine Nine",
    role: "Design & Development",
    summary: "An e-commerce solution for wine distribution.",
    url: "https://smswinenine.com",
    image: "/images/case-studies/sms-wine-nine.png",
  },
  {
    slug: "tridah-media",
    title: "Tridah Media",
    role: "Full Stack",
    summary: "Digital agency portfolio and service management.",
    url: "https://tridahmedia.com",
    image: "/images/case-studies/tridah-media.png",
  },
  {
    slug: "evolving-with-cheta",
    title: "Evolving with Cheta",
    role: "Design & Development",
    summary: "A blog platform sharing personal insights and stories.",
    url: "https://evolvingwithcheta.com",
  },
  {
    slug: "whitefield-luxury-apartments",
    title: "Whitefield Luxury Apartments",
    role: "Real Estate Development",
    summary: "Premium real estate showcase and booking platform.",
    url: "https://whitefieldapartments.com",
    image: "/images/case-studies/whitefield.png",
  },
]
