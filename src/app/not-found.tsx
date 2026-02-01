import Link from "next/link"
import { buttonVariants } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"

export default function NotFound() {
  return (
    <Section className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <Container>
        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Page not found</h2>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/" className={buttonVariants()}>
            Go back home
          </Link>
        </div>
      </Container>
    </Section>
  )
}
