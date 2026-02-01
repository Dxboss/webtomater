"use client"

import { motion } from "framer-motion"
import { ArrowRight, Check, Code2, Cpu, BarChart3, Globe, Database, Shield, Zap, Layers } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Container } from "@/components/ui/Container"
import { Button, buttonVariants } from "@/components/ui/Button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ParallaxTitle } from "@/components/effects/ParallaxTitle"

const services = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "We build pixel-perfect, high-performance websites that serve as your 24/7 sales engine.",
    icon: Code2,
    capabilities: [
      "Next.js & React Applications",
      "Headless CMS Integration",
      "3D & WebGL Experiences",
      "Performance Optimization",
      "SEO Technical Architecture",
      "Accessibility Compliance (WCAG)"
    ]
  },
  {
    id: "management-systems",
    title: "Management Systems",
    description: "Custom dashboards and internal tools that codify your processes and give teams control.",
    icon: Layers,
    capabilities: [
      "Admin dashboards & analytics",
      "Role-based access control",
      "Data modeling & migrations",
      "Workflow engines & queues",
      "Integrations with ERP/CRM",
      "Audit logs & monitoring"
    ]
  },
  {
    id: "automation",
    title: "Business Automation",
    description: "Eliminate manual busywork. We connect your tools to create seamless, automated workflows.",
    icon: Cpu,
    capabilities: [
      "CRM Integration & Sync",
      "Automated Email Sequences",
      "Project Management Workflows",
      "Data Entry Automation",
      "Custom API Integrations",
      "Webhook Orchestration"
    ]
  },
  {
    id: "revenue",
    title: "Revenue Systems",
    description: "End-to-end payment and sales infrastructure designed to maximize customer lifetime value.",
    icon: BarChart3,
    capabilities: [
      "Stripe/Payment Integration",
      "Subscription Management",
      "Dynamic Pricing Models",
      "Abandoned Cart Recovery",
      "Upsell/Cross-sell Logic",
      "Revenue Analytics Dashboards"
    ]
  }
]

const techStack = [
  { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind"] },
  { category: "Backend", items: ["Node.js", "Supabase", "PostgreSQL", "Edge Functions"] },
  { category: "Automation", items: ["Zapier", "Make (Integromat)", "n8n", "Custom Webhooks"] },
  { category: "CMS", items: ["Sanity", "Contentful", "Strapi", "Notion API"] }
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Header Section */}
      <Section className="pt-32 pb-16 border-b border-border">
        <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-mono text-accent text-sm tracking-widest uppercase block mb-6">
                // Capabilities
              </span>
              <ParallaxTitle strength={14}>
                <h1 className="text-display text-4xl md:text-8xl font-bold uppercase leading-[0.9] mb-8">
                  Technical <br />
                  Excellence
                </h1>
              </ParallaxTitle>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
                We combine elite engineering with strategic design to build systems that drive measurable business growth.
              </p>
            </motion.div>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-end">
            <div className="p-6 border border-border bg-secondary/20">
              <h3 className="font-mono uppercase text-sm font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Available for Q2 Projects
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our team is currently accepting new automation and development projects.
              </p>
              <Link href="/contact" className="text-sm font-mono uppercase underline hover:text-accent">
                Inquire now -&gt;
              </Link>
            </div>
          </div>
        </div>
        </Container>
      </Section>

      {/* Main Services Detail */}
      <div className="flex flex-col">
        {services.map((service, index) => (
          <Section key={service.id} id={service.id} className="py-0 border-b border-border">
            <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[60vh]">
              {/* Service Title & Icon */}
              <div className="lg:col-span-4 border-r border-border p-8 md:p-12 flex flex-col justify-between bg-secondary/10">
                <div>
                  <div className="w-12 h-12 border border-border flex items-center justify-center mb-8 bg-background">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-display text-3xl md:text-5xl font-bold uppercase mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <div className="font-mono text-9xl font-bold text-border/40 select-none mt-12 lg:mt-0">
                  0{index + 1}
                </div>
              </div>

              {/* Capabilities Grid */}
              <div className="lg:col-span-8 p-8 md:p-12 bg-background">
                <h3 className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-8">
                  // Core Capabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {service.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-3 group border-b border-border/50 pb-4 last:border-0 md:last:border-b">
                      <Check className="w-4 h-4 text-accent shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-lg font-medium group-hover:translate-x-2 transition-transform duration-300">
                        {cap}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-border flex justify-end">
                   <Link 
                     href="/contact" 
                     className={cn(buttonVariants({ variant: "outline" }), "rounded-none font-mono uppercase")}
                   >
                     Discuss {service.title} <ArrowRight className="ml-2 w-4 h-4" />
                   </Link>
                </div>
              </div>
            </div>
            </Container>
          </Section>
        ))}
      </div>

      {/* Technology Stack Matrix */}
      <Section className="py-24 border-b border-border bg-secondary/30">
        <Container>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-display text-4xl font-bold uppercase mb-4">
              Technology <br /> Stack
            </h2>
            <p className="text-muted-foreground">
              We choose tools that are scalable, secure, and widely supported.
            </p>
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {techStack.map((stack) => (
                <div key={stack.category} className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-accent border-b border-accent/20 pb-2">
                    {stack.category}
                  </h3>
                  <ul className="space-y-2">
                    {stack.items.map((item) => (
                      <li key={item} className="font-display text-lg font-medium">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="py-32 bg-foreground text-background">
        <Container>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-display text-6xl md:text-8xl font-bold uppercase mb-8">
            Stop Manual Work
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 font-light">
            Your competition is already automating. Don't get left behind.
          </p>
          <Link 
            href="/contact" 
            className="h-16 px-12 bg-accent text-white flex items-center justify-center text-xl font-mono uppercase hover:bg-white hover:text-foreground transition-all duration-300"
          >
            Start Your Transformation
          </Link>
        </div>
        </Container>
      </Section>
    </div>
  )
}
