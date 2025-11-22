import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, ArrowLeft, Video, Mic, MicOff } from "lucide-react";
import { useState } from "react";

const GenerateProgram = () => {
  const navigate = useNavigate();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    // Redirect back to dashboard after ending call
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-sage-light/20 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-sage-light/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-2xl font-bold text-foreground">
              Zen<span className="text-primary">Flow</span>
            </div>
            <span className="text-sm text-muted-foreground">Generate Program</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-sage-light/20"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-sage-light/20"
            >
              <User className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-sage-light/30 hover:bg-sage-light/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">
              Generate Your
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                FITNESS PROGRAM
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a voice conversation with our AI assistant to create your personalized plan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* AI Instructor Card */}
              <Card className="bg-gradient-card border-sage-light/20 shadow-medium">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-primary">ZenFlow AI</CardTitle>
                  <CardDescription className="text-center">
                    Fitness & Yoga Coach
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="p-4 bg-sage-light/10 rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      {isCallActive ? "Connected" : "Waiting..."}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* User Card */}
              <Card className="bg-gradient-card border-sage-light/20 shadow-medium">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-secondary-foreground" />
                    </div>
                  </div>
                  <CardTitle className="text-center">You</CardTitle>
                  <CardDescription className="text-center">
                    Ready to start your fitness journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="p-4 bg-sage-light/10 rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      {isCallActive ? "Ready" : "Ready"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call Controls */}
            <div className="mt-12 space-y-6">
              {!isCallActive ? (
                <Button
                  onClick={handleStartCall}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg"
                  size="lg"
                >
                  Start Call
                </Button>
              ) : (
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                    className="w-12 h-12 rounded-full"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleEndCall}
                    className="px-8 py-3"
                  >
                    End Call
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-sage/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-lavender/10 rounded-full blur-xl"></div>
      <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-earth/10 rounded-full blur-xl"></div>
    </div>
  );
};

export default GenerateProgram;