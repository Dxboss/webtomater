"use client"

import Link from "next/link"
import { useRef } from "react"

interface MagneticCTAProps {
  href: string
  className?: string
  children: React.ReactNode
  prefetch?: boolean
}

export function MagneticCTA({ href, className = "", children, prefetch = false }: MagneticCTAProps) {
  const ref = useRef<HTMLAnchorElement | null>(null)

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`
  }

  function onMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = `translate(0px, 0px)`
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className + " will-change-transform transition-transform duration-200 ease-out"}
    >
      {children}
    </Link>
  )
}
