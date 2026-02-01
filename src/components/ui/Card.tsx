import { cn } from "@/lib/utils"

export interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps {
  className?: string
  children: React.ReactNode
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  )
}

export interface CardTitleProps {
  className?: string
  children: React.ReactNode
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  )
}

export interface CardContentProps {
  className?: string
  children: React.ReactNode
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>
}

export interface CardFooterProps {
  className?: string
  children: React.ReactNode
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}