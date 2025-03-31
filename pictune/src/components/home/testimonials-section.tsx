import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage } from "../ui/avatar"

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of music lovers who have discovered the magic of Pictune
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Johnson",
              role: "Independent Artist",
              image: "/placeholder.svg?height=200&width=200&text=AJ",
              quote:
                "Pictune has completely transformed my music. The AI-generated cover art perfectly captures the mood of my tracks and helps me stand out.",
            },
            {
              name: "Sarah Chen",
              role: "Music Producer",
              image: "/placeholder.svg?height=200&width=200&text=SC",
              quote:
                "As a producer, I work with many artists who need cover art. Pictune makes it possible to generate stunning visuals with just a few clicks. Absolutely love it!",
            },
            {
              name: "Michael Rodriguez",
              role: "Playlist Curator",
              image: "/placeholder.svg?height=200&width=200&text=MR",
              quote:
                "My playlists have reached a new level since I started using Pictune. The AI-generated covers add exactly the visual impact I was looking for to match my music collections.",
            },
          ].map((testimonial, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2">
                    <AvatarImage src="/logo.png"></AvatarImage>
                  </Avatar>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

