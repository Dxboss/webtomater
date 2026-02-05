 "use client"
 
 import { useEffect, useState } from "react"
 import Link from "next/link"
 import { supabase } from "@/lib/supabase"
 import { Button } from "@/components/ui/Button"
 import { Badge } from "@/components/ui/Badge"
 import { Search, Mail, UserPlus, CheckCircle, XCircle } from "lucide-react"
 import { format } from "date-fns"
 
 interface ClientProfile {
   id: string
   email: string
   full_name?: string
   role?: string
   created_at?: string
 }
 
 interface SimpleProject {
   id: string
   title: string
   client_email?: string | null
 }
 
 export default function ClientsPage() {
   const [clients, setClients] = useState<ClientProfile[]>([])
   const [projects, setProjects] = useState<SimpleProject[]>([])
   const [loading, setLoading] = useState(true)
   const [search, setSearch] = useState("")
   const [attachBusy, setAttachBusy] = useState<string | null>(null) // client id
   const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
 
   useEffect(() => {
     fetchData()
   }, [])
 
   const fetchData = async () => {
     try {
       // Fetch from our new smart API that auto-syncs auth users
       const response = await fetch('/api/admin/clients')

       if (!response.ok) {
         // Fallback to direct query if API fails (though API is better)
         console.warn("API fetch failed, falling back to direct Supabase query")
         const { data, error } = await supabase
           .from("profiles")
           .select("id,email,full_name,role,created_at")
           .eq("role", "client")
           .order("created_at", { ascending: false })

         if (error) throw error
         if (data) setClients(data as ClientProfile[])
       } else {
         const data = await response.json()
         if (data.clients) setClients(data.clients)
       }

       const { data: projectsData, error: projectsError } = await supabase
         .from("projects")
         .select("id,title,client_email")
         .order("created_at", { ascending: false })

       if (projectsError) throw projectsError
       if (projectsData) setProjects(projectsData as SimpleProject[])
     } catch (error) {
       console.error("Error fetching data:", error)
     } finally {
       setLoading(false)
     }
   }
 
   const filtered = clients.filter((c) =>
     [c.email, c.full_name].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase())
   )
 
   const attachClientToProject = async (client: ClientProfile) => {
     if (!selectedProjectId) {
       alert("Please select a project")
       return
     }
     setAttachBusy(client.id)
     const { error } = await supabase
       .from("projects")
       .update({ client_email: client.email })
       .eq("id", selectedProjectId)
 
     if (error) {
       alert("Failed to attach client to project")
       console.error(error)
     } else {
       await fetchData()
     }
     setAttachBusy(null)
   }
 
   return (
     <div className="space-y-8">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-display font-bold text-gray-900">Clients</h1>
           <p className="text-gray-500 mt-1">View client signups and attach them to projects</p>
         </div>
         <Link href="/admin/projects">
           <Button variant="outline">Go to Projects</Button>
         </Link>
       </div>
 
       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
           <div className="relative max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
             <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search by name or email..."
               className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-accent outline-none"
             />
           </div>
           <div className="flex items-center gap-2">
             <select
               value={selectedProjectId ?? ""}
               onChange={(e) => setSelectedProjectId(e.target.value || null)}
               className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
             >
               <option value="">Select project to attach</option>
               {projects.map((p) => (
                 <option key={p.id} value={p.id}>
                   {p.title}
                 </option>
               ))}
             </select>
           </div>
         </div>
 
         {loading ? (
           <div className="py-12 flex justify-center">
             <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
           </div>
         ) : filtered.length === 0 ? (
           <div className="p-12 text-center text-gray-500">No clients found</div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 border-b border-gray-100">
                 <tr>
                   <th className="px-6 py-4 text-gray-500 uppercase tracking-wider font-medium">Name</th>
                   <th className="px-6 py-4 text-gray-500 uppercase tracking-wider font-medium">Email</th>
                   <th className="px-6 py-4 text-gray-500 uppercase tracking-wider font-medium">Joined</th>
                   <th className="px-6 py-4 text-gray-500 uppercase tracking-wider font-medium text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {filtered.map((c) => {
                   const attachedTo = projects.find((p) => p.client_email === c.email)
                   return (
                     <tr key={c.id} className="hover:bg-gray-50/50">
                       <td className="px-6 py-4">
                         <div className="font-medium text-gray-900">{c.full_name || "—"}</div>
                       </td>
                       <td className="px-6 py-4 text-gray-700">
                         <div className="flex items-center gap-2">
                           <Mail className="w-4 h-4 text-gray-400" />
                           <span className="truncate max-w-[220px]">{c.email}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-gray-500">
                         {c.created_at ? format(new Date(c.created_at), "MMM d, yyyy") : "—"}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           {attachedTo ? (
                             <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                               <CheckCircle className="w-3 h-3" /> Attached: {attachedTo.title}
                             </Badge>
                           ) : (
                             <Button
                               size="sm"
                               variant="outline"
                               onClick={() => attachClientToProject(c)}
                               disabled={!selectedProjectId || attachBusy === c.id}
                               className="flex items-center gap-2"
                             >
                               {attachBusy === c.id ? (
                                 <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                               ) : (
                                 <UserPlus className="w-4 h-4" />
                               )}
                               Attach to Project
                             </Button>
                           )}
                         </div>
                       </td>
                     </tr>
                   )
                 })}
               </tbody>
             </table>
           </div>
         )}
       </div>
     </div>
   )
 }
