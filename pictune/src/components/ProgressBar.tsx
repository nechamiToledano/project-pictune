"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  progress: number
  className?: string
}

export default function ProgressBar({ progress, className }: ProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    // Animate the progress bar
    const animationFrame = requestAnimationFrame(() => {
      setAnimatedProgress((prevProgress) => {
        // If we're close to the target, just set it directly
        if (Math.abs(prevProgress - progress) < 1) {
          return progress
        }

        // Otherwise, animate smoothly
        const increment = (progress - prevProgress) * 0.2
        return prevProgress + increment
      })
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [progress])

  return (
    <div className={cn("relative w-full h-2 bg-gray-800 rounded-full overflow-hidden", className)}>
      <div
        className="h-full bg-gradient-to-r from-red-600/20 to-blue-600/20 transition-all duration-300 ease-out"
        style={{ width: `${animatedProgress}%` }}
      />
      <div
        className={`absolute top-0 left-0 h-full w-full opacity-20 ${progress < 100 ? "animate-pulse" : ""}`}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "translateX(-100%)",
          animation: progress < 100 ? "shimmer 2s infinite" : "none",
        }}
      />
      <style >{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

