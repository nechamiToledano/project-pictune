import { Button } from "../ui/button"

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-red-900/20 to-blue-900/20 border border-gray-800 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Enhance Your Music?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of music lovers who are already using Playform to create stunning visuals for their tracks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white border-0 h-12 px-8 text-lg">
              Upload Your Music
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 h-12 px-8 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
export default CTASection

