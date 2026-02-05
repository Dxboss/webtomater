"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Project, ProjectFile, ProjectUpdate } from "@/types/project"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Calendar, DollarSign, Clock, CheckCircle, AlertCircle, Circle, PauseCircle, FileText, Download, MessageSquare } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { PaystackButton } from 'react-paystack'

const statusConfig = {
  pending: { label: 'Pending', icon: Circle, color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'bg-blue-100 text-blue-800' },
  review: { label: 'Under Review', icon: AlertCircle, color: 'bg-orange-100 text-orange-800' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  on_hold: { label: 'On Hold', icon: PauseCircle, color: 'bg-gray-100 text-gray-800' }
}

const updateTypeConfig = {
  milestone: { label: 'Milestone', color: 'bg-purple-100 text-purple-800' },
  update: { label: 'Update', color: 'bg-blue-100 text-blue-800' },
  issue: { label: 'Issue', color: 'bg-red-100 text-red-800' },
  review: { label: 'Review', color: 'bg-orange-100 text-orange-800' }
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setUserEmail(user.email)
    }
    getUser()
    fetchProjectData()
  }, [id])

  const fetchProjectData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      // Fetch project by client_email
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('client_email', user.email) // CHANGED: user_id -> client_email
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
    }

    setLoading(false)
  }

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: userEmail,
    amount: (project?.budget || 0) * 100, // Paystack is in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const handlePaystackSuccess = (reference: any) => {
    // Save payment to DB
    alert("Payment successful! Reference: " + reference.reference);
  };

  const handlePaystackClose = () => {
    console.log('Payment closed');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project) {
    return <div>Project not found</div>
  }

  const status = statusConfig[project.status]
  const StatusIcon = status.icon

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portal">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-500 mt-1">{project.description}</p>
          </div>
        </div>
        <Badge className={status.color}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Start Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {format(new Date(project.start_date), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>

        {project.deadline && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Deadline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {format(new Date(project.deadline), 'MMM d, yyyy')}
              </div>
            </CardContent>
          </Card>
        )}

        {project.budget && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ${project.budget.toLocaleString()}
                </div>
                {project.status !== 'completed' && (
                  <PaystackButton 
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    {...paystackConfig}
                    text="Pay Now"
                    onSuccess={handlePaystackSuccess}
                    onClose={handlePaystackClose}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Project Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Project Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No updates yet. Check back soon for progress updates.</p>
          ) : (
            <div className="space-y-6">
              {updates.map((update) => {
                const typeConfig = updateTypeConfig[update.type]
                return (
                  <div key={update.id} className="border-l-4 border-accent pl-6 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{update.title}</h3>
                      <Badge className={typeConfig.color}>
                        {typeConfig.label}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{update.content}</p>
                    <div className="text-sm text-gray-500">
                      {format(new Date(update.created_at), 'MMM d, yyyy at h:mm a')}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Files */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Project Files</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No files uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{file.file_name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(file.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={file.file_url} download={file.file_name}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="bg-accent/5">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Need to discuss something?</h3>
              <p className="text-gray-600">Have questions or need to request changes? We're here to help.</p>
            </div>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
