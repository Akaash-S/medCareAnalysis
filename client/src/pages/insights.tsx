import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HealthProfile from "@/components/health-profile";
import { useToast } from "@/hooks/use-toast";

export default function Insights() {
  // For this demo, using a mock user
  // In a real application, this would come from an authentication system
  const mockUserId = 1;
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLoginDemo = () => {
    setIsLoggedIn(true);
    toast({
      title: "Demo Login",
      description: "You've been logged in with a demo account for testing.",
      variant: "default",
    });
  };
  
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Personalized Health Insights</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-neutral-500">
            Log in to see your personalized health insights based on your reports.
          </p>
        </div>
        
        <Card className="max-w-md mx-auto bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Access Your Insights</h2>
            <p className="mb-6 text-neutral-600">
              Sign in to view your personalized health insights, saved reports, and manage your health profile.
            </p>
            <Button 
              onClick={handleLoginDemo}
              className="bg-primary hover:bg-primary/90 w-full">
              Continue with Demo Account
            </Button>
            <p className="mt-4 text-sm text-neutral-500">
              This is a demo version. No actual account will be created.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Personalized Health Insights</h1>
        <p className="mt-3 max-w-2xl text-xl text-neutral-500">
          Your health information and personalized insights based on your medical reports.
        </p>
      </div>
      
      <Tabs defaultValue="health" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="health">Health Profile</TabsTrigger>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="health">
          <HealthProfile userId={mockUserId} />
        </TabsContent>
        
        <TabsContent value="reports">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Your Medical Reports</h2>
              
              <div className="text-center py-10">
                <p className="text-neutral-500 mb-4">No reports yet. Get started by uploading a medical report.</p>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/"}>
                  Simplify a Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}