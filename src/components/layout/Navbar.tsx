"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Services", href: "/services", number: "01" },
  { name: "Work", href: "/work", number: "02" },
  { name: "Use Cases", href: "/automation-use-cases", number: "03" },
  { name: "Blog", href: "/blog", number: "04" },
  { name: "About", href: "/about", number: "05" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header 
      className={cn(
        "sticky top-0 z-[70] w-full border-b border-border transition-colors duration-200",
        isOpen ? "bg-background" : "bg-background/95 backdrop-blur-sm"
      )}
    >
      <div className="flex h-20 items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="group flex items-center gap-2">
            <div className="h-8 w-8 bg-foreground text-background flex items-center justify-center font-bold text-lg font-display">
              W
            </div>
            <span className="font-display font-bold text-xl tracking-tight uppercase group-hover:text-accent transition-colors">
              Web Automate
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
              key={item.name}
              href={item.href}
                prefetch={false}
              className={cn(
                "group relative flex flex-col text-sm font-medium transition-colors hover:text-accent",
                pathname === item.href ? "text-accent" : "text-muted-foreground"
              )}
            >
              <span className="text-[10px] font-mono mb-1 text-muted-foreground/60 group-hover:text-accent/60">
                {item.number}
              </span>
              <span className="font-display uppercase tracking-wide text-base">
                {item.name}
              </span>
              <span className="absolute -bottom-8 left-0 h-[2px] w-full scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link 
            href="/contact" 
            prefetch={false} 
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-none font-mono text-xs uppercase tracking-wider bg-foreground text-background hover:bg-accent hover:text-white transition-all duration-300"
            )}
          >
            Start Project <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 5rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-20 left-0 right-0 z-[60] bg-background border-t border-border lg:hidden overflow-y-auto bottom-0"
          >
            <div className="flex flex-col p-6 space-y-6 min-h-full bg-background">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-start gap-4 group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xs font-mono text-accent pt-1">{item.number}</span>
                  <span className="text-4xl font-display uppercase font-bold text-foreground group-hover:text-accent transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
              <div className="mt-8 border-t border-border pt-8">
                <Link 
                  href="/contact" 
                  className={cn(
                    buttonVariants({ size: "lg" }), 
                    "w-full rounded-none font-mono uppercase bg-accent text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Start Project
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
