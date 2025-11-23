import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CompareItLive from "@/components/compareItLive";
import { usePlanStore } from "../stores/usePlanStore";
import { useEffect } from "react";


const ExerciseView = () => {
  const { angles, isLoading, refPose } = usePlanStore();


  const navigate = useNavigate();
  const {
    planId,
    poseId
  } = useParams();
  const location = useLocation();
  const pose = location.state?.pose;

  useEffect(() => {
    refPose(poseId);
  },[]);

  useEffect(() => {
    // console.log("Angles: ",angles);
  })

  console.log("POSSSEEEEEEEEEEEEEEEEE",pose);
  console.log("POSSSEEEEE",pose.poseId);

  if (!pose) {
    return <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Exercise data not found</p>
            <Button onClick={() => navigate(`/plan/${planId}`)} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  if (!angles) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground text-lg">Loading your Pose...</p>
      </div>
    );
  }

  return <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-sage-light/20 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/plan/${planId}`)} className="hover:bg-sage-light/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{pose.pose.name_english}</h1>
              <p className="text-sm text-muted-foreground">Duration: {pose.pose.duration}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Camera Feed with Pose Comparison */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <CompareItLive planId={planId} poseId={poseId} />
            </CardContent>
          </Card>

          {/* Reference Pose */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reference Pose</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-sage-light/20 rounded-lg flex items-center justify-center">
                {/* <p className="text-muted-foreground text-sm">Pose illustration</p> */}
                <img src={pose.pose.image_url} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Steps to Perform */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How to Perform</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Instructions</h4>
              <p className="text-sm text-muted-foreground">{pose.pose.steps}</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Benefits</h4>
              <p className="text-sm text-muted-foreground">{pose.pose.benefits}</p>
            </div>

            <div className="pt-2 border-t">
              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">⚠️ Contraindications</h4>
              <p className="text-sm text-muted-foreground">{pose.pose.contraindications}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>;
};
export default ExerciseView;