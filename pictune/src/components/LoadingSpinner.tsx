"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  text?: string
  size?: "sm" | "md" | "lg"
  icon?: React.ReactNode
}

export default function LoadingSpinner({ text = "Loading...", size = "md", icon }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: {
      container: "p-4",
      spinner: "h-8 w-8",
      text: "text-sm",
    },
    md: {
      container: "p-6",
      spinner: "h-12 w-12",
      text: "text-base",
    },
    lg: {
      container: "p-8",
      spinner: "h-16 w-16",
      text: "text-lg",
    },
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div
        className={`bg-black/40 backdrop-blur-md rounded-xl border border-gray-800 shadow-xl text-center ${sizeClasses[size].container}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className={`${sizeClasses[size].spinner} text-red-500`}
            >
              {icon || <Loader2 className="w-full h-full" />}
            </motion.div>
          </div>
          <p className={`text-gray-300 ${sizeClasses[size].text}`}>{text}</p>
        </div>
      </div>
    </div>
  )
}
