import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, Bot, Plus } from "lucide-react";
import { useEffect } from "react";
import { usePlanStore } from "../stores/usePlanStore";

const Dashboard = () => {
  const navigate = useNavigate();

  const { totalPlans, isLoading, loadData } = usePlanStore();

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleCreateProgram = () => {
    navigate("/generate-program");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground text-lg">Loading your dashboard...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-sage-light/20 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-foreground">
              Zen<span className="text-primary">Flow</span>
            </div>
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-sage-light/20">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-sage-light/20">
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
        {(totalPlans && totalPlans.length > 0) ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">
                Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Fitness Plans
                </span>
              </h1>
              <p className="text-muted-foreground">
                Total: {totalPlans.length}
              </p>
            </div>

            <div className="grid gap-4">
              {totalPlans.map((plan) => (
                <Card
                  key={plan._id}
                  className={`p-6 border-2 transition-all duration-200 hover:shadow-medium cursor-pointer 
                  border-border hover:border-primary/50`}
                  onClick={() => navigate(`/plan/${plan._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold text-foreground">
                        {plan.title} –{" "}
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </div>

                      {/* You can replace this with real "active" field if you have it */}
                      {plan?.isActive && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          ACTIVE
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center pt-8">
              <Button
                onClick={handleCreateProgram}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Program
              </Button>
            </div>
          </div>
        ) : (
          // No programs UI
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">
                Welcome to Your
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  AI Yoga Instructor
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                You haven't created any program yet
              </p>
            </div>

            <Card className="bg-gradient-card border-sage-light/20 shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                  <Bot className="h-6 w-6 text-primary" />
                  <span>Generate Your First Program</span>
                </CardTitle>
                <CardDescription>
                  Have a conversation with our AI assistant to create your personalized plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                    <Bot className="h-12 w-12 text-primary" />
                  </div>
                </div>

                <Button
                  onClick={handleCreateProgram}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Bot className="h-5 w-5 mr-2" />
                  Chat with AI Instructor
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-sage/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-lavender/10 rounded-full blur-xl"></div>
      <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-earth/10 rounded-full blur-xl"></div>
    </div>
  );
};

export default Dashboard;
