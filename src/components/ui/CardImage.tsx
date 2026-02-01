"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  primarySrc: string
  fallbackSrc?: string | null
  alt: string
}

export function CardImage({ primarySrc, fallbackSrc, alt, className, ...props }: CardImageProps) {
  // Use fallback immediately if primarySrc is empty
  const [src, setSrc] = useState(primarySrc || fallbackSrc || "")
  const [error, setError] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  // If initial src is empty, try to switch to fallback
  if (!src && fallbackSrc && src !== fallbackSrc) {
    setSrc(fallbackSrc)
  }

  const currentSrc = error && fallbackSrc ? fallbackSrc : src

  if (!currentSrc) {
    return (
      <div className={cn("flex items-center justify-center bg-secondary text-muted-foreground w-full h-full", className)} {...props}>
        <span className="text-sm">No preview</span>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden bg-secondary/50", className)} {...props}>
      <Image
        src={currentSrc}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          hasLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setHasLoaded(true)}
        onError={() => {
          if (!error && fallbackSrc && src !== fallbackSrc) {
            setError(true)
            setSrc(fallbackSrc)
          } else {
            setError(true)
          }
        }}
      />
    </div>
  )
}
