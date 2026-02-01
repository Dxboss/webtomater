import { Suspense } from "react"

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
      // relative path
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

export async function RemotePreviewImage({ url, alt, className = "" }: { url: string; alt: string; className?: string }) {
  const src = await fetchOgImage(url)
  if (!src) {
    return (
      <div className={"flex items-center justify-center bg-secondary/40 text-muted-foreground " + className}>
        No preview
      </div>
    )
  }
  return (
    <img src={src} alt={alt} className={"object-cover " + className} />
  )
}

export function RemotePreviewImageSuspense(props: Parameters<typeof RemotePreviewImage>[0]) {
  return (
    <Suspense fallback={<div className="w-full h-full bg-secondary/40" />}>
      <RemotePreviewImage {...props} />
    </Suspense>
  )
}
