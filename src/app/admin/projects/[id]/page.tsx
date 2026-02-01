"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Project, ProjectFile, ProjectUpdate } from "@/types/project"
import { Button } from "@/components/ui/Button"
import { Loader2, ArrowLeft, Upload, Send, Trash2, FileText, Download } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/Badge"

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [newUpdate, setNewUpdate] = useState({ title: "", content: "", type: "update" })
  const [isUploading, setIsUploading] = useState(false)
  const [isPosting, setIsPosting] = useState(false)

  useEffect(() => {
    fetchProjectData()
  }, [id])

  const fetchProjectData = async () => {
    // Fetch project
    const { data: projectData } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectData) {
      setProject(projectData)

      // Fetch files
      const { data: filesData } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })

      if (filesData) setFiles(filesData)

      // Fetch updates
      const { data: updatesData } = await supabase
        .from('project_updates')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })

      if (updatesData) setUpdates(updatesData)
    }
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setIsUploading(true)

    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `projects/${id}/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('project-files') // You might need to create this bucket
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath)

      const { error: dbError } = await supabase
        .from('project_files')
        .insert([{
          project_id: id,
          file_name: file.name,
          file_url: data.publicUrl,
          file_type: file.type,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        }])

      if (dbError) throw dbError
      
      fetchProjectData() // Refresh
    } catch (error: any) {
      alert('Error uploading file: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPosting(true)

    try {
      const { error } = await supabase
        .from('project_updates')
        .insert([{
          project_id: id,
          ...newUpdate
        }])

      if (error) throw error

      // Send email notification
      await fetch('/api/email/project-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: project.client_email,
          projectTitle: project.title,
          updateTitle: newUpdate.title,
          updateContent: newUpdate.content,
          type: newUpdate.type
        })
      })

      setNewUpdate({ title: "", content: "", type: "update" })
      fetchProjectData() // Refresh
    } catch (error: any) {
      alert('Error posting update: ' + error.message)
    } finally {
      setIsPosting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-500 mt-1">{project.client_email}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Badge>{project.status.replace('_', ' ')}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Updates & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-6">Post Update</h2>
            <form onSubmit={handlePostUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Update Title"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none"
                  required
                />
                <select
                  value={newUpdate.type}
                  onChange={(e) => setNewUpdate({...newUpdate, type: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none bg-white"
                >
                  <option value="update">General Update</option>
                  <option value="milestone">Milestone</option>
                  <option value="issue">Issue/Blocker</option>
                  <option value="review">Needs Review</option>
                </select>
              </div>
              <textarea
                placeholder="What's the latest progress?"
                value={newUpdate.content}
                onChange={(e) => setNewUpdate({...newUpdate, content: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none resize-none"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isPosting}>
                  {isPosting ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4 mr-2" />}
                  Post Update
                </Button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold">Project History</h2>
            {updates.map((update) => (
              <div key={update.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{update.title}</h3>
                    <Badge variant="outline">{update.type}</Badge>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(update.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-gray-600">{update.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Details & Files */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Project Files</h2>
            <div className="space-y-4 mb-6">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-sm font-medium truncate">{file.file_name}</span>
                  </div>
                  <a href={file.file_url} download target="_blank">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button variant="outline" className="w-full" disabled={isUploading}>
                {isUploading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload File
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Details</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">Budget</dt>
                <dd className="font-medium">${project.budget?.toLocaleString() || '0'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Start Date</dt>
                <dd className="font-medium">{format(new Date(project.start_date), 'MMM d, yyyy')}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Deadline</dt>
                <dd className="font-medium">{project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'No deadline'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
