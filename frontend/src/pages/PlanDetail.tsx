import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Play } from "lucide-react";
import { useEffect } from "react";
import { usePlanStore } from "../stores/usePlanStore";

const PlanDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { singlePlan, isLoading, getPlanDetails } = usePlanStore();

  useEffect(() => {
    getPlanDetails(id);
  }, [id]);

  const handleStartExercise = (pose) => {
    navigate(`/plan/${id}/exercise/${pose.pose.id}`, { state: { pose } });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // ----------------------------
  //       LOADING STATE
  // ----------------------------
  if (isLoading || !singlePlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <p className="text-xl text-muted-foreground animate-pulse">Loading plan details...</p>
      </div>
    );
  }

  // ----------------------------
  //       NO PLAN FOUND
  // ----------------------------
  if (!singlePlan?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <p className="text-xl text-red-500">Plan not found.</p>
      </div>
    );
  }

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
            <span className="text-sm text-muted-foreground">Plan Details</span>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Plan Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {singlePlan.title}
              </span>
            </h1>

            <div className="flex items-center justify-center space-x-4">
              <p className="text-muted-foreground">
                Created: {new Date(singlePlan.createdAt).toLocaleDateString()}
              </p>

              {/* Optional ACTIVE badge */}
              <Badge variant="default" className="bg-primary text-primary-foreground">
                ACTIVE
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="exercises" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="exercises">Exercises</TabsTrigger>
              <TabsTrigger value="diet">Diet</TabsTrigger>
            </TabsList>

            {/* EXERCISES TAB */}
            <TabsContent value="exercises" className="mt-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Yoga Poses</h2>

                <div className="grid gap-4">
                  {singlePlan.exercises.map((exercise) => {
                    const pose = exercise.pose;

                    return (
                      <Card key={exercise.poseId} className="overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CardTitle className="text-lg">
                                {pose.name_english} ({pose.name_sanskrit})
                              </CardTitle>

                              {exercise.isCompleted && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge className={getDifficultyColor(pose.difficulty)}>
                                {pose.difficulty}
                              </Badge>

                              <Button
                                size="sm"
                                onClick={() => handleStartExercise(exercise)}
                                disabled={exercise.isCompleted}
                                className={exercise.isCompleted ? "opacity-50" : ""}
                              >
                                {exercise.isCompleted ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Completed
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Exercise
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          <CardDescription>
                            Duration: {pose.duration || "Not provided"}
                          </CardDescription>
                        </CardHeader>

                        {/* ACCORDION */}
                        <Accordion type="single" collapsible>
                          <AccordionItem value={`pose-${exercise.poseId}`} className="border-0">
                            <AccordionTrigger className="px-6 pb-4 hover:no-underline">
                              <span className="text-sm font-medium">
                                View Details & Instructions
                              </span>
                            </AccordionTrigger>

                            <AccordionContent className="px-6 pb-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                                  <p className="text-muted-foreground">{pose.benefits?.join(", ")}</p>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-foreground mb-2">Instructions</h4>
                                  <ul className="list-disc pl-4 text-muted-foreground">
                                    {pose.steps?.map((step, index) => (
                                      <li key={index}>{step}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-foreground mb-2">
                                    When NOT to Perform
                                  </h4>
                                  <p className="text-red-600 dark:text-red-400">
                                    {pose.contraindications?.join(", ")}
                                  </p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* DIET TAB */}
            <TabsContent value="diet" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Diet Plan</CardTitle>
                  <CardDescription>
                    Your personalized nutrition plan will be available soon.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-sage/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-lavender/10 rounded-full blur-xl"></div>
      <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-earth/10 rounded-full blur-xl"></div>
    </div>
  );
};

export default PlanDetail;
