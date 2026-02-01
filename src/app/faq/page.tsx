"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, Search, MessageCircle } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Container } from "@/components/ui/Container"
import { ParallaxTitle } from "@/components/effects/ParallaxTitle"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

const FAQS = [
  {
    category: "General",
    questions: [
      {
        q: "What exactly is 'Revenue Engineering'?",
        a: "Revenue Engineering is our systematic approach to building digital systems. Unlike traditional agencies that just 'build websites', we architect platforms specifically designed to capture leads, automate follow-ups, and process payments without manual intervention."
      },
      {
        q: "Do you work with small businesses?",
        a: "Yes, but we are best fit for businesses that are already generating revenue and are feeling the pain of manual processes. Our typical clients are scaling agencies, logistics companies, and e-commerce brands."
      },
      {
        q: "How long does a typical project take?",
        a: "Our 'Audit-to-Launch' cycle is typically 4-6 weeks. We work in rapid sprints: Week 1 is Audit/Strategy, Weeks 2-4 are Build/Integration, and Week 5 is Testing/Launch."
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "Will this replace my current employees?",
        a: "No. Automation replaces *tasks*, not people. It frees your team from data entry and copy-pasting so they can focus on high-value work like strategy, sales closing, and customer relationships."
      },
      {
        q: "Do I need to pay monthly for the software?",
        a: "We build on top of industry-standard tools (like Supabase, Next.js, Resend). While we don't charge a monthly platform fee, you will own your own accounts for these services. Typical infrastructure costs are very low ($0-$50/mo) compared to enterprise software."
      },
      {
        q: "Is my data secure?",
        a: "Absolutely. We use enterprise-grade security standards. We implement Row Level Security (RLS) in databases, encrypted API keys, and we never sell or share your proprietary data. You own 100% of your system."
      }
    ]
  },
  {
    category: "Process",
    questions: [
      {
        q: "What happens after the project is done?",
        a: "We provide a 30-day hyper-care period where we fix any bugs instantly. After that, we offer optional retainer packages for ongoing optimization, or we can hand off the keys entirely to your internal team."
      },
      {
        q: "How do we get started?",
        a: "It starts with a Discovery Audit. We look at your current workflow, identify the bottlenecks, and calculate your potential ROI. You can book this directly through our site."
      }
    ]
  }
]

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("General")
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = FAQS.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

  return (
    <div className="min-h-screen bg-white">
      <Section className="pt-32 pb-16 bg-gray-50 border-b border-gray-200">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-mono text-accent text-sm tracking-widest uppercase block mb-6">
              // Knowledge Base
            </span>
            <ParallaxTitle strength={12}>
              <h1 className="text-display text-4xl md:text-7xl font-bold uppercase leading-[0.9] mb-8">
                Common <br /> Questions
              </h1>
            </ParallaxTitle>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto mt-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Sidebar Tabs (only show if not searching) */}
            {!searchQuery && (
              <div className="lg:col-span-3 space-y-2">
                {FAQS.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => {
                      setActiveTab(cat.category)
                      setOpenIndex(null)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all ${
                      activeTab === cat.category
                        ? "bg-accent text-white shadow-lg shadow-accent/25"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            )}

            {/* Questions */}
            <div className={`${searchQuery ? 'lg:col-span-12' : 'lg:col-span-9'}`}>
              <div className="space-y-4">
                {filteredFaqs
                  .filter(cat => searchQuery || cat.category === activeTab)
                  .map((cat, catIdx) => (
                    <div key={cat.category} className="mb-12 last:mb-0">
                      {searchQuery && (
                        <h3 className="text-xl font-display font-bold mb-6 text-gray-400">
                          {cat.category}
                        </h3>
                      )}
                      <div className="space-y-4">
                        {cat.questions.map((faq, idx) => {
                          const isOpen = openIndex === (catIdx * 100 + idx)
                          return (
                            <div 
                              key={idx}
                              className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${
                                isOpen ? 'bg-gray-50 border-gray-300' : 'bg-white hover:border-accent/50'
                              }`}
                            >
                              <button
                                onClick={() => setOpenIndex(isOpen ? null : (catIdx * 100 + idx))}
                                className="w-full flex items-center justify-between p-6 text-left"
                              >
                                <span className="font-display font-bold text-lg pr-8">
                                  {faq.q}
                                </span>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-colors ${
                                  isOpen ? 'bg-accent border-accent text-white' : 'bg-white'
                                }`}>
                                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                              </button>
                              
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                  >
                                    <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100/0">
                                      {faq.a}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  
                {filteredFaqs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No results found for "{searchQuery}"</p>
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section className="py-24 bg-foreground text-background">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
            <div>
              <h2 className="text-display text-3xl md:text-4xl font-bold uppercase mb-4">
                Still have questions?
              </h2>
              <p className="text-gray-400 text-lg font-light">
                Can't find the answer you're looking for? Chat with our team.
              </p>
            </div>
            <Link href="/contact">
              <Button size="lg" className="h-16 px-8 text-lg bg-accent text-white hover:bg-white hover:text-foreground">
                <MessageCircle className="mr-2 w-5 h-5" />
                Contact Support
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  )
}
