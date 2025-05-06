"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, ListMusic, FileText, Sparkles, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const HeroSection = () => {
  const [activeFeature, setActiveFeature] = useState(0)

  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Songs",
      description: "Easily upload and organize your music collection",
    },
    {
      icon: <ListMusic className="w-6 h-6" />,
      title: "Create Playlists",
      description: "Build and manage custom playlists for any mood",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Transcribe Lyrics",
      description: "Automatically generate lyrics from your audio files",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Playlists",
      description: "Generate playlists based on your prompts and preferences",
    },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 z-10 pt-10 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Text content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 px-4 py-1 bg-purple-500/20 text-purple-300 border-purple-500/30 backdrop-blur-sm">
                Your Music, Reimagined
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Manage Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  Music
                </span>{" "}
                With AI{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  Superpowers
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Upload songs, create playlists, transcribe lyrics, and generate AI-powered playlists all in one powerful
                platform designed for music lovers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 h-12 px-8 text-lg">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800/50 h-12 px-8 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right side - Feature showcase */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50"
            >
              {/* Floating music notes decoration */}
              <div className="absolute -top-10 -right-10 w-20 h-20 text-purple-400 opacity-20">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18V5l12-2v13"></path>
                  <path d="M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
                  <path d="M21 16c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
                </svg>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-xl transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                        : "bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/50"
                    }`}
                    animate={{
                      scale: activeFeature === index ? 1.05 : 1,
                      borderColor: activeFeature === index ? "rgba(168, 85, 247, 0.5)" : "rgba(55, 65, 81, 0.3)",
                    }}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div
                      className={`p-3 rounded-lg inline-block mb-4 ${
                        activeFeature === index
                          ? "bg-gradient-to-br from-purple-500/30 to-blue-500/30"
                          : "bg-gray-700/30"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Animated progress indicator */}
              <div className="mt-6 bg-gray-800/50 h-1 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  animate={{ width: `${(activeFeature + 1) * 25}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
