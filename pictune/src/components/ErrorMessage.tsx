"use client"

import type React from "react"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  actionText?: string
  actionFn?: () => void
  actionIcon?: React.ReactNode
}

export default function ErrorMessage({
  title = "Error",
  message,
  onRetry,
  actionText,
  actionFn,
  actionIcon,
}: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl max-w-md text-center border border-gray-800 shadow-xl">
        <div className="text-red-400 mb-4">
          <AlertCircle className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Try Again
            </Button>
          )}
          {actionText && actionFn && (
            <Button onClick={actionFn} variant="outline" className="border-gray-700 text-white hover:bg-white/10">
              {actionIcon && <span className="mr-2">{actionIcon}</span>}
              {actionText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
