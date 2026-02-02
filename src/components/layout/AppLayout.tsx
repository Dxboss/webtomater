"use client"

import { usePathname } from "next/navigation"

interface AppLayoutProps {
  children: React.ReactNode
  navbar: React.ReactNode
  footer: React.ReactNode
  stickyCTA: React.ReactNode
}

export function AppLayout({ children, navbar, footer, stickyCTA }: AppLayoutProps) {
  const pathname = usePathname()
  
  // Only exclude layout for non-login admin/portal pages
  // Login pages (/admin/login, /portal/login) should show the standard navbar
  const isSpecialPage = 
    (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/login")) || 
    (pathname?.startsWith("/portal") && !pathname?.startsWith("/portal/login"))

  if (isSpecialPage) {
    return <>{children}</>
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col border-x border-border/40 max-w-[1920px] mx-auto shadow-2xl shadow-black/5">
        {navbar}
        <main className="flex-1">{children}</main>
        {footer}
      </div>
      {stickyCTA}
    </>
  )
}