"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ArrowUpRight, Code2, Cpu, BarChart3, CheckCircle2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/Button"
import { Section } from "@/components/ui/Section"
import { cn } from "@/lib/utils"
import { FluidBackground } from "@/components/effects/FluidBackground"
import { ParallaxTitle } from "@/components/effects/ParallaxTitle"
import { MagneticCTA } from "@/components/ui/MagneticCTA"
import { ROICalculator } from "@/components/ui/ROICalculator"

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="flex flex-col bg-grid-pattern">
      {/* Hero Section - Brutalist/Swiss Style */}
      <Section className="relative min-h-[90vh] flex flex-col justify-center border-b border-border overflow-hidden pt-0 pb-0">
        <FluidBackground />
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-[90vh]">
          
          {/* Left Column: Massive Typography */}
          <div className="lg:col-span-8 border-r border-border p-6 md:p-12 lg:p-20 flex flex-col justify-center relative bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-white mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">System Status: Online</span>
              </div>
              
              <ParallaxTitle strength={16}>
                <h1 className="text-display text-4xl md:text-8xl lg:text-[7rem] leading-[0.9] font-bold tracking-tighter text-foreground mb-8 drop-shadow-sm">
                  REVENUE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">ENGINEERING</span>
                </h1>
              </ParallaxTitle>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed mb-12 drop-shadow-sm">
                We build <span className="text-foreground font-medium">high-performance digital systems</span> that automate operations and scale revenue without headcount.
              </p>

              <div className="flex flex-wrap gap-6">
                <MagneticCTA 
                  href="/contact" 
                  prefetch={false}
                  className={cn(buttonVariants({ size: "lg" }), "h-14 px-10 rounded-none text-lg font-mono uppercase tracking-wider bg-accent hover:bg-accent/90 text-white")}
                >
                  Start Audit <ArrowUpRight className="ml-2 h-5 w-5" />
                </MagneticCTA>
                <MagneticCTA 
                  href="/services" 
                  prefetch={false}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-10 rounded-none text-lg font-mono uppercase tracking-wider border-foreground text-foreground hover:bg-foreground hover:text-background")}
                >
                  Explore System
                </MagneticCTA>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Technical Specs & Visuals */}
          <div className="lg:col-span-4 flex flex-col border-border">
            <div className="flex-1 border-b border-border p-8 flex flex-col justify-between bg-secondary/30">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                // System Architecture
              </div>
              <div className="space-y-4 mt-8">
                {[
                  { label: "Frontend", val: "Next.js 14 / React" },
                  { label: "Styling", val: "Tailwind / Motion" },
                  { label: "Backend", val: "Serverless / Edge" },
                  { label: "Database", val: "Supabase / PostgreSQL" }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="font-mono text-sm text-muted-foreground">{spec.label}</span>
                    <span className="font-mono text-sm font-bold text-foreground">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 p-8 bg-foreground text-background flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
              <h3 className="text-display text-4xl mb-4 relative z-10">
                20+ hrs
              </h3>
              <p className="font-mono text-sm text-gray-400 relative z-10">
                Average weekly time saved per client through custom automation workflows.
              </p>
              <Link href="/case-studies" aria-label="View case studies" className="absolute bottom-8 right-8">
                <ArrowRight className="h-8 w-8 text-accent group-hover:-rotate-45 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Services Section - "Magazine" Layout */}
      <Section id="services" className="border-b border-border py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 border-r border-border p-8 md:p-16 bg-white sticky top-20 h-fit">
            <span className="font-mono text-accent text-sm tracking-widest uppercase block mb-4">01 — Services</span>
            <h2 className="text-display text-3xl md:text-6xl font-bold mb-8">
              DESIGN <br />
              MEETS <br />
              LOGIC
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We don't just make things look good. We build systems that work. Our approach combines aesthetic precision with engineering rigor.
            </p>
          </div>
          
          <div className="lg:col-span-8">
            {[
              {
                title: "Website Development",
                desc: "High-performance Next.js websites designed to convert visitors into qualified leads. Fast, accessible, and SEO-optimized.",
                tags: ["Next.js", "React", "TypeScript", "CMS"],
                icon: Code2
              },
              {
                title: "Business Automation",
                desc: "Streamline operations with custom workflows connecting your CRM, email, and project tools. Remove manual data entry forever.",
                tags: ["Zapier", "Make", "n8n", "Webhooks"],
                icon: Cpu
              },
              {
                title: "Revenue Systems",
                desc: "End-to-end sales funnels and payment integrations that work while you sleep. Automated invoicing, follow-ups, and upsells.",
                tags: ["Stripe", "CRM", "Email Marketing"],
                icon: BarChart3
              }
            ].map((service, index) => (
              <div key={index} className="group border-b border-border last:border-b-0 p-8 md:p-16 hover:bg-secondary/50 transition-colors duration-500">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-16 h-16 bg-white border border-border flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
                    <service.icon className="h-8 w-8 text-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-display font-bold mb-4 flex items-center gap-4">
                      {service.title}
                      <ArrowUpRight className="h-6 w-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent" />
                    </h3>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                      {service.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 border border-border bg-white text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Process Section - Horizontal Timeline */}
      <Section className="py-24 md:py-32 border-b border-border overflow-hidden bg-accent/5">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <span className="font-mono text-accent text-sm tracking-widest uppercase block mb-4">02 — Process</span>
              <h2 className="text-display text-3xl md:text-6xl font-bold text-foreground">
                SYSTEMATIC <br /> GROWTH
              </h2>
            </div>
            <p className="max-w-md text-foreground/80 text-lg">
              We replace chaos with clarity using a proven three-step framework designed for speed and impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-border">
            {[
              {
                step: "01",
                title: "Audit",
                desc: "Deep dive into your current metrics, bottlenecks, and manual workflows."
              },
              {
                step: "02",
                title: "Build",
                desc: "Rapid development of your custom automation infrastructure and interface."
              },
              {
                step: "03",
                title: "Scale",
                desc: "Launch, monitor, and optimize for maximum revenue efficiency."
              }
            ].map((item, i) => (
              <div key={i} className="border-r border-y border-border p-8 md:p-12 bg-white transition-all duration-300 group relative transform hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-transparent hover:border-l-accent hover:border-accent">
                <span className="text-6xl font-display font-bold text-foreground/70 group-hover:text-accent transition-colors mb-8 block">
                  {item.step}
                </span>
                <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-4">
                  {item.title}
                </h3>
                <p className="text-foreground/80 group-hover:text-foreground font-mono text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ROI Calculator Section */}
      <Section className="py-24 bg-secondary/20">
        <div className="container px-6">
          <ROICalculator />
        </div>
      </Section>

      {/* CTA Section - Massive Type */}
      <Section className="py-0 bg-accent text-white">
        <div className="flex flex-col items-center justify-center text-center py-32 px-6 relative overflow-hidden">
          
          <h2 className="text-display text-4xl md:text-8xl lg:text-9xl font-bold mb-12 relative z-10 leading-[1]">
            READY TO <br />
            AUTOMATE?
          </h2>
          
          <MagneticCTA 
            href="/contact" 
            prefetch={false}
            className="group relative z-10 inline-flex items-center gap-4 text-xl md:text-2xl font-mono uppercase tracking-widest border-b-2 border-white pb-2 hover:text-black hover:border-black transition-colors"
          >
            Book Free Audit 
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </MagneticCTA>
        </div>
      </Section>
    </div>
  )
}
