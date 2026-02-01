import { notFound } from "next/navigation"
import { caseStudies } from "@/data/case-studies"
import { Section } from "@/components/ui/Section"
import { Container } from "@/components/ui/Container"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Props = { params: Promise<{ slug: string }> }

export default async function CaseStudyDetail(props: Props) {
  const params = await props.params
  const normalize = (s: string) => {
    const d = decodeURIComponent(s)
    const lower = d.toLowerCase().replace(/\/+$/g, "")
    return lower.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  }
  const slug = normalize(params.slug)
  const map = new Map(caseStudies.map((c) => [normalize(c.slug), c]))
  const cs = map.get(slug)
  
  if (!cs) return notFound()

  return (
    <div className="flex flex-col">
      <Section className="pt-24 pb-12 border-b border-border bg-secondary/30">
        <Container>
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm font-mono uppercase text-accent hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Case Studies
              </Link>
            </div>
            {cs ? (
              <>
                <div className="text-xs font-mono uppercase text-muted-foreground">{cs.industry}</div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{cs.title}</h1>
                <p className="text-muted-foreground">{cs.client}</p>
                <p className="text-foreground/80 mt-4">{cs.summary}</p>
              </>
            ) : (
              <>
                <div className="text-xs font-mono uppercase text-muted-foreground">Case Study</div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Case study unavailable</h1>
                <p className="text-muted-foreground">The requested case study could not be found.</p>
              </>
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            {cs && (
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                {cs.results.map((r) => (
                  <div key={r.label} className="p-6 border border-border bg-white">
                    <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">{r.label}</div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-foreground">{r.value}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Challenge</h2>
                <p className="text-muted-foreground">{cs ? cs.challenge : "No details available for this case."}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Solution</h2>
                <p className="text-muted-foreground">{cs ? cs.solution : "No solution documented for this case."}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Outcomes</h2>
                {cs ? (
                  <ul className="space-y-2">
                    {cs.results.map((r) => (
                      <li key={r.label} className="flex items-center justify-between border-b border-border py-2">
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-mono font-bold">{r.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No outcomes documented.</p>
                )}
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Stack</h3>
                {cs ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cs.stack.map((t) => (
                      <span key={t} className="px-3 py-1 border border-border bg-white text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No stack documented.</p>
                )}
              </div>
              <div className="border-t border-border pt-6">
                {cs && (
                  <Link href={`/automation-use-cases#${cs.useCaseAnchor}`} className="text-accent underline-offset-4 hover:underline">
                    See related use case &rarr;
                  </Link>
                )}
              </div>
              <div className="border-t border-border pt-6">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm font-mono uppercase hover:bg-accent hover:text-white">
                  Book a free audit
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
//

export async function generateMetadata(props: Props) {
  const params = await props.params
  const normalize = (s: string) => {
    const d = decodeURIComponent(s)
    const lower = d.toLowerCase().replace(/\/+$/g, "")
    return lower.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  }
  const slug = normalize(params.slug)
  const map = new Map(caseStudies.map((c) => [normalize(c.slug), c]))
  const cs = map.get(slug)
  if (!cs) return {}
  return {
    title: `${cs.title} — Case Study`,
    description: cs.summary,
  }
}

export function generateStaticParams() {
  const normalize = (s: string) => {
    const d = decodeURIComponent(s)
    const lower = d.toLowerCase().replace(/\/+$/g, "")
    return lower.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  }
  return caseStudies.map((c) => ({ slug: normalize(c.slug) }))
}
