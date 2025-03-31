import { Music } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-xl flex items-center gap-3">
        <div className="animate-spin">
          <Music className="h-8 w-8" />
        </div>
        Loading...
      </div>
    </div>
  )
}
