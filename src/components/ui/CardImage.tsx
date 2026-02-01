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
  const [src, setSrc] = useState(primarySrc)
  const [error, setError] = useState(false)

  if (error && !fallbackSrc) {
    return (
      <div className={cn("flex items-center justify-center bg-secondary text-muted-foreground", className)} {...props}>
        No image
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      <Image
        src={error && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  )
}
