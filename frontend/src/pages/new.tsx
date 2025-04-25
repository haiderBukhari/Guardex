"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  AlertTriangle,
  AlertOctagon,
  X,
  Bot,
  Loader2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Mic,
  MicOff,
  Send,
  XCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import DashboardSidebar from "@/components/DashboardSidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'

// Sample data - replace with real data later

const Agent = () => {
  const navigate = useNavigate()
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null)
  const [showAICall, setShowAICall] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCallStarted, setIsCallStarted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [aiResponseAudio, setAiResponseAudio] = useState<string | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const blobCountRef = useRef(0)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isRecordingRef = useRef(false)
  const recordingRef = useRef(false)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(20).fill(5))
  const [scans, setScans] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulated conversation for UI demo
  const [conversation, setConversation] = useState([
    {
      role: "ai",
      content: "Hello! I'm your AI security analyst. How can I help you today?",
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
  ])

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const userData = Cookies.get("guardex_user")
        if (!userData) {
          setIsLoading(false)
          return
        }
        const userId = JSON.parse(userData).id
        const res = await fetch("https://guardex-node-js.vercel.app/api/scan?user_id=" + userId)
        const json = await res.json()
        setScans(json?.scans || [])
      } catch (err) {
        console.error("Failed to fetch scans:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchScans()
  }, [])

  const getVulnerabilityCounts = (vulnerabilities = []) => {
    const counts = { critical: 0, high: 0, low: 0 }
    for (const vuln of vulnerabilities) {
      if (!vuln || !vuln.severity) continue
      const severity = vuln.severity.toLowerCase()
      if (severity.includes("critical")) counts.critical++
      else if (severity.includes("high")) counts.high++
      else counts.low++
    }
    return counts
  }


  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setVisualizerData((prev) => prev.map(() => Math.floor(Math.random() * 30) + 5))
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const handleStartAICall = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowAICall(true)
      setSelectedWebsite(null)
    }, 2000)
  }

  const sendAudioToServer = async (audioBlob: Blob) => {
    try {
      setIsSending(true);
      // Validate blob before sending
      if (audioBlob.size === 0) {
        throw new Error("Audio blob is empty");
      }
      if (audioBlob.type !== "audio/webm;codecs=opus") {
        console.warn("⚠️ Unexpected audio type:", audioBlob.type);
      }
      console.log("📦 Audio blob details:", {
        size: audioBlob.size,
        type: audioBlob.type
      });

      // 1. Create FormData
      const formData = new FormData();
      
      // 2. Append the audio blob with correct field name
      formData.append("audio", audioBlob, "recording.webm");
      
      // 3. Send to Flask backend
      const response = await fetch("https://aiaudio-e209bb5237d2.herokuapp.com/api/voice-agent", {
        method: "POST",
        body: formData // Let browser set content-type automatically
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 4. Parse and handle response
      const result = await response.json();
      console.log("✅ Server Response:", result);
      
      // Handle the AI's response audio array
      if (result.response_audio_base64 && Array.isArray(result.response_audio_base64)) {
        // Play each audio chunk sequentially
        for (const base64Audio of result.response_audio_base64) {
          const audioData = `data:audio/mp3;base64,${base64Audio}`;
          await new Promise((resolve, reject) => {
            const audio = new Audio(audioData);
            audio.onended = resolve;
            audio.onerror = reject;
            audio.play().catch(error => {
              console.error("Error playing audio chunk:", error);
              reject(error);
            });
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error("❌ Error sending audio:", error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const startVoiceDetection = async () => {
    try {
      console.log("🎤 Starting audio setup...")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("✅ Got audio stream")

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstart = () => {
        console.log("🎬 Recording started")
        recordingRef.current = true
      }

      mediaRecorder.onstop = async () => {
        console.log("🛑 Recording stopped")
        recordingRef.current = false
        setIsRecording(false)
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          const url = URL.createObjectURL(blob)
          console.log("📦 Audio recording available at:", url)
          console.log("📦 Recording size:", blob.size, "bytes")

          // Send to backend
          try {
            await sendAudioToServer(blob)
          } catch (error) {
            console.error("❌ Failed to send audio to server:", error)
          }

          // Cleanup
          URL.revokeObjectURL(url)
          audioChunksRef.current = []
        }
      }

      mediaStreamRef.current = stream
      setIsCallStarted(true)
      console.log("🎤 Ready to record")
    } catch (err) {
      console.error("❌ Error setting up audio:", err)
    }
  }

  const toggleRecording = async () => {
    if (!mediaRecorderRef.current) return

    if (mediaRecorderRef.current.state === "recording") {
      console.log("🛑 Stopping recording...")
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    } else {
      console.log("🎤 Starting recording...")
      // Clean up previous recording
      audioChunksRef.current = []

      // Get a new stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream

        // Create new MediaRecorder with proper mimeType
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        })
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstart = () => {
          console.log("🎬 Recording started")
          recordingRef.current = true
        }

        mediaRecorder.onstop = async () => {
          console.log("🛑 Recording stopped")
          recordingRef.current = false
          setIsRecording(false)

          if (audioChunksRef.current.length > 0) {
            const blob = new Blob(audioChunksRef.current, {
              type: "audio/webm;codecs=opus",
            })
            console.log("📦 Recording size:", blob.size, "bytes")

            try {
              await sendAudioToServer(blob)
            } catch (error) {
              console.error("❌ Failed to send audio to server:", error)
            }

            // Cleanup
            audioChunksRef.current = []
          }
        }

        // Start recording
        mediaRecorder.start(100)
        setIsRecording(true)
      } catch (err) {
        console.error("❌ Error starting new recording:", err)
      }
    }
  }

  const endCall = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      console.log("🛑 Stopping recording...")
      mediaRecorderRef.current.stop()
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    mediaRecorderRef.current = null
    mediaStreamRef.current = null
    setIsCallStarted(false)
    setShowAICall(false)
    navigate("/agent")
  }


  // Format timestamp to readable time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const totalScans = scans.length
  const completedScans = scans.filter((s) => s.scan_complete).length
  const averageScore = scans.length
    ? Math.round(
      scans.reduce((acc, scan) => {
        const { critical, high, low } = getVulnerabilityCounts(scan.vulnerabilities || [])
        const score = Math.max(0, 100 - (critical * 3 + high * 2 + low) * 5)
        return acc + score
      }, 0) / scans.length
    )
    : 0


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64">
        <DashboardHeader />

        <div className="p-6">


          <div className="max-w-7xl mx-auto">
            {/* Initial UI - Only show when not in AI call */}
            {!showAICall && (
              <>
                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
                  <p className="text-gray-600">Start your security analysis with our AI-powered platform</p>
                </motion.div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <Shield className="h-5 w-5 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">Total Scans</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalScans}</h3>
                    <div className="flex items-center text-green-500 text-sm">
                      <span className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        +12% from last week
                      </span>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                        <ShieldAlert className="h-5 w-5 text-amber-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">Average Score</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{averageScore}%</h3>
                    <div className="flex items-center text-red-500 text-sm">
                      <span className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        -8% from last week
                      </span>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">Active Scans</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{completedScans}</h3>
                    <div className="flex items-center text-green-500 text-sm">
                      <span className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        +2 from yesterday
                      </span>
                    </div>
                  </motion.div>
                </div>


                {/* Websites Grid */}
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {scans.map((scan) => {
                    const { critical, high, low } = getVulnerabilityCounts(scan.vulnerabilities || [])

                    const totalVulns = critical + high + low
                    const weightedScoreRaw = totalVulns
                      ? Math.max(
                        0,
                        100 - ((critical * 5 + high * 3 + low * 1) / totalVulns) * 10
                      )
                      : 100
                    const weightedScore = parseFloat(weightedScoreRaw.toFixed(2))

                    const progress = scan.scan_complete ? 100 : 65 // Fixed fallback for in-progress scans

                    return (
                      <motion.div
                        key={scan.id}
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl p-6 cursor-pointer shadow-md border border-gray-100 transition-all duration-300"
                        onClick={() => setSelectedWebsite(scan)}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              {new URL(scan.website_link).hostname}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {new Date(scan.scanned_on).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-2xl font-bold ${weightedScore < 50
                                ? "text-red-500"
                                : weightedScore < 80
                                  ? "text-amber-500"
                                  : "text-green-500"
                                } mb-1`}
                            >
                              {weightedScore}%
                            </div>
                            <span className="text-xs text-gray-500">Security Score</span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <Progress
                            value={progress}
                            className="h-2 bg-gray-100"
                            indicatorClassName={
                              weightedScore < 50
                                ? "bg-gradient-to-r from-red-400 to-red-500"
                                : weightedScore < 80
                                  ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                  : "bg-gradient-to-r from-green-400 to-green-500"
                            }
                          />
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-500">Scan Progress</span>
                            <span className="text-xs text-gray-500">{progress}%</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <AlertOctagon className="text-red-500 mr-2" size={16} />
                              <span className="text-sm text-gray-700">Critical</span>
                            </div>
                            <span className="font-mono text-red-500 font-semibold">{critical}</span>
                          </div>
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <AlertTriangle className="text-amber-500 mr-2" size={16} />
                              <span className="text-sm text-gray-700">High</span>
                            </div>
                            <span className="font-mono text-amber-500 font-semibold">{high}</span>
                          </div>
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <AlertCircle className="text-blue-500 mr-2" size={16} />
                              <span className="text-sm text-gray-700">Low</span>
                            </div>
                            <span className="font-mono text-blue-500 font-semibold">{low}</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}

                </motion.div>
              </>
            )}

            {/* Website Selection Modal */}
            <AnimatePresence>
              {selectedWebsite && (
                <Dialog open={!!selectedWebsite} onOpenChange={() => setSelectedWebsite(null)}>
                  <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-xl rounded-xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-gray-900">Start AI Vulnerability Analysis</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Begin an AI-guided analysis of security vulnerabilities for {selectedWebsite?.website_link}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-700">Website URL</label>
                        <Input
                          value={selectedWebsite?.website_link}
                          disabled
                          className="bg-gray-50 border border-gray-200 text-gray-700"
                        />
                      </div>
                      <Button
                        onClick={handleStartAICall}
                        className="w-full py-6 rounded-xl text-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Bot className="mr-2 h-5 w-5" />
                            Start AI Analysis
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </AnimatePresence>

            {/* AI Call UI - Only show when in AI call */}
            {showAICall && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Summary */}
                <div className="bg-[#1A1A1A] rounded-2xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-white mb-6">Vulnerability Analysis</h2>
                  <div className="space-y-6">
                    <div className="bg-[#2A2A2A] rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Current Analysis</h3>
                      <p className="text-gray-400">
                        The AI is analyzing the website's security posture. Key vulnerabilities have been identified
                        in the authentication system and data handling processes.
                      </p>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Recommendations</h3>
                      <ul className="list-disc list-inside text-gray-400 space-y-2">
                        <li>Implement stronger password policies</li>
                        <li>Add rate limiting to login attempts</li>
                        <li>Encrypt sensitive data at rest</li>
                        <li>Update outdated dependencies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Side - Call Interface */}
                <div className="bg-[#1A1A1A] rounded-2xl p-8 shadow-xl">
                  <div className="flex flex-col items-center">
                    {/* AI Avatar */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-8">
                      <Bot className="h-16 w-16 text-white" />
                    </div>

                    {/* Status Text */}
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-white mb-2">AI Security Analyst</h3>
                      <p className="text-gray-400">
                        {isRecording ? "Analyzing security vulnerabilities..." : "Ready to begin analysis"}
                      </p>
                    </div>

                    {/* Recording Status */}
                    {isRecording && (
                      <div className="flex items-center gap-2 mb-8">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-500 font-medium">Recording</span>
                      </div>
                    )}

                    {/* Control Buttons */}
                    <div className="space-y-4 w-full">
                      {!isCallStarted ? (
                        <Button
                          onClick={startVoiceDetection}
                          className="w-full py-8 rounded-xl text-xl font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transform hover:scale-105 transition-all"
                        >
                          Start Analysis
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={toggleRecording}
                            className={`w-full py-8 rounded-xl text-xl font-medium ${
                              isRecording 
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                            } text-white shadow-lg transform hover:scale-105 transition-all`}
                          >
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                          </Button>
                          
                          <Button
                            onClick={async () => {
                              if (mediaRecorderRef.current?.state === "recording") {
                                mediaRecorderRef.current.stop();
                              }
                              if (audioChunksRef.current.length > 0) {
                                const blob = new Blob(audioChunksRef.current, { 
                                  type: "audio/webm;codecs=opus" 
                                });
                                try {
                                  await sendAudioToServer(blob);
                                } catch (error) {
                                  console.error("❌ Failed to send audio to server:", error);
                                }
                              }
                            }}
                            disabled={isSending || audioChunksRef.current.length === 0}
                            className="w-full py-8 rounded-xl text-xl font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSending ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              'Send Analysis'
                            )}
                          </Button>
                          
                          <Button
                            onClick={endCall}
                            className="w-full py-6 rounded-xl text-lg font-medium bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg transform hover:scale-105 transition-all"
                          >
                            End Analysis
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agent