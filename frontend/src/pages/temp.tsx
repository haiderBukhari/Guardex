"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { AlertCircle, AlertTriangle, AlertOctagon, Bot, Loader2, Shield, Activity, Zap, Mic } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import DashboardSidebar from "@/components/DashboardSidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { useNavigate } from "react-router-dom"

// Sample data - replace with real data later
const websiteData = [
  {
    url: "example.com",
    vulnerabilities: { critical: 3, high: 5, low: 2 },
    lastScan: "2 hours ago",
    progress: 100,
    score: 34,
  },
  {
    url: "testsite.net",
    vulnerabilities: { critical: 1, high: 3, low: 4 },
    lastScan: "1 day ago",
    progress: 73,
    score: 67,
  },
  {
    url: "demo.app",
    vulnerabilities: { critical: 2, high: 4, low: 1 },
    lastScan: "3 hours ago",
    progress: 89,
    score: 45,
  },
]

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
  const controls = useAnimation()

  // Audio visualization elements
  const [audioVisualization, setAudioVisualization] = useState<number[]>(Array(20).fill(5))

  // Add this state near the top with other state declarations
  const [debugMode, setDebugMode] = useState(false)

  // Add this function to toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode((prev) => !prev)
  }

  useEffect(() => {
    // Simulate audio visualization when recording
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setAudioVisualization((prev) => prev.map(() => Math.random() * 50 + 5))
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
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
  }, [isRecording])

  // Pulse animation for the AI avatar
  useEffect(() => {
    if (isCallStarted) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        },
      })
    }
  }, [isCallStarted, controls])

  const handleStartAICall = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowAICall(true);
      setSelectedWebsite(null);
    }, 2000);
  };

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
      console.log("🎤 Starting audio setup...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ Got audio stream");
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstart = () => {
        console.log("🎬 Recording started");
        recordingRef.current = true;
      };
      
      mediaRecorder.onstop = async () => {
        console.log("🛑 Recording stopped");
        recordingRef.current = false;
        setIsRecording(false);
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          console.log("📦 Audio recording available at:", url);
          console.log("📦 Recording size:", blob.size, "bytes");

          // Send to backend
          try {
            await sendAudioToServer(blob);
          } catch (error) {
            console.error("❌ Failed to send audio to server:", error);
          }

          // Cleanup
          URL.revokeObjectURL(url);
          audioChunksRef.current = [];
        }
      };
            
      mediaStreamRef.current = stream;
      setIsCallStarted(true);
      console.log("🎤 Ready to record");
      
    } catch (err) {
      console.error("❌ Error setting up audio:", err);
    }
  };

  const toggleRecording = async () => {
    if (!mediaRecorderRef.current) return;
  
    if (mediaRecorderRef.current.state === "recording") {
      console.log("🛑 Stopping recording...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      console.log("🎤 Starting recording...");
      // Clean up previous recording
      audioChunksRef.current = [];
      
      // Get a new stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        
        // Create new MediaRecorder with proper mimeType
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus"
        });
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstart = () => {
          console.log("🎬 Recording started");
          recordingRef.current = true;
        };
        
        mediaRecorder.onstop = async () => {
          console.log("🛑 Recording stopped");
          recordingRef.current = false;
          setIsRecording(false);
          
          if (audioChunksRef.current.length > 0) {
            const blob = new Blob(audioChunksRef.current, { 
              type: "audio/webm;codecs=opus" 
            });
            console.log("📦 Recording size:", blob.size, "bytes");
            
            try {
              await sendAudioToServer(blob);
            } catch (error) {
              console.error("❌ Failed to send audio to server:", error);
            }
            
            // Cleanup
            audioChunksRef.current = [];
          }
        };
        
        // Start recording
        mediaRecorder.start(100);
        setIsRecording(true);
      } catch (err) {
        console.error("❌ Error starting new recording:", err);
      }
    }
  };

  const endCall = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      console.log("🛑 Stopping recording...");
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    setIsCallStarted(false);
    setShowAICall(false);
    navigate('/agent');
  };

  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 ml-64">
        <DashboardHeader />

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-pink-100 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Initial UI - Only show when not in AI call */}
            {!showAICall && (
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                {/* Header Section */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Good evening!</h1>
                  <p className="text-gray-600">Start your security analysis with our AI-powered platform</p>
                </motion.div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      value: "73",
                      label: "Total Scans",
                      icon: <Activity className="h-5 w-5" />,
                      color: "from-blue-400 to-cyan-300",
                    },
                    {
                      value: "34%",
                      label: "Average Score",
                      icon: <Shield className="h-5 w-5" />,
                      color: "from-purple-400 to-indigo-300",
                    },
                    {
                      value: "5",
                      label: "Active Scans",
                      icon: <Zap className="h-5 w-5" />,
                      color: "from-pink-400 to-rose-300",
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={statsVariants}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                      }}
                      className="bg-white rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-gray-100"
                    >
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white mr-3`}>
                          {stat.icon}
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Websites Grid */}
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {websiteData.map((website, index) => (
                    <motion.div
                      key={website.url}
                      variants={item}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white rounded-2xl p-6 cursor-pointer shadow-lg backdrop-blur-sm border border-gray-100"
                      onClick={() => setSelectedWebsite(website)}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{website.url}</h3>
                          <span className="text-xs text-gray-500">{website.lastScan}</span>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${
                              website.score < 40
                                ? "text-red-500"
                                : website.score < 70
                                  ? "text-orange-500"
                                  : "text-green-500"
                            } mb-1`}
                          >
                            {website.score}%
                          </div>
                          <span className="text-xs text-gray-500">Security Score</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <Progress
                          value={website.progress}
                          className="h-2 bg-gray-100"
                          indicatorClassName={
                            website.score < 40
                              ? "bg-gradient-to-r from-red-400 to-red-500"
                              : website.score < 70
                                ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                : "bg-gradient-to-r from-green-400 to-green-500"
                          }
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500">Scan Progress</span>
                          <span className="text-xs text-gray-500">{website.progress}%</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <AlertOctagon className="text-red-500 mr-2" size={16} />
                            <span className="text-sm text-gray-700">Critical</span>
                          </div>
                          <span className="font-mono text-red-500 font-medium">{website.vulnerabilities.critical}</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <AlertTriangle className="text-orange-500 mr-2" size={16} />
                            <span className="text-sm text-gray-700">High</span>
                          </div>
                          <span className="font-mono text-orange-500 font-medium">{website.vulnerabilities.high}</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <AlertCircle className="text-yellow-500 mr-2" size={16} />
                            <span className="text-sm text-gray-700">Low</span>
                          </div>
                          <span className="font-mono text-yellow-500 font-medium">{website.vulnerabilities.low}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Website Selection Modal */}
            <AnimatePresence>
              {selectedWebsite && (
                <Dialog open={!!selectedWebsite} onOpenChange={() => setSelectedWebsite(null)}>
                  <DialogContent className="sm:max-w-[425px] bg-white border border-gray-100 shadow-xl rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900">Start AI Vulnerability Analysis</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Begin an AI-guided analysis of security vulnerabilities for {selectedWebsite?.url}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-700">Website URL</label>
                        <Input
                          value={selectedWebsite?.url}
                          disabled
                          className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg"
                        />
                      </div>
                      <Button
                        onClick={handleStartAICall}
                        className="w-full py-6 rounded-xl text-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Bot className="mr-2 h-4 w-4" />
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Left Side - Summary */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Vulnerability Analysis</h2>
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Analysis</h3>
                      <p className="text-gray-600">
                        The AI is analyzing the website's security posture. Key vulnerabilities have been identified in
                        the authentication system and data handling processes.
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendations</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Implement stronger password policies</li>
                        <li>Add rate limiting to login attempts</li>
                        <li>Encrypt sensitive data at rest</li>
                        <li>Update outdated dependencies</li>
                      </ul>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right Side - Call Interface */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
                >
                  <div className="flex flex-col items-center">
                    {/* AI Avatar */}
                    <motion.div
                      animate={controls}
                      className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mb-8 shadow-lg"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-30 blur-md" />
                      <Bot className="h-16 w-16 text-white relative z-10" />

                      {/* Audio visualization circles */}
                      {isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-full h-full">
                            {audioVisualization.map((height, index) => (
                              <motion.div
                                key={index}
                                className="absolute w-1 bg-white opacity-70"
                                style={{
                                  height: `${height}px`,
                                  left: `${50 + 45 * Math.cos(index * ((2 * Math.PI) / 20))}%`,
                                  top: `${50 + 45 * Math.sin(index * ((2 * Math.PI) / 20))}%`,
                                  transformOrigin: "bottom",
                                  transform: `rotate(${index * (360 / 20)}deg)`,
                                }}
                                animate={{ height: [`${height}px`, `${Math.random() * 30 + 5}px`] }}
                                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Status Text */}
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Security Analyst</h3>
                      <p className="text-gray-600">
                        {isRecording ? "Analyzing security vulnerabilities..." : "Ready to begin analysis"}
                      </p>
                    </div>

                    {/* Recording Status */}
                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 mb-8 bg-red-50 px-4 py-2 rounded-full"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          className="w-3 h-3 rounded-full bg-red-500"
                        />
                        <span className="text-red-500 font-medium">Recording</span>
                      </motion.div>
                    )}

                    {/* Control Buttons */}
                    <div className="space-y-4 w-full">
                      {!isCallStarted ? (
                        <div className="space-y-4">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={startVoiceDetection}
                              className="w-full py-8 rounded-xl text-xl font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg transition-all duration-300"
                              disabled={isGenerating}
                            >
                              <motion.div
                                className="flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                {isGenerating ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Requesting Microphone...
                                  </>
                                ) : (
                                  <>
                                    <Mic className="mr-2 h-5 w-5" />
                                    Start Analysis with Voice
                                  </>
                                )}
                              </motion.div>
                            </Button>
                          </motion.div>

                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                            <Button
                              onClick={startAnalysisWithoutMicrophone}
                              variant="outline"
                              className="w-full py-4 rounded-xl text-base font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                            >
                              Continue without Microphone
                            </Button>
                          </motion.div>
                        </div>
                      ) : (
                        <>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={toggleRecording}
                              className={`w-full py-8 rounded-xl text-xl font-medium ${
                                isRecording
                                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                              } text-white shadow-lg transition-all duration-300`}
                            >
                              {isRecording ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Stop Recording
                                </>
                              ) : (
                                <>
                                  <Mic className="mr-2 h-5 w-5" />
                                  Start Recording
                                </>
                              )}
                            </Button>
                          </motion.div>

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={async () => {
                                if (mediaRecorderRef.current?.state === "recording") {
                                  mediaRecorderRef.current.stop()
                                }
                                if (audioChunksRef.current.length > 0) {
                                  const blob = new Blob(audioChunksRef.current, { type: "audio/webm;codecs=opus" })
                                  try {
                                    await sendAudioToServer(blob)
                                  } catch (error) {
                                    console.error("❌ Failed to send audio to server:", error)
                                  }
                                }
                              }}
                              disabled={isSending || audioChunksRef.current.length === 0}
                              className="w-full py-8 rounded-xl text-xl font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSending ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                "Send Analysis"
                              )}
                            </Button>
                          </motion.div>

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={endCall}
                              className="w-full py-6 rounded-xl text-lg font-medium bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg transition-all duration-300"
                            >
                              End Analysis
                            </Button>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Add a small button to enable debug mode in the top right corner */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleDebugMode}
            className="bg-gray-200 text-gray-700 p-1 rounded-full opacity-50 hover:opacity-100"
          >
            <span className="sr-only">Debug Mode</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="M12 16v.01"></path>
              <path d="M12 8v4"></path>
            </svg>
          </button>
        </div>

        {/* Add a debug panel at the bottom of the component, right before the final closing div */}
        {debugMode && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white p-4 font-mono text-xs z-50 max-h-40 overflow-auto">
            <div className="flex justify-between mb-2">
              <h3>Debug Panel</h3>
              <button onClick={() => setDebugMode(false)}>Close</button>
            </div>
            <div>
              <p>isCallStarted: {isCallStarted.toString()}</p>
              <p>isRecording: {isRecording.toString()}</p>
              <p>isGenerating: {isGenerating.toString()}</p>
              <p>mediaRecorderRef: {mediaRecorderRef.current ? "Set" : "Not Set"}</p>
              <p>mediaStreamRef: {mediaStreamRef.current ? "Set" : "Not Set"}</p>
              <p>audioChunks: {audioChunksRef.current.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Agent
