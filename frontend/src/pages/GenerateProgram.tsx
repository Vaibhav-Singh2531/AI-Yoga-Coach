import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, ArrowLeft, Video, Mic, MicOff } from "lucide-react";
import { useState } from "react";
import Chatbot from "@/components/Chatbot";

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

  const userId = localStorage.getItem("userId");

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
      <main className="container mx-auto px-6 py-12 ">
        <Chatbot user_id={userId} />
      </main>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-sage/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-lavender/10 rounded-full blur-xl"></div>
      <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-earth/10 rounded-full blur-xl"></div>
    </div>
  );
};

export default GenerateProgram;