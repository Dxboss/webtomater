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
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "techstartup-scale-up",
    title: "TechStartup Scale-up",
    client: "TechStartup Inc.",
    industry: "B2B SaaS",
    summary: "A complete go-to-market automation that qualified leads, synced enriched data to CRM and triggered timely follow-ups. Demo bookings rose while manual data work dropped to near zero.",
    challenge: "Marketing generated leads from forms, webinars and chat, but data quality was inconsistent. Sales spent hours cleaning records and routing them manually, causing slow responses and missed opportunities.",
    solution: "Unified intake with enrichment, scoring and routing to CRM. Added automated sequences for SDR follow-ups and owner reassignment rules. Built dashboards to monitor conversion and response time.",
    results: [
      { label: "Demo bookings", value: "+38%" },
      { label: "Manual hours saved/week", value: "15" },
      { label: "Lead response time", value: "-63%" }
    ],
    stack: ["Next.js", "Supabase", "Zapier", "HubSpot"],
    useCaseAnchor: "sales"
  },
  {
    slug: "agency-operations",
    title: "Agency Operations",
    client: "Studio Collective",
    industry: "Creative Services",
    summary: "A standardized onboarding flow created projects, folders, tasks and contracts automatically across tools. Time-to-kickoff shortened and asset accuracy improved dramatically.",
    challenge: "Each project manager followed a slightly different process. Assets went missing, tasks were duplicated and kickoff dates slipped due to manual setup time.",
    solution: "A single intake that drives multi-system automation: project creation, folder scaffolding, task templates and contract generation/signing. Added audit logs and status dashboards.",
    results: [
      { label: "Onboarding time", value: "-52%" },
      { label: "Project setup accuracy", value: "+99%" },
      { label: "Admin hours saved/mo", value: "32" }
    ],
    stack: ["Next.js", "Make", "Notion", "Asana", "DocuSign"],
    useCaseAnchor: "operations"
  },
  {
    slug: "ecommerce-automation",
    title: "E-commerce Automation",
    client: "North & Co.",
    industry: "Retail",
    summary: "Connected inventory and marketing systems to prevent stockouts and orchestrate post‑purchase journeys that lift repeat sales. Real‑time sync kept channels accurate.",
    challenge: "Inventory updates lagged between commerce and email platforms. Customers received irrelevant messages, and stock mismatches created poor experiences.",
    solution: "Real‑time inventory synchronization with triggered post‑purchase flows and targeted offers. Added alerting for low-stock items and a dashboard for merchandising decisions.",
    results: [
      { label: "Revenue lift", value: "+30%" },
      { label: "Repeat purchase rate", value: "+22%" },
      { label: "Stockout incidents", value: "-47%" }
    ],
    stack: ["Next.js", "n8n", "Shopify", "Klaviyo"],
    useCaseAnchor: "sales"
  }
]
