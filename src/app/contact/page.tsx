"use client"

import { ContactForm } from "@/components/forms/ContactForm"
import { Section } from "@/components/ui/Section"
import { Mail, MapPin, Phone } from "lucide-react"
import { Container } from "@/components/ui/Container"

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Header */}
      <Section className="pt-32 pb-12 border-b border-border">
        <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <span className="font-mono text-accent text-sm tracking-widest uppercase block mb-6">
              // Contact
            </span>
            <h1 className="text-display text-4xl md:text-8xl font-bold uppercase leading-[0.9] mb-8">
              Start Your <br />
              Audit
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
              Ready to automate? Fill out the form below to book your free strategy session.
            </p>
          </div>
        </div>
        </Container>
      </Section>

      <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Contact Information Sidebar */}
        <div className="lg:col-span-4 border-r border-border p-8 md:p-12 bg-secondary/20">
          <div className="sticky top-32 space-y-12">
            <div>
              <h3 className="font-mono uppercase text-sm font-bold mb-6">Contact Info</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-accent mt-1" />
                  <div>
                    <span className="block font-bold text-lg">Email</span>
                    <a href="mailto:hello@webautomate.com" className="text-muted-foreground hover:text-foreground transition-colors">
                      hello@webautomate.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-accent mt-1" />
                  <div>
                    <span className="block font-bold text-lg">Phone</span>
                    <a href="tel:+15550000000" className="text-muted-foreground hover:text-foreground transition-colors">
                      +1 (555) 000-0000
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-accent mt-1" />
                  <div>
                    <span className="block font-bold text-lg">Office</span>
                    <p className="text-muted-foreground">
                      123 Automation Blvd<br />
                      Tech District, NY 10001
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-border bg-background">
              <h3 className="font-mono uppercase text-sm font-bold mb-4">Response Time</h3>
              <p className="text-sm text-muted-foreground">
                We typically respond to new inquiries within 24 business hours. For urgent matters, please call our office directly.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Area */}
        <div className="lg:col-span-8 p-8 md:p-20 bg-background">
          <div className="max-w-2xl">
            <ContactForm />
          </div>
        </div>
      </div>
      </Container>
    </div>
  )
}
