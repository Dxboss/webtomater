"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { BlogPost } from "@/types/blog"
import { Project } from "@/types/project"
import { Button } from "@/components/ui/Button"
import { Plus, Edit, Trash2, ExternalLink, FileText, Briefcase, Users, BarChart3, TrendingUp, ArrowUpRight, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/Badge"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    leads: 0,
    clients: 0,
    posts: 0,
    revenue: 0
  })
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    // Parallel fetching for speed
    const [
      { count: projectsCount, data: projects },
      { count: leadsCount },
      { count: postsCount },
      { data: allProjects },
      { count: clientsCount }
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact' }).limit(5).order('created_at', { ascending: false }),
      supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('budget'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
    ])

    const totalRevenue = allProjects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0

    setStats({
      projects: projectsCount || 0,
      leads: leadsCount || 0,
      clients: clientsCount || 0,
      posts: postsCount || 0,
      revenue: totalRevenue
    })

    if (projects) setRecentProjects(projects)
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your business performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Projects", value: stats.projects, icon: Briefcase, color: "bg-blue-50 text-blue-600", link: "/admin/projects" },
          { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "bg-green-50 text-green-600", link: "/admin/audits" },
          { label: "Total Leads", value: stats.leads, icon: Users, color: "bg-purple-50 text-purple-600", link: "/admin/leads" },
          { label: "Clients", value: stats.clients, icon: Users, color: "bg-indigo-50 text-indigo-600", link: "/admin/clients" },
          { label: "Published Posts", value: stats.posts, icon: FileText, color: "bg-orange-50 text-orange-600", link: "/admin/posts" },
        ].map((stat, i) => (
          <Link key={i} href={stat.link} className="block group">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-accent/20">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
            <Link href="/admin/projects" className="text-sm text-accent hover:underline flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {recentProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No projects yet.</div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-500 group-hover:border-accent group-hover:text-accent transition-colors">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{project.title}</h4>
                      <p className="text-xs text-gray-500">{project.client_email}</p>
                    </div>
                  </div>
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/projects/new" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center border border-transparent hover:border-gray-200 group">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-medium text-gray-900 block">New Project</span>
            </Link>
            <Link href="/admin/posts/new" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center border border-transparent hover:border-gray-200 group">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Edit className="w-6 h-6" />
              </div>
              <span className="font-medium text-gray-900 block">Write Post</span>
            </Link>
            <Link href="/admin/leads" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center border border-transparent hover:border-gray-200 group">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-medium text-gray-900 block">View Leads</span>
            </Link>
            <Link href="/admin/audits" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center border border-transparent hover:border-gray-200 group">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="font-medium text-gray-900 block">Check Audits</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

