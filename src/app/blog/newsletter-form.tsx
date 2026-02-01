"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Loader2, CheckCircle2 } from "lucide-react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])

      if (dbError) {
        if (dbError.code === '23505') { // Unique violation code
          throw new Error("You are already subscribed!")
        }
        throw dbError
      }

      setSuccess(true)
      setEmail("")
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm">Subscribed!</p>
          <p className="text-xs mt-1">Thank you for joining our newsletter.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address" 
        required
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-accent outline-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-accent text-white py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors disabled:opacity-70 flex items-center justify-center"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
      </button>
    </form>
  )
}
