import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { Heart, Users, Clock, Star } from "lucide-react";
import yogaHero from "@/assets/yoga-hero.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "Mindful Practice",
      description: "Connect with your inner self through guided meditation and breathing exercises"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Learn from certified yoga instructors with years of experience"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Practice anytime, anywhere with our 24/7 digital platform"
    },
    {
      icon: Star,
      title: "Personal Growth",
      description: "Track your progress and achieve your wellness goals"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="text-2xl font-bold text-foreground">
          Zen<span className="text-primary">Flow</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Find Your
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Inner Peace
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your mind, body, and spirit with our AI-powered yoga instructor. 
                Experience personalized guidance on your journey to wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/login")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-medium hover:shadow-strong transition-all duration-300"
                >
                  Start Your Journey
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-strong">
                <img 
                  src={yogaHero} 
                  alt="Peaceful yoga meditation scene" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full blur-xl opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-lavender/30 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose ZenFlow?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our digital yoga instructor combines ancient wisdom with modern technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-gradient-card border-sage-light/20 shadow-soft hover:shadow-medium transition-all duration-300 group">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Begin Your Transformation?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of practitioners who have found balance and peace through our platform
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg shadow-medium hover:shadow-strong transition-all duration-300"
          >
            Get Started Today
          </Button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white rounded-full"></div>
        </div>
      </section>
    </div>
  );
};

export default Landing;