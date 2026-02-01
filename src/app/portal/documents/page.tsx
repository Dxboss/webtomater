"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ProjectFile } from "@/types/project"
import { Card, CardContent } from "@/components/ui/Card"
import { FileText, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { format } from "date-fns"

export default function DocumentsPage() {
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchFiles = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get all projects for this user first
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id)

      if (projects && projects.length > 0) {
        const projectIds = projects.map(p => p.id)
        
        // Get all files for these projects
        const { data: filesData } = await supabase
          .from('project_files')
          .select('*, projects(title)')
          .in('project_id', projectIds)
          .order('created_at', { ascending: false })

        if (filesData) setFiles(filesData)
      }
      setLoading(false)
    }
    fetchFiles()
  }, [])

  const filteredFiles = files.filter(file => 
    file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 mt-1">Access and download your project files</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-accent outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No documents found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredFiles.map((file: any) => (
              <div key={file.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 text-gray-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{file.file_name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{file.projects?.title}</span>
                      <span>•</span>
                      <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                    </p>
                  </div>
                </div>
                <a href={file.file_url} download target="_blank">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-accent">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
