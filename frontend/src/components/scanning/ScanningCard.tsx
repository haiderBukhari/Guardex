"use client"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Play, ExternalLink, Shield } from "lucide-react"
import { motion } from "framer-motion"

interface ScanningCardProps {
  id: string
  name: string
  url: string
  dateAdded: Date
  isScanning: boolean
  progress: number
  scanComplete: boolean
  vulnerabilities?: number
  onStartScan: (id: string) => void
}

const ScanningCard = ({
  id,
  name,
  url,
  dateAdded,
  isScanning,
  progress,
  scanComplete,
  vulnerabilities,
  onStartScan,
}: ScanningCardProps) => {
  return (
    <div
      className={`glass-effect p-6 flex flex-col h-full relative overflow-hidden ${
        isScanning ? "glow-sm border-guardex-500/50" : ""
      }`}
    >
      {/* Website Info Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="size-10 rounded-md bg-guardex-500/10 flex items-center justify-center mr-3">
            <img
              src={`https://www.google.com/s2/favicons?domain=${url}&sz=32`}
              alt={name}
              className="h-5 w-5"
              onError={(e) => {
                // If favicon fails to load, show a fallback
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=20&width=20"
              }}
            />
          </div>
          <div>
            <h3 className="font-medium truncate max-w-[150px]" title={name}>
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">Added {dateAdded.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Circular Progress Indicator */}
      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          {/* Background Circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="4" />

            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(168, 85, 247, 0.8)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="289.02652413026095"
              strokeDashoffset={289.02652413026095 * (1 - progress / 100)}
              transform="rotate(-90 50 50)"
              className="transition-all duration-300 ease-in-out"
            />

            {/* Percentage Text */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(168, 85, 247, 1)"
              fontSize="16"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {isScanning ? `${Math.round(progress)}%` : scanComplete ? "100%" : "0%"}
            </text>

            {/* Status Text */}
            <text x="50" y="65" textAnchor="middle" fill="rgba(168, 85, 247, 0.8)" fontSize="8" fontFamily="monospace">
              {isScanning ? "SCANNING" : scanComplete ? "COMPLETE" : "READY"}
            </text>
          </svg>

          {/* Scanning Animation Elements */}
          {isScanning && (
            <>
              {/* Rotating Scan Line */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full"
                initial={false}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                style={{ transformOrigin: "center" }}
              >
                <div className="absolute top-0 left-1/2 h-1/2 w-px bg-guardex-500 origin-bottom" />
              </motion.div>

              {/* Pulse Effect */}
              <motion.div
                className="absolute inset-0 rounded-full border border-guardex-500"
                initial={{ opacity: 0.8, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </>
          )}

          {/* Completed Animation */}
          {scanComplete && !isScanning && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="absolute inset-0 rounded-full bg-guardex-500/5 animate-pulse-slow" />
            </motion.div>
          )}
        </div>

        {/* Vulnerabilities Count (when scan complete) */}
        {scanComplete && !isScanning && (
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-guardex-500">{vulnerabilities}</span>
            <p className="text-xs text-muted-foreground">Vulnerabilities found</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto">
        {!isScanning && (
          <Button variant="default" size="sm" className="flex-1" onClick={() => onStartScan(id)}>
            {scanComplete ? (
              <>
                <Shield className="h-4 w-4 mr-1" /> Rescan
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" /> Start Scan
              </>
            )}
          </Button>
        )}
        <Link to={`/scan-results/${id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full" disabled={!scanComplete && !isScanning}>
            <ExternalLink className="h-4 w-4 mr-1" /> Results
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default ScanningCard
