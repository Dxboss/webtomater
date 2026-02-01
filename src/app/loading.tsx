import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Section className="py-24 md:py-32 flex-1">
        <Container>
          <div className="space-y-8 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-12 bg-muted rounded w-2/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
