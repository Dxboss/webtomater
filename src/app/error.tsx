"use client"

import { useEffect } from "react"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Button } from "@/components/ui/Button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Section className="py-32 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Container>
        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <Button onClick={() => reset()} size="lg">
          Try again
        </Button>
      </Container>
    </Section>
  )
}
