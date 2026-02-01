import React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
}

export function Section({ as: Component = "section", className, children, ...props }: SectionProps) {
  return (
    <Component className={cn("py-16 md:py-24", className)} {...props}>
      {children}
    </Component>
  )
}
