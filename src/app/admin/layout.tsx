"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, Briefcase, Users, BarChart3, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If on login page
      if (pathname === "/admin/login") {
        if (session) {
          // If already logged in, redirect to admin dashboard
          router.push("/admin")
        } else {
          setLoading(false)
        }
        return
      }

      // If not on login page
      if (!session) {
        router.push("/admin/login")
        return
      }

      if (session) {
        // Check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profile?.role === 'admin' || session.user.email === 'davidgeorge2152.dg@gmail.com') {
          // Allow access
          setLoading(false)
        } else {
          // If not admin, redirect to portal
          router.push('/portal')
        }
      }
    }

    checkAuth()
  }, [router, pathname])

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] flex flex-col bg-white border-b border-gray-200">
        {/* Top Row: Main Logo & Nav Icon (Placeholder if needed) */}
        <div className="flex justify-between items-center h-16 px-4 border-b border-gray-100">
          <Link href="/" className="font-display font-bold text-xl tracking-tight">
            WebAutomate
          </Link>
          {/* Main Nav Toggle (Placeholder to match main site) */}
          <div className="md:hidden">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Bottom Row: Sidebar Toggle */}
        <div className="flex items-center h-12 px-4 bg-gray-50/50">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span>{sidebarOpen ? "Close Menu" : "Admin Menu"}</span>
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-gray-200 fixed h-[calc(100%-112px)] top-[112px] z-50 flex flex-col transition-transform duration-300 overflow-y-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:sticky md:flex md:h-screen md:top-0
      `}>
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <Link href="/" className="font-display font-bold text-xl tracking-tight">
            WebAutomate
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-0">
          <Link 
            href="/admin" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/admin" 
                ? "bg-accent/10 text-accent" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/admin/projects" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname.includes("/admin/projects") 
                ? "bg-accent/10 text-accent" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Projects
          </Link>
          <Link 
            href="/admin/leads" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname.includes("/admin/leads") 
                ? "bg-accent/10 text-accent" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Users className="w-5 h-5" />
            Leads
          </Link>
          <Link 
            href="/admin/audits" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname.includes("/admin/audits") 
                ? "bg-accent/10 text-accent" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Audits
          </Link>
          <Link 
            href="/admin/subscribers" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname.includes("/admin/subscribers") 
                ? "bg-accent/10 text-accent" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Mail className="w-5 h-5" />
            Subscribers
          </Link>
          <Link 
            href="/admin/posts" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith("/admin/posts")
                ? "bg-accent/10 text-accent" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FileText className="w-5 h-5" />
            Blog Posts
          </Link>
          <Link 
            href="/admin/settings" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/admin/settings"
                ? "bg-accent/10 text-accent"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto p-4 md:p-8 pt-36 md:pt-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
