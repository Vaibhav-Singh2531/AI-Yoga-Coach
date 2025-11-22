import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo - in real app you'd authenticate
    if (email && password) {

      const user = {email:email , password:password};

      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        credentials: "include",
      })

      const data = await response.json();

      console.log(response);

      if (response.ok) {
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }

    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-foreground hover:bg-sage-light/20 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <div className="text-2xl font-bold text-foreground">
          Zen<span className="text-primary">Flow</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-gradient-card border-sage-light/20 shadow-strong">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Continue your journey to inner peace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background/50 border-sage-light/30 focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border-sage-light/30 focus:border-primary transition-colors pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-sage-light/20"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 shadow-medium hover:shadow-strong transition-all duration-300"
            >
              Sign In
            </Button>
          </form>

          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-sage-light/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-sage-light/30 hover:bg-sage-light/10">
                Google
              </Button>
              <Button variant="outline" className="border-sage-light/30 hover:bg-sage-light/10">
                Apple
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 text-primary hover:underline">
                Sign up here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-sage/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-lavender/20 rounded-full blur-xl"></div>
    </div>
  );
};

export default Login;