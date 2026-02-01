export type Project = {
  slug: string
  title: string
  summary: string
  url?: string
  stack: string[]
  role: string
  image?: string
}

export const projects: Project[] = [
  {
    slug: "sms-wine-nine",
    title: "SMS Wine Nine",
    summary: "School Management System with role-based admin, attendance, grading, and modern UX.",
    url: "https://sms-wine-nine.vercel.app",
    stack: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    role: "System Design & Development"
  },
  {
    slug: "evolving-with-cheta",
    title: "Evolving with Cheta",
    summary: "Blog website design focused on clean typography and content-first layout.",
    url: "https://evolvingwithcheta.com",
    stack: ["Web Design", "CMS"],
    role: "Web Design & Development"
  },
  {
    slug: "eunan-tech-training-institute",
    title: "Eunan Tech Training Institute",
    summary: "Institutional website with programs, admissions information, and contact workflows.",
    url: "https://eunantech.com",
    stack: ["Web Design", "Responsive"],
    role: "Web Design & Development",
    image: "/work/eunan-tech.png"
  },
  {
    slug: "tridah-media",
    title: "Tridah Media",
    summary: "Design agency website highlighting services, portfolio, and contact flows.",
    url: "https://tridahmedia.com",
    stack: ["Web Design", "Brand"],
    role: "Web Design & Development"
  },
  {
    slug: "white-field-luxury-apartment",
    title: "White Field Luxury Apartment",
    summary: "Property website with listings, amenities, and enquiry contact forms.",
    url: "https://whitefieldluxuryapartment.com",
    stack: ["Web Design", "Responsive"],
    role: "Web Design & Development"
  }
]
