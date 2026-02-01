export type CaseStudy = {
  slug: string
  title: string
  client: string
  industry: string
  summary: string
  challenge: string
  solution: string
  results: { label: string; value: string }[]
  stack: string[]
  useCaseAnchor: "sales" | "operations"
  image?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "whitefield-luxury-apartments",
    title: "Whitefield Luxury Apartments",
    client: "Whitefield",
    industry: "Real Estate",
    image: "/images/case-studies/whitefield.png",
    summary: "A premium digital presence that showcases luxury living spaces and streamlines tenant inquiries through an immersive user experience.",
    challenge: "High-end properties require high-end digital representation. The client needed a way to showcase amenities and floor plans effectively while capturing qualified leads from potential tenants.",
    solution: "We built a high-performance Next.js application featuring immersive image galleries, real-time availability checking, and a streamlined inquiry process integrated directly with their CRM.",
    results: [
      { label: "Inquiry Rate", value: "+25%" },
      { label: "Page Load Time", value: "0.8s" },
      { label: "User Engagement", value: "High" }
    ],
    stack: ["Next.js", "Tailwind CSS", "Framer Motion", "Supabase"],
    useCaseAnchor: "sales"
  },
  {
    slug: "eunan-tech-training-institute",
    title: "Eunan Tech Training Institute",
    client: "Eunan Tech",
    industry: "EdTech",
    image: "/images/case-studies/eunan-tech.png",
    summary: "A comprehensive educational platform streamlining student enrollment, course management, and resource distribution for a growing tech institute.",
    challenge: "Managing student registrations, course schedules, and learning materials manually was becoming unscalable. They needed a centralized system to handle the entire student lifecycle.",
    solution: "Developed a custom portal handling student registration, course progression tracking, and automated notifications. The system reduces administrative overhead and improves the student experience.",
    results: [
      { label: "Admin Time Saved", value: "20hrs/wk" },
      { label: "Enrollment Speed", value: "2x" },
      { label: "Student Satisfaction", value: "98%" }
    ],
    stack: ["Next.js", "React", "Node.js", "PostgreSQL"],
    useCaseAnchor: "operations"
  },
  {
    slug: "sms-wine-nine",
    title: "SMS Wine Nine",
    client: "SMS Wine Nine",
    industry: "E-commerce",
    image: "/images/case-studies/sms-wine-nine.png",
    summary: "A specialized e-commerce solution designed to simplify wine distribution and enhance the purchasing experience for connoisseurs.",
    challenge: "The client needed a robust platform to manage complex inventory variants and provide a seamless checkout experience that builds trust with premium customers.",
    solution: "Implemented a custom e-commerce storefront with advanced filtering, secure payment processing, and inventory synchronization to ensure accurate stock levels.",
    results: [
      { label: "Conversion Rate", value: "+15%" },
      { label: "Checkout Time", value: "-40%" },
      { label: "Mobile Sales", value: "Up" }
    ],
    stack: ["Next.js", "Shopify API", "Stripe", "Vercel"],
    useCaseAnchor: "sales"
  }
]
