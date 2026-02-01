export interface Project {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'on_hold'
  client_email: string
  user_id: string
  start_date: string
  deadline: string | null
  budget: number | null
  created_at: string
  updated_at: string
}

export interface ProjectFile {
  id: string
  project_id: string
  file_name: string
  file_url: string
  file_type: string
  uploaded_by: string
  created_at: string
}

export interface ProjectUpdate {
  id: string
  project_id: string
  title: string
  content: string
  type: 'milestone' | 'update' | 'issue' | 'review'
  created_at: string
}
