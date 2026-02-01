"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Project } from "@/types/project"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ArrowRight, BarChart3, Clock, FileText, LayoutDashboard, MessageSquare } from "lucide-react"
import { format } from "date-fns"

export default function PortalDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch projects for this user
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (data) setProjects(data)
      }
      setLoading(false)
    }
    getData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'pending')
  const completedProjects = projects.filter(p => p.status === 'completed')

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Link href="/portal/projects">
          <Button>
            View All Projects
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Active Projects</p>
              <h3 className="text-2xl font-bold text-blue-900">{activeProjects.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <h3 className="text-2xl font-bold text-green-900">{completedProjects.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Total Projects</p>
              <h3 className="text-2xl font-bold text-purple-900">{projects.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Projects</h2>
        {activeProjects.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <LayoutDashboard className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active projects</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                You don't have any projects in progress right now. Ready to start something new?
              </p>
              <Link href="/contact">
                <Button variant="outline">Request New Project</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeProjects.map((project) => (
              <Link key={project.id} href={`/portal/projects/${project.id}`} className="group">
                <Card className="h-full hover:shadow-md transition-shadow border-gray-200 group-hover:border-accent/50">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold group-hover:text-accent transition-colors">
                      {project.title}
                    </CardTitle>
                    <Badge variant={project.status === 'in_progress' ? 'default' : 'secondary'}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Started {format(new Date(project.start_date), 'MMM d, yyyy')}
                      </div>
                      <span className="flex items-center gap-1 font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { CheckCircle } from "lucide-react"
