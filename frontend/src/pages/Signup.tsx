import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const Signup = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const { toast } = useToast()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setPasswordMatch(false)
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    if (!fullName || !email || !password || !role) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const res = await fetch("https://guardex-node-js.vercel.app/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          role,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "🎉 Account created",
          description: "Verification email sent! Please check your inbox to activate your account.",
        })

        // Reset fields
        setFullName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setRole('')

        // Redirect to home
        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
      } else {
        toast({
          title: "Signup failed",
          description: data.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not reach the server",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background relative">
      <div className="absolute inset-0 -z-10 gradient-bg"></div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="size-10 rounded-lg bg-guardex-500 text-white font-bold flex items-center justify-center mr-2">G</div>
          <span className="font-bold text-2xl">guardex</span>
        </div>

        <div className="glass-effect p-8 glow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium block">Full Name</label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-background/50 focus:ring-guardex-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background/50 focus:ring-guardex-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium block">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/50 focus:ring-guardex-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium block">Confirm Password</label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setPasswordMatch(e.target.value === password)
                }}
                className={`w-full bg-background/50 focus:ring-guardex-400 ${!passwordMatch ? 'border-destructive' : ''}`}
              />
              {!passwordMatch && (
                <p className="text-xs text-destructive mt-1">Passwords don't match</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium block">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-background/50 text-sm text-muted-foreground border rounded-md px-3 py-2 focus:ring-guardex-400"
              >
                <option value="">Select a role</option>
                <option value="SaaS Teams">SaaS Teams</option>
                <option value="Startups">Startups</option>
                <option value="DevOps Engineers">DevOps Engineers</option>
                <option value="Agencies">Agencies</option>
                <option value="Development Teams">Development Teams</option>
                <option value="Enterprises">Enterprises</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full glow-sm hover:glow-md bg-guardex-500 hover:bg-guardex-600 text-white"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-guardex-400 hover:text-guardex-300 transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
