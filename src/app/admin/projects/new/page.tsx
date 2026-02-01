"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_email: "",
    status: "pending",
    start_date: new Date().toISOString().split('T')[0],
    deadline: "",
    budget: "",
  })
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Find the client's user ID via our admin API
      let userId = null;
      
      const response = await fetch(`/api/admin/users?q=${encodeURIComponent(formData.client_email)}`);
      if (response.ok) {
        const data = await response.json();
        // Exact match check
        const user = data.users.find((u: any) => u.email.toLowerCase() === formData.client_email.toLowerCase());
        if (user) {
          userId = user.id;
        }
      }

      if (!userId) {
        if (!confirm("Client user not found. They won't be able to see this project until they sign up with this email. Continue?")) {
          setLoading(false);
          return;
        }
      }
      
      const { error } = await supabase.from('projects').insert([{
        ...formData,
        user_id: userId,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        deadline: formData.deadline || null
      }])

      if (error) throw error

      router.push('/admin/projects')
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">New Project</h1>
          <p className="text-gray-500 mt-1">Initialize a new client engagement</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Project Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent outline-none"
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Client Email</label>
            <input
              type="email"
              required
              value={formData.client_email}
              onChange={(e) => setFormData({...formData, client_email: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent outline-none"
              placeholder="client@company.com"
            />
            <p className="text-xs text-gray-500">
              The client will use this email to access their portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent outline-none"
                placeholder="5000"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent outline-none bg-white"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent outline-none resize-none"
              placeholder="Project scope and details..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Create Project</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
