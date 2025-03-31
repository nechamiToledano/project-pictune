import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for beginners",
    features: [
      "5 image-to-music conversions per month",
      "Standard quality audio",
      "Basic style options",
      "MP3 downloads",
      "Community support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For serious creators",
    features: [
      "50 image-to-music conversions per month",
      "High quality audio",
      "Advanced style customization",
      "MP3 & WAV downloads",
      "Priority support",
      "No watermarks",
    ],
    cta: "Upgrade Now",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "per month",
    description: "For professional use",
    features: [
      "Unlimited image-to-music conversions",
      "Premium quality audio",
      "Full style customization",
      "All audio formats",
      "Dedicated support",
      "API access",
      "Commercial license",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 to-blue-900/5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Start for free or upgrade for more features and higher quality outputs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`border ${
                plan.highlighted
                  ? "border-red-500 bg-gradient-to-b from-red-900/20 to-blue-900/20"
                  : "border-gray-800 bg-gray-900/50"
              } relative overflow-hidden`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600/20 to-blue-600/20 text-white text-xs font-bold py-1 text-center">
                  MOST POPULAR
                </div>
              )}
              <CardHeader className={plan.highlighted ? "pt-8" : ""}>
                <CardTitle>{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-3 w-3 text-white"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection

