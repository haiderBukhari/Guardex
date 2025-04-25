import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Cookies from 'js-cookie'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("https://guardex-node-js.vercel.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        // Store user data in cookies
        Cookies.set("guardex_user", JSON.stringify(data.user), { expires: 7 })

        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        })

        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Server Error",
        description: "Unable to connect to the server",
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
          <h1 className="text-2xl font-bold mb-6 text-center">Log in to your account</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background/50 focus:ring-guardex-400 transition-all focus:glow-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-xs text-guardex-400 hover:text-guardex-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/50 focus:ring-guardex-400 transition-all focus:glow-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full glow-sm hover:glow-md transition-all bg-guardex-500 hover:bg-guardex-600 text-white"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-guardex-500 text-guardex-500 hover:bg-guardex-100" type="button">
              <Github size={16} className="mr-2" />
              GitHub
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-guardex-400 hover:text-guardex-300 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
