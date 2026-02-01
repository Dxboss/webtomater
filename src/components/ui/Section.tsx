import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  spacing?: "none" | "sm" | "default" | "lg"
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, as: Component = "section", spacing = "default", ...props }, ref) => {
    const spacingStyles = {
      none: "",
      sm: "py-12 md:py-16",
      default: "py-16 md:py-24",
      lg: "py-24 md:py-32",
    }

    return (
      <Component
        ref={ref}
        className={cn(spacingStyles[spacing], className)}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

export { Section }
