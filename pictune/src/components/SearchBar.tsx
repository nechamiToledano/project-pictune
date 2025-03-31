"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  initialValue?: string
  className?: string
}

export default function SearchBarDark({
  onSearch,
  placeholder = "Search your music...",
  initialValue = "",
  className = "",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue)

  // Update search query if initialValue changes
  useEffect(() => {
    setSearchQuery(initialValue)
  }, [initialValue])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setSearchQuery("")
    onSearch("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative max-w-md mx-auto md:mx-0 ${className}`}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearch}
        className="pl-10 py-6 bg-black/30 backdrop-blur-md border border-gray-700 rounded-xl shadow-md focus:ring-2 focus:ring-red-100 focus:border-transparent transition-all duration-300 text-white"
      />
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-white/10"
          >
            Clear
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

