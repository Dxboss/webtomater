"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"

export default function PortalLogin() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/portal/settings`,
        })
        if (error) throw error
        setSuccess("Password reset link sent! Check your email.")
        setIsForgotPassword(false)
      } else if (isSignUp) {
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })
        if (error) throw error

        // Manually create profile if user is created (backup for trigger)
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: email,
              full_name: fullName,
              role: 'client'
            }, { onConflict: 'id' })
          
          if (profileError) {
            console.error("Profile creation failed:", profileError)
            // Don't block signup success, but log error
          }
        }

        setSuccess("Account created! You can now log in.")
        setIsSignUp(false)
      } else {
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        if (session) {
          // Check user role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (profile?.role === 'admin' || session.user.email === 'davidgeorge2152.dg@gmail.com') {
            router.push("/admin")
          } else {
            router.push("/portal")
          }
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
            {isForgotPassword ? "Reset Password" : (isSignUp ? "Create Account" : "Client Portal")}
          </h1>
          <p className="text-sm text-gray-500">
            {isForgotPassword 
              ? "Enter your email to receive a reset link" 
              : (isSignUp ? "Set up your access to view projects" : "Access your project dashboard and files")}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-600 text-sm p-4 rounded-lg border border-green-100">
              {success}
            </div>
          )}

          <div className="space-y-2">
            {isSignUp && (
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              placeholder="client@example.com"
              required
            />
          </div>

          {!isForgotPassword && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-base"
            disabled={loading}
          >
            {loading ? "Processing..." : (isForgotPassword ? "Send Reset Link" : (isSignUp ? "Create Account" : "Sign In"))}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {isForgotPassword ? (
            <p className="text-sm text-gray-500">
              <button 
                onClick={() => setIsForgotPassword(false)} 
                className="text-accent hover:underline font-medium"
              >
                Back to Sign In
              </button>
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button 
                  onClick={() => setIsSignUp(!isSignUp)} 
                  className="text-accent hover:underline ml-1 font-medium"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
              {!isSignUp && (
                <p className="text-xs text-gray-400">
                  <button 
                    onClick={() => setIsForgotPassword(true)}
                    className="hover:text-gray-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
