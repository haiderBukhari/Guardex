"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"

interface StatusMessage {
  text: string
  type: "success" | "error" | "info"
}

interface StatusBoxProps {
  isScanning: boolean
  messages: StatusMessage[]
  currentIndex: number
}

const StatusBox = ({ isScanning, messages, currentIndex }: StatusBoxProps) => {
  return (
    <div className="macbook-status-box h-[350px] overflow-hidden">
      {/* MacBook-style header */}
      <div className="macbook-header">
        <div className="flex items-center space-x-1.5 px-3 py-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-guardex-500"></div>
          <div className="ml-2 text-xs text-white/70 flex-1 text-center">Terminal</div>
        </div>
      </div>

      {/* Status content */}
      <div className="macbook-content min-h-[300px]">
        <AnimatePresence>
          {messages.length > 0 ? (
            <div className="space-y-2 p-3">
              {messages.slice(0, currentIndex + 1).map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start ${index === currentIndex ? "animate-pulse-slow" : ""}`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-guardex-400 mr-2 mt-0.5 flex-shrink-0" />
                  ) : message.type === "error" ? (
                    <XCircle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <span className="h-4 w-4 flex items-center justify-center text-purple-400 mr-2 mt-0.5 flex-shrink-0">
                      &gt;
                    </span>
                  )}
                  <span
                    className={`text-xs font-mono ${message.type === "success"
                        ? "text-guardex-400"
                        : message.type === "error"
                          ? "text-red-400"
                          : "text-purple-300"
                      }`}
                  >
                    {message.text}
                  </span>
                </motion.div>
              ))}

              {/* Blinking cursor at the end */}
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                  className="h-4 w-2 bg-purple-400 ml-6"
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-purple-300/70 font-mono">Ready to scan...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StatusBox
