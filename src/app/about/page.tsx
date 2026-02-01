import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Badge } from "@/components/ui/Badge"
import { CheckCircle2, Zap, Shield, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section className="bg-secondary/30 pt-24 md:pt-32 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 blur-[120px] pointer-events-none" />
        <Container>
          <div className="max-w-4xl relative z-10">
            <Badge variant="outline" className="mb-6 bg-background/50 backdrop-blur-sm border-accent/20 text-accent">
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground mb-8 leading-tight">
              We build the engines that <br />
              <span className="text-accent">power modern business.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Web Automate is a design-led automation studio. We replace chaos with code, manual work with systems, and guesswork with predictable revenue.
            </p>
          </div>
        </Container>
      </Section>

      {/* Mission Section */}
      <Section className="py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/10 rounded-3xl transform -rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600" 
                alt="Team working together" 
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl font-display font-bold text-foreground">
                Founded on the belief that technology should liberate, not complicate.
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  We noticed a pattern: ambitious founders were getting stuck in the weeds of operations. Instead of closing deals and building products, they were copying data between spreadsheets.
                </p>
                <p>
                  We built Web Automate to fix this. We combine senior-level design expertise with deep technical engineering to build "Revenue Engines"—custom systems that run your business on autopilot.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-bold text-foreground">50+</h3>
                  <p className="text-sm text-muted-foreground">Projects Delivered</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-bold text-foreground">10k+</h3>
                  <p className="text-sm text-muted-foreground">Hours Saved</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values Section */}
      <Section className="bg-secondary/20 py-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Why we are different</h2>
            <p className="text-muted-foreground">
              Most agencies just build websites. We build operating systems. Here is our philosophy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Speed as a Feature",
                description: "We don't do 6-month consulting gigs. We ship working systems in weeks, not months."
              },
              {
                icon: Shield,
                title: "Reliability First",
                description: "Our automations handle millions of dollars. We build with redundancy, error handling, and security at the core."
              },
              {
                icon: Users,
                title: "Human-Centric",
                description: "Automation isn't about replacing people. It's about removing the robot work so your humans can be human."
              }
            ].map((value, i) => (
              <div key={i} className="bg-background p-8 rounded-2xl shadow-sm border border-border/50 hover:border-accent/50 transition-colors">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-6">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-24">
        <Container>
          <div className="bg-foreground text-background rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-accent/10 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Ready to stop playing catch-up?
              </h2>
              <p className="text-lg text-gray-300 mb-10">
                Join the forward-thinking companies running on Web Automate. Let's build your revenue engine today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-accent text-white hover:bg-accent/90 w-full sm:w-auto">
                    Start Your Project
                  </Button>
                </Link>
                <Link href="/audit">
                  <Button size="lg" variant="outline" className="text-foreground border-white/20 bg-white hover:bg-white/10 w-full sm:w-auto">
                    Get Free Audit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
