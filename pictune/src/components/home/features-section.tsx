import { ImageIcon, Music, Zap, Download, Share2, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: <Music className="h-6 w-6" />,
    title: "Music Library",
    description: "Upload and organize your music collection with easy search and filtering options.",
  },
  {
    icon: <ImageIcon className="h-6 w-6" />,
    title: "AI Cover Generation",
    description:
      "Our AI analyzes your music to create stunning cover art that matches the mood and style of your tracks.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Creation",
    description: "Generate cover art in seconds with our powerful AI engine, no design skills required.",
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Playlist Management",
    description: "Create, customize, and share playlists with friends or keep them private for your enjoyment.",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Easy Sharing",
    description: "Share your music and playlists directly to social media or with friends via link.",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Style Customization",
    description: "Choose from various visual styles and adjust parameters to get the perfect cover art for your music.",
  },
]

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover how Pictune enhances your music experience with AI-generated cover art and more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-800 overflow-hidden group hover:border-gray-700 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600/20 to-blue-600/20 flex items-center justify-center mb-2">
                  <div className="text-red-400">{feature.icon}</div>
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

