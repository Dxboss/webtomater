"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"

export function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur lg:hidden">
      <div className="px-6 py-4">
        <Link
          href="/contact"
          className={cn(buttonVariants({ size: "lg" }), "w-full rounded-none bg-accent text-white hover:bg-accent/90")}
        >
          Book Free Audit
        </Link>
      </div>
    </div>
  )
}

