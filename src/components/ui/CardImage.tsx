"use client"

import * as React from "react"

interface CardImageProps {
  primarySrc?: string | null
  fallbackSrc?: string | null
  alt: string
  className?: string
}

export function CardImage({ primarySrc, fallbackSrc, alt, className = "" }: CardImageProps) {
  const [src, setSrc] = React.useState<string | undefined>(primarySrc || undefined)

  React.useEffect(() => {
    setSrc(primarySrc || undefined)
  }, [primarySrc])

  return (
    <img
      src={src || fallbackSrc || undefined}
      alt={alt}
      className={"object-cover " + className}
      onError={() => {
        if (fallbackSrc && src !== fallbackSrc) {
          setSrc(fallbackSrc)
        }
      }}
    />
  )
}

