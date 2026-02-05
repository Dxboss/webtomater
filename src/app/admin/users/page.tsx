"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Users, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSyncProfiles = async () => {
    setLoading(true)
    setMessage(null)

    try {
      // 1. Call the server-side API to list all auth users (Admin only)
      // Note: Since we can't list all auth users from client-side without service role key,
      // we'll create a simple function to fix the specific issue of "current user missing profile".
      // But better yet, we can ask the admin to input the email of the missing user.
      
      // However, a more robust way for YOU (the admin) right now is to manually add them via this form.
      // This is a "Backfill Tool".
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // This is just a placeholder for the real action. 
      // Since client-side can't read 'auth.users', we will provide a manual entry form.
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const [manualEmail, setManualEmail] = useState("")
  const [manualName, setManualName] = useState("")

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // We can't create a profile if we don't know the ID.
      // BUT, we can try to "sign up" them again which might fail if they exist, 
      // or we can use an RPC function if you have one.
      
      // Actually, the best way to fix "missing profile" without backend access 
      // is to ask the USER to log in. But if you want to fix it for them:
      
      // We will try to fetch their ID via an Edge Function if available, 
      // or we can simply provide a button to "Fix My Own Profile" if the Admin is the one missing it?
      // No, the Admin can see clients.
      
      // Let's create a specialized API route for this.
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: manualEmail, name: manualName, action: 'sync_profile' })
      })
      
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Failed to sync')
      
      setMessage({ type: 'success', text: `Successfully synced profile for ${manualEmail}` })
      setManualEmail("")
      setManualName("")
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1">Fix missing client profiles and manage access.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          Sync Missing Profile
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          If a client signed up but doesn't appear in the "Clients" list, enter their email below to force-create their profile entry.
        </p>

        <form onSubmit={handleManualAdd} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Client Email</label>
            <input 
              type="email" 
              required
              value={manualEmail}
              onChange={e => setManualEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none"
              placeholder="client@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Full Name (Optional)</label>
            <input 
              type="text" 
              value={manualName}
              onChange={e => setManualName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none"
              placeholder="John Doe"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : "Sync / Create Profile"}
          </Button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}