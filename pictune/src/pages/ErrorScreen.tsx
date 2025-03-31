import { Button } from "@/components/ui/button"

interface ErrorScreenProps {
  error: string
  navigate: (path: string) => void
}

export default function ErrorScreen({ error, navigate }: ErrorScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl max-w-md text-center border border-gray-800">
        <div className="text-red-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Error</h2>
        <p className="text-gray-400">{error}</p>
        <Button
          onClick={() => navigate("/")}
          className="mt-4 bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}
