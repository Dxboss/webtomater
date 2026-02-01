"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Search, BarChart3, Users, RefreshCw } from "lucide-react"
import { format } from "date-fns"

interface Audit {
  id: string
  team_size: number
  tech_stack: string[]
  manual_hours: number
  integration_level: string
  score: number
  answers: any
  created_at: string
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAudits()
  }, [])

  const fetchAudits = async () => {
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setAudits(data)
    setLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Audit Results</h1>
        <p className="text-gray-500 mt-1">Review system health scores from potential clients</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : audits.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No audits submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider">Team Size</th>
                  <th className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider">Tech Stack</th>
                  <th className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider">Manual Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {audits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(audit.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${getScoreColor(audit.score)}`}>
                        {audit.score}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {audit.team_size}+ Employees
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {audit.tech_stack?.map((tech: string) => (
                          <span key={tech} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 border border-gray-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {Math.abs(audit.manual_hours)} hrs/week
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
