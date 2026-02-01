import { Section } from "@/components/ui/Section"
import { Container } from "@/components/ui/Container"
import Link from "next/link"
import { projects } from "@/data/projects"
import { CardImage } from "@/components/ui/CardImage"

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const html = await res.text()
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"'>]+)["'][^>]*>/i)
    const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"'>]+)["'][^>]*>/i)
    const src = ogMatch?.[1] || twMatch?.[1] || null
    if (!src) return null
    try {
      const u = new URL(src)
      return u.href
    } catch {
      try {
        const base = new URL(url)
        return new URL(src, base).href
      } catch {
        return null
      }
    }
  } catch {
    return null
  }
}

export default async function ProjectsPage() {
  return (
    <div className="flex flex-col">
      <Section className="bg-secondary/30 pt-16 md:pt-24 lg:pt-32 pb-16 border-b border-border">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">Projects</h1>
            <p className="text-xl text-muted-foreground">
              Selected web design, development, and systems projects.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {await Promise.all(projects.map(async (p) => {
              const og = p.url ? await fetchOgImage(p.url) : null
              const overrides: Record<string, string> = {
                "eunan-tech-training-institute": "/images/case-studies/eunan-tech.png",
                "sms-wine-nine": "/images/case-studies/sms-wine-nine.png",
                "tridah-media": "/images/case-studies/tridah-media.png",
              }
              const primary = overrides[p.slug] ?? p.image
              return (
                <div key={p.slug} className="rounded-lg border bg-white shadow-sm flex flex-col overflow-hidden">
                  <div className="h-40 border-b border-border bg-secondary/40">
                    {(primary || og) ? (
                      <CardImage primarySrc={primary} fallbackSrc={og} alt={p.title} className="w-full h-full" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">No preview</div>
                    )}
                  </div>
                <div className="p-6">
                <div className="text-xs font-mono uppercase text-muted-foreground mb-2">{p.role}</div>
                <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                <p className="text-muted-foreground mb-6">{p.summary}</p>
                <div className="mt-auto flex items-center gap-6">
                  {p.url && (
                    <Link href={p.url} className="text-accent font-medium underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                      Visit project ↗
                    </Link>
                  )}
                </div>
                </div>
                </div>
              )
            }))}
          </div>
        </Container>
      </Section>
    </div>
  )
}
