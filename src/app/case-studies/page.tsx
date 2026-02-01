import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import Link from "next/link"
import { caseStudies } from "@/data/case-studies"

export default function CaseStudiesPage() {
  return (
    <div className="flex flex-col">
      <Section className="bg-secondary/30 pt-16 md:pt-24 lg:pt-32 pb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">Case Studies</h1>
            <p className="text-xl text-muted-foreground">
              See how we've helped other businesses save time and grow revenue.
            </p>
          </div>
        </Container>
      </Section>
      
      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <div key={cs.slug} className="rounded-lg border bg-white p-6 shadow-sm flex flex-col">
                <div className="text-xs font-mono uppercase text-muted-foreground mb-2">{cs.industry}</div>
                <h3 className="text-xl font-bold mb-1">{cs.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{cs.client}</p>
                <p className="text-muted-foreground mb-6">{cs.summary}</p>
                <div className="mt-auto flex items-center gap-6">
                  <Link href={`/case-studies/${cs.slug}`} className="text-accent font-medium underline-offset-4 hover:underline">Read case &rarr;</Link>
                  <Link href={`/automation-use-cases#${cs.useCaseAnchor}`} className="text-foreground/80 hover:text-foreground">Related use case &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  )
}
