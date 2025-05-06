import { motion } from "framer-motion"
import { Headphones, AudioWaveform } from "lucide-react"

export default function Background() {
  return (
    <>
    <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80 z-10"></div>
  
  </div>


  {/* Background gradient */}
  <div className="absolute inset-0 opacity-30 z-5 bg-gradient-to-br from-red-600 to-blue-600" />
    {/* Equalizer bars */}
    <div className="absolute bottom-[5%] right-[5%] z-5 flex items-end h-20 space-x-1 opacity-20">
        {[...Array(12)].map((_, i) => {
          const height = Math.floor(Math.random() * 100)
          return (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-red-500 to-blue-500"
              initial={{ height: 5 }}
              animate={{ height: [5, height, 5] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.1,
              }}
            />
          )
        })}
      </div>
      {/* Floating Decorations */}
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

        <div className="absolute top-20 right-20 text-white/10">
          <Headphones size={80} />
        </div>
        <div className="absolute bottom-20 left-20 text-white/10">
          <AudioWaveform size={80} />
        </div>
      </div>
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
        <div className="absolute top-20 right-20 text-white/10">
          <Headphones size={80} />
        </div>
        <div className="absolute bottom-20 left-20 text-white/10">
          <AudioWaveform size={80} />
        </div>
      </div>
    </>
  )
}
