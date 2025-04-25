"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, Shield, ShieldCheck, Zap, Lock } from "lucide-react"
import { LazyMotion, domMax, motion, AnimatePresence, useReducedMotion } from "framer-motion"

export default function HeroSection() {
  const [url, setUrl] = useState("")
  const [typingIndex, setTypingIndex] = useState(0)
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const { toast } = useToast()
  const [scanning, setScanning] = useState(false)
  const glowRef = useRef<HTMLDivElement>(null)
  const isReducedMotion = useReducedMotion()
  const bubbleData = useMemo(() => Array.from({ length: 10 }).map(() => ({
    size: `${Math.random() * 200 + 100}px`,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.3,
    duration: `${Math.random() * 10 + 20}s`,
    delay: `${Math.random() * 10}s`,
  })), [])
  const [logs, setLogs] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const targetUrl = "https://your-website.com"

  // Define each step that will print
  const scanSteps = [
    "[+] Initializing Guardex security scanner v1.0.0",
    "[+] Crawling website...",
    "[+] Discovered 32 endpoints",
    "[+] Running security checks...",
    "[!] Potential XSS vulnerability detected in /search?q= parameter",
    "[!] Critical: Missing Content-Security-Policy header",
    "[AI] Generating fix recommendations...",
    "[✓] Scan complete. 2 vulnerabilities found.",
  ]

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(139, 92, 246, 0.15), transparent 40%)`
      }
    }
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  // Add this useEffect for typing animation
  useEffect(() => {
    if (typingIndex < targetUrl.length) {
      const timer = setTimeout(() => {
        setUrl(targetUrl.slice(0, typingIndex + 1))
        setTypingIndex(typingIndex + 1)
      }, 100)
      return () => clearTimeout(timer)
    } else if (!isTypingComplete) {
      setIsTypingComplete(true)
      // Trigger scan automatically after typing
      setTimeout(() => {
        handleScan(new Event("autostart") as any)
      }, 1000)
    }
  }, [typingIndex, isTypingComplete])

  // Add this useEffect to auto-start the animation
  useEffect(() => {
    const timer = setTimeout(() => handleScan(new Event("autostart") as any), 1000)
    timeoutsRef.current.push(timer)
    return () => clearTimeout(timer)
  }, [])

  const handleScan = (e: React.FormEvent | any) => {
    // detect auto‑loop vs. manual click
    const isAuto = e.type === "autostart"
    if (!isAuto) {
      e.preventDefault()
      // cancel any pending auto‑loop steps/restarts
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }

    if (!url && !isAuto) {
      toast({
        title: "Please enter a URL",
        description: "Enter your website URL to start scanning",
        variant: "destructive",
      })
      return
    }

    if (!isAuto) {
      toast({
        title: "Scan initiated!",
        description: `Starting security scan for ${url}`,
      })
    }

    // kick off our simulated scan
    setScanning(true)
    setLogs([])

    // schedule each log step and remember its timeout
    scanSteps.forEach((step, idx) => {
      const id = setTimeout(() => {
        setLogs((prev) => [...prev, step])
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }, (idx + 1) * 1000)
      timeoutsRef.current.push(id)
    })

    // when complete, stop scanning; re‑queue only if this was auto‑loop
    const completeId = setTimeout(() => {
      setScanning(false)
      if (isAuto) {
        const restartId = setTimeout(() => handleScan(new Event("autostart") as any), 3000)
        timeoutsRef.current.push(restartId)
      }
    }, (scanSteps.length + 1) * 1000)
    timeoutsRef.current.push(completeId)
  }

  return (
    <LazyMotion features={domMax}>
      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-purple-50 to-white"></div>
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-0 left-0 w-full h-full">
              {!isReducedMotion &&
                bubbleData.map((bubble, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-purple-300/30 blur-xl"
                    style={{
                      width: bubble.size,
                      height: bubble.size,
                      top: bubble.y,
                      left: bubble.x,
                      opacity: bubble.opacity,
                      animation: `float ${bubble.duration} infinite linear`,
                      animationDelay: bubble.delay,
                      willChange: 'transform, opacity, filter',
                    }}
                  />
                ))}
            </div>
          </div>
          <div
            className="absolute inset-0 bg-grid-pattern opacity-20"
            style={{
              backgroundSize: "50px 50px",
              backgroundImage:
                "linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)",
            }}
          ></div>
        </div>

        {/* Interactive cursor glow effect */}
        <div
          ref={glowRef}
          className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        />

        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium mb-6"
            >
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse mr-2"></span>
              Web Security Reimagined
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-purple-800 to-gray-800"
            >
              Web Security,{" "}
              <span className="text-purple-600 relative">
                Reimagined
                <span className="absolute inset-0 animate-pulse-slow opacity-70 blur-xl bg-purple-500/30 rounded-lg"></span>
              </span>{" "}
              for Developers
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl max-w-2xl text-gray-700 mb-10"
            >
              Just enter your website URL, we'll uncover every vulnerability and show you exactly how to fix it.
              Instantly.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              onSubmit={handleScan}
              noValidate
              className="flex flex-col sm:flex-row w-full max-w-xl gap-3 mb-8"
            >
              <div className="relative flex-1 group">
                <Input
                  type="text"
                  placeholder="https://your-website.com"
                  value={url}
                  readOnly
                  className="pl-4 pr-10 py-6 h-auto bg-white/70 border-purple-300 focus:border-purple-500 transition-all duration-300 group-hover:border-purple-500 text-gray-800"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden rounded-md">
                  <div className="scanner-line"></div>
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="group bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 border-none py-6 h-auto"
              >
                <span className="mr-2">Scan My Website</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-700"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center px-3 py-2 rounded-full bg-white/50 shadow-sm"
              >
                <ShieldCheck size={16} className="text-purple-600 mr-2" />
                <span>OWASP Top 10 Compliant</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center px-3 py-2 rounded-full bg-white/50 shadow-sm"
              >
                <Zap size={16} className="text-purple-600 mr-2" />
                <span>AI-Powered Analysis</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center px-3 py-2 rounded-full bg-white/50 shadow-sm"
              >
                <Lock size={16} className="text-purple-600 mr-2" />
                <span>Developer First</span>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black p-3 border border-purple-500/20 shadow-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <div className="flex-1 text-xs text-center text-gray-400">Guardex Scanner</div>
              </div>
              <div className="h-[calc(100%-24px)] w-full bg-gray-950 rounded-md p-4 overflow-hidden font-mono text-sm text-gray-300 border border-gray-800/50">
                <div ref={terminalRef} className="h-full overflow-auto terminal-scrollbar">
                  <AnimatePresence>
                    {scanning || logs.length > 0 ? (
                      <div>
                        {logs.map((line, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`mb-1 ${line.includes("[!]") ? "text-red-400" : line.includes("[AI]") ? "text-purple-400" : line.includes("[✓]") ? "text-purple-400" : "text-gray-300"}`}
                          >
                            {line}
                          </motion.div>
                        ))}
                        {scanning && logs.length < scanSteps.length && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                            className="inline-block"
                          >
                            ▋
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-500 flex items-center h-full justify-center"
                      >
                        <div className="text-center">
                          <Shield size={40} className="mx-auto mb-3 text-purple-500/50" />
                          <p>Enter a URL and click "Scan My Website" to start the simulation.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg shadow-purple-900/30"
            >
              Watch in real-time as we scan your website
            </motion.div>
          </motion.div>
        </div>
      </section>
    </LazyMotion>
  )
}
