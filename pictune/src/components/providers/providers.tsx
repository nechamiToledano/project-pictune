"use client"

import type React from "react"
import { ToastProvider } from "./toast-provider"


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  )
}

