"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, ListMusic, FileAudio, Sparkles, ChevronRight, Play, Music, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function HeroSection() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload Songs",
      description: "Easily upload and organize your music collection with our intuitive interface.",
    },
    {
      icon: <ListMusic className="h-6 w-6" />,
      title: "Create Playlists",
      description: "Build and manage custom playlists to suit any mood, activity, or occasion.",
    },
    {
      icon: <FileAudio className="h-6 w-6" />,
      title: "Transcribe Lyrics",
      description: "Automatically generate accurate transcriptions of your favorite songs.",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI Playlist Generation",
      description: "Create personalized playlists based on your prompts and preferences.",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80 z-10"></div>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg.png-UcPa7VqgGtFQIJDlMn6BDcukIwRbFn.webp"
          alt="Background"
          className="w-full h-full object-cover brightness-50 contrast-125"
        />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 opacity-30 z-5 bg-gradient-to-br from-red-600 to-blue-600" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated orbs */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              y: [0, Math.random() * 100 - 50],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute rounded-full bg-gradient-to-r from-red-500/10 to-blue-500/10 blur-xl"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute top-10 left-10 w-64 h-64 rounded-full bg-red-400 opacity-10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-400 opacity-10 blur-3xl"
        />

        <div className="absolute top-20 right-20 text-white/10">
          <Headphones size={80} />
        </div>
        <div className="absolute bottom-20 left-20 text-white/10">
          <Music size={80} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 z-1 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Horizontal lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
              style={{ top: `${15 + i * 20}%` }}
              animate={{
                x: ["-100%", "100%"],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 5,
              }}
            />
          ))}
        </div>

        {/* Vertical lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
              style={{ left: `${20 + i * 30}%` }}
              animate={{
                y: ["-100%", "100%"],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 20 + i * 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 7,
              }}
            />
          ))}
        </div>

        {/* Glowing corner elements */}
        <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-px h-32 bg-gradient-to-b from-transparent via-red-500 to-transparent"
            animate={{ height: [0, 128, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          />
          <motion.div
            className="absolute top-0 right-0 h-px w-32 bg-gradient-to-l from-transparent via-red-500 to-transparent"
            animate={{ width: [0, 128, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          />
        </div>

        <div className="absolute bottom-0 left-0 w-64 h-64 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 w-px h-32 bg-gradient-to-t from-transparent via-blue-500 to-transparent"
            animate={{ height: [0, 128, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, delay: 2 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 h-px w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            animate={{ width: [0, 128, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, delay: 2 }}
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <div className="flex flex-col lg:flex-row items-center gap-12 h-full py-12">
          {/* Left content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-6 px-4 py-1.5 bg-red-500/20 text-red-300 border-red-500/30 backdrop-blur-sm">
                Next-Gen Music Management
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                Your Music,{" "}
                <span className="bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                  Elevated
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Experience a new way to manage, create, and enjoy your music with our powerful suite of AI-enhanced
                tools.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white border-0 h-12 px-8 text-lg">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-white/10 h-12 px-8 text-lg group"
                >
                  <Play className="mr-2 h-4 w-4 group-hover:text-red-400 transition-colors" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right content - Feature showcase */}
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              {/* Illuminated frame */}
              <div className="absolute inset-0 border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-red-600/30 to-blue-600/30" />
              </div>

              <div className="relative bg-black/40 backdrop-blur-md rounded-xl p-8 border border-gray-800">
                <div className="grid grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        "relative p-6 rounded-lg transition-all duration-300 cursor-pointer",
                        activeFeature === index
                          ? "bg-gradient-to-br from-red-500/20 to-blue-500/20 border border-red-500/30 scale-105 z-10"
                          : "bg-black/30 border border-gray-700/30 hover:bg-gray-800/40",
                      )}
                      onClick={() => setActiveFeature(index)}
                      whileHover={{ scale: activeFeature === index ? 1.05 : 1.03 }}
                      animate={
                        activeFeature === index
                          ? {
                              boxShadow: [
                                "0 0 0px rgba(239, 68, 68, 0)",
                                "0 0 15px rgba(239, 68, 68, 0.3)",
                                "0 0 0px rgba(239, 68, 68, 0)",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 2, repeat: activeFeature === index ? Number.POSITIVE_INFINITY : 0 }}
                    >
                      <div
                        className={cn(
                          "p-3 rounded-full inline-flex mb-4",
                          activeFeature === index
                            ? "bg-gradient-to-br from-red-500/30 to-blue-500/30 text-white"
                            : "bg-gray-800/50 text-gray-400",
                        )}
                      >
                        {feature.icon}
                      </div>

                      <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Feature indicator */}
                <div className="mt-8 bg-gray-800/50 h-1 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-blue-500"
                    animate={{ width: `${(activeFeature + 1) * 25}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
