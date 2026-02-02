"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, User, Menu, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If on login page
      if (pathname === "/portal/login") {
        if (session) {
          // If already logged in, redirect to portal
          router.push("/portal")
        } else {
          setLoading(false)
        }
        return
      }

      // If not on login page
      if (!session) {
        router.push("/portal/login")
        return
      }
      
      // Session exists
      setUser(session.user)
      
      // Check if user is trying to access portal but is actually an admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role === 'admin' || session.user.email === 'davidgeorge2152.dg@gmail.com') {
        setIsAdmin(true)
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  if (pathname === "/portal/login") {
    return <>{children}</>
  }

  if (loading) return null

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/portal/login")
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
            <span>{sidebarOpen ? "Close Menu" : "Portal Menu"}</span>
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
        w-64 bg-white border-r border-gray-200 fixed h-[calc(100%-112px)] top-[112px] z-50 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex md:h-screen md:top-0
      `}>
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <Link href="/" className="font-display font-bold text-xl tracking-tight">
            WebAutomate
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-0">
          <Link 
            href="/portal" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/portal" 
                ? "bg-accent/10 text-accent" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/portal/projects" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname.includes("/portal/projects") 
                ? "bg-accent/10 text-accent" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            My Projects
          </Link>
          <Link 
            href="/portal/documents" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/portal/documents"
                ? "bg-accent/10 text-accent"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FileText className="w-5 h-5" />
            Documents
          </Link>
          <Link 
            href="/portal/settings" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/portal/settings"
                ? "bg-accent/10 text-accent"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <User className="w-5 h-5 text-gray-400" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-gray-900 truncate">{user?.user_metadata?.full_name || 'User'}</span>
              <span className="text-xs text-gray-500 truncate">{user?.email}</span>
            </div>
          </div>
          {isAdmin && (
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-colors mb-2"
            >
               Switch to Admin
            </Link>
          )}
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
