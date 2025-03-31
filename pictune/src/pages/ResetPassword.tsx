"use client"

import { useState } from "react"
import {  useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Headphones, AudioWaveform } from "lucide-react"
import api from "@/components/Api"

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token')?.trim();
  const email = searchParams.get('email')?.trim();

  const handlePasswordReset = async () => {
    setError(null)

    if (!newPassword) {
      setError("Please enter a new password.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setLoading(true)

    try {
      const response = await api.post("/email/reset-password", {
        Email: email,
        Token: token,
        NewPassword: newPassword,
      })

      if (response.status === 200) {
        setSuccess(true)
        toast.success("Password reset successfully! Please log in with your new password.")
        setTimeout(() => {
          navigate("/signin")
        }, 3000)
      } else {
         throw new Error(response.data.message || "Failed to reset password.")
       
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to reset password."
      setError(errorMessage)
      toast.error(errorMessage)

    } finally {
      setLoading(false)
      navigate("/signin")
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-black via-black/90 to-black/80">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80 z-10"></div>
        <img
          src="/bg.png?height=1080&width=1920&text=Music+Background"
          alt="Background"
          className="w-full h-full object-cover brightness-50 contrast-125"
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute top-10 left-10 w-64 h-64 rounded-full bg-red-400 opacity-10 blur-3xl"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-400 opacity-10 blur-3xl"
        ></motion.div>

        {/* Music decoration */}
        <div className="absolute top-20 right-20 text-red-300 opacity-10">
          <Headphones size={60} />
        </div>
        <div className="absolute bottom-20 left-20 text-blue-300 opacity-10">
          <AudioWaveform size={60} />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 z-10 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="bg-black/30 backdrop-blur-md rounded-xl border border-gray-800 shadow-xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-blue-500"></div>
            <div className="p-6">
              {!email || !token ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-red-500/10 p-4 rounded-full">
                      <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Invalid Reset Link</h3>
                  <p className="text-gray-400 mb-6">
                    The password reset link is invalid or has expired. Please request a new password reset link.
                  </p>
                  <Button
                    onClick={() => navigate("/signin")}
                    className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white rounded-xl py-6 px-8"
                  >
                    Return to Sign In
                  </Button>
                </div>
              ) : success ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-500/10 p-4 rounded-full">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Password Reset Successful!</h3>
                  <p className="text-gray-400 mb-6">
                    Your password has been reset successfully. You will be redirected to the sign in page shortly.
                  </p>
                  <Button
                    onClick={() => navigate("/signin")}
                    className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white rounded-xl py-6 px-8"
                  >
                    Sign In Now
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <button
                      onClick={() => navigate("/signin")}
                      className="flex items-center text-gray-400 hover:text-white transition-colors"
                      type="button"
                    >
                      <ArrowLeft size={16} className="mr-1" />
                      Back to Sign In
                    </button>
                  </div>

                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Reset Your Password</h2>
                    <p className="text-gray-400">Enter a new password for your account</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-white">
                        New Password
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter your new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10 py-6 bg-black/30 backdrop-blur-md border border-gray-700 rounded-xl shadow-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-white"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 py-6 bg-black/30 backdrop-blur-md border border-gray-700 rounded-xl shadow-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-white"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 text-red-400 text-sm mt-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <Button
                      onClick={handlePasswordReset}
                      disabled={loading}
                      className="w-full py-6 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

