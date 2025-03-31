import { Button } from "@/components/ui/button"

interface NotFoundScreenProps {
  navigate: (path: string) => void
}

export default function NotFoundScreen({ navigate }: NotFoundScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl max-w-md text-center border border-gray-800">
        <div className="text-yellow-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Not Found</h2>
        <p className="text-gray-400">The item you're looking for could not be found.</p>
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
