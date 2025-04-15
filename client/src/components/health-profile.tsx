import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Activity, Heart, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { HealthData, MedicalTerm } from "@shared/schema";

interface HealthProfileProps {
  userId: number;
}

export default function HealthProfile({ userId }: HealthProfileProps) {
  const [activeTab, setActiveTab] = useState("insights");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [healthDataForm, setHealthDataForm] = useState<Partial<HealthData>>({
    age: undefined,
    gender: "",
    height: undefined,
    weight: undefined,
    knownConditions: [],
    medications: [],
    allergies: [],
    bloodType: "",
  });
  
  // Query to fetch health profile
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['/api/user', userId, 'health-profile'],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", `/api/user/${userId}/health-profile`);
        const data = await response.json();
        if (data.success) {
          // Update form with existing data
          setHealthDataForm(data.profile.healthData || {});
          return data.profile;
        }
        return null;
      } catch (error) {
        // Return null if profile doesn't exist
        return null;
      }
    },
    enabled: !!userId,
  });
  
  // Query to fetch recent reports
  const { data: recentReportsData } = useQuery({
    queryKey: ['/api/user', userId, 'recent-reports'],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/user/${userId}/recent-reports?limit=3`);
      const data = await response.json();
      return data.success ? data.reports : [];
    },
    enabled: !!userId,
  });
  
  // Mutation to update health profile
  const updateProfileMutation = useMutation({
    mutationFn: async (healthData: Partial<HealthData>) => {
      const response = await apiRequest("POST", `/api/user/${userId}/health-profile`, healthData);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['/api/user', userId, 'health-profile'] });
        toast({
          title: "Profile updated",
          description: "Your health profile has been updated successfully.",
          variant: "default",
        });
      } else {
        toast({
          title: "Update failed",
          description: data.message || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(healthDataForm);
  };
  
  // Handle input changes
  const handleInputChange = (field: keyof HealthData, value: any) => {
    setHealthDataForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle comma-separated string inputs for arrays
  const handleArrayInput = (field: keyof HealthData, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setHealthDataForm(prev => ({
      ...prev,
      [field]: array
    }));
  };
  
  // Generate insights based on health profile and recent terms
  const generateInsights = () => {
    if (!profileData?.healthData) {
      return (
        <div className="text-center py-8">
          <p className="text-neutral-500">Complete your health profile to get personalized insights.</p>
          <Button 
            onClick={() => setActiveTab("profile")} 
            variant="outline" 
            className="mt-4"
          >
            Complete Profile
          </Button>
        </div>
      );
    }
    
    const { healthData } = profileData;
    const insights: Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low' }> = [];
    
    // Generate BMI insight if height and weight are available
    if (healthData.height && healthData.weight) {
      const heightInMeters = healthData.height / 100;
      const bmi = healthData.weight / (heightInMeters * heightInMeters);
      let bmiCategory = '';
      let priority: 'high' | 'medium' | 'low' = 'low';
      
      if (bmi < 18.5) {
        bmiCategory = 'underweight';
        priority = 'medium';
      } else if (bmi < 25) {
        bmiCategory = 'healthy weight';
        priority = 'low';
      } else if (bmi < 30) {
        bmiCategory = 'overweight';
        priority = 'medium';
      } else {
        bmiCategory = 'obese';
        priority = 'high';
      }
      
      insights.push({
        title: `Your BMI is ${bmi.toFixed(1)}`,
        description: `This places you in the ${bmiCategory} category. ${
          priority !== 'low' 
            ? 'Consider discussing weight management strategies with your healthcare provider.' 
            : 'Maintain your healthy habits!'
        }`,
        priority
      });
    }
    
    // Generate insights based on recent medical terms
    const recentTerms = healthData.recentTerms || [];
    
    // Check for cholesterol concerns
    const cholesterolTerms = recentTerms.filter(term => 
      term.term.includes('cholesterol') || term.term === 'LDL' || term.term === 'HDL'
    );
    
    if (cholesterolTerms.length > 0) {
      const abnormalCholesterol = cholesterolTerms.some(term => 
        term.status === 'high' || term.status === 'low' || term.status === 'abnormal'
      );
      
      if (abnormalCholesterol) {
        insights.push({
          title: "Cholesterol management may be needed",
          description: "Your recent reports show cholesterol levels outside the optimal range. Consider discussing diet, exercise, and medication options with your doctor.",
          priority: 'high'
        });
      }
    }
    
    // Check for blood pressure concerns
    if (recentTerms.some(term => term.term === 'hypertension')) {
      insights.push({
        title: "Blood pressure monitoring recommended",
        description: "Your medical history indicates hypertension. Regular blood pressure monitoring and medication adherence are important.",
        priority: 'high'
      });
    }
    
    // Add general insights based on age
    if (healthData.age) {
      if (healthData.age >= 45) {
        insights.push({
          title: "Regular health screenings are important",
          description: "Based on your age, regular screenings for conditions like colorectal cancer, heart disease, and diabetes are recommended.",
          priority: 'medium'
        });
      }
    }
    
    // If no specific insights, add a general one
    if (insights.length === 0) {
      insights.push({
        title: "Keep up with regular check-ups",
        description: "Continue with annual health check-ups to monitor your health status.",
        priority: 'low'
      });
    }
    
    return (
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-md ${
              insight.priority === 'high' 
                ? 'bg-red-50 border border-red-200' 
                : insight.priority === 'medium'
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-green-50 border border-green-200'
            }`}
          >
            <h3 className={`font-medium ${
              insight.priority === 'high' 
                ? 'text-red-800' 
                : insight.priority === 'medium'
                ? 'text-yellow-800'
                : 'text-green-800'
            }`}>{insight.title}</h3>
            <p className={`mt-1 text-sm ${
              insight.priority === 'high' 
                ? 'text-red-700' 
                : insight.priority === 'medium'
                ? 'text-yellow-700'
                : 'text-green-700'
            }`}>{insight.description}</p>
          </div>
        ))}
      </div>
    );
  };
  
  // Display recent terms
  const renderRecentTerms = () => {
    const recentTerms = profileData?.healthData?.recentTerms || [];
    
    if (recentTerms.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-neutral-500">No recent medical terms found.</p>
        </div>
      );
    }
    
    // Group terms by status
    const groupedTerms: Record<string, MedicalTerm[]> = {
      'abnormal': [],
      'normal': [],
      'other': []
    };
    
    recentTerms.forEach(term => {
      if (term.status === 'high' || term.status === 'low' || term.status === 'abnormal') {
        groupedTerms.abnormal.push(term);
      } else if (term.status === 'normal') {
        groupedTerms.normal.push(term);
      } else {
        groupedTerms.other.push(term);
      }
    });
    
    return (
      <div className="space-y-6">
        {groupedTerms.abnormal.length > 0 && (
          <div>
            <h3 className="font-medium text-red-800 mb-2">Needs Attention</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupedTerms.abnormal.map((term, idx) => (
                <div key={idx} className="border border-red-200 rounded-md p-3 bg-red-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-neutral-900">{term.term}</p>
                      <p className="text-sm text-neutral-600">{term.simplified}</p>
                    </div>
                    {term.status && (
                      <Badge variant={term.status as any}>
                        {term.value} ({term.status.replace('-', ' ')})
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {groupedTerms.normal.length > 0 && (
          <div>
            <h3 className="font-medium text-green-800 mb-2">Normal Range</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupedTerms.normal.map((term, idx) => (
                <div key={idx} className="border border-green-200 rounded-md p-3 bg-green-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-neutral-900">{term.term}</p>
                      <p className="text-sm text-neutral-600">{term.simplified}</p>
                    </div>
                    {term.status && (
                      <Badge variant="normal">
                        {term.value} (normal)
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {groupedTerms.other.length > 0 && (
          <div>
            <h3 className="font-medium text-neutral-800 mb-2">Other Terms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupedTerms.other.map((term, idx) => (
                <div key={idx} className="border border-neutral-200 rounded-md p-3 bg-neutral-50">
                  <p className="font-semibold text-neutral-900">{term.term}</p>
                  <p className="text-sm text-neutral-600">{term.simplified}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-10 bg-neutral-200 rounded"></div>
            <div className="h-20 bg-neutral-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Personal Health Insights</h2>
        
        <Tabs defaultValue="insights" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Health History</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="pt-4">
            {generateInsights()}
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-neutral-900 mb-3">Recent Medical Terms</h3>
                {renderRecentTerms()}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-neutral-900 mb-3">Recent Reports</h3>
                {recentReportsData?.length ? (
                  <div className="space-y-3">
                    {recentReportsData.map((report) => (
                      <div key={report.id} className="border border-neutral-200 rounded-md p-3">
                        <p className="font-medium">
                          Report from {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                          {report.originalText.substring(0, 100)}...
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-center py-4">No recent reports available.</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={healthDataForm.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || '')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={healthDataForm.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={healthDataForm.height || ''}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value) || '')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={healthDataForm.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || '')}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                <Input
                  id="bloodType"
                  value={healthDataForm.bloodType || ''}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="knownConditions">Known Medical Conditions (comma-separated)</Label>
                <Input
                  id="knownConditions"
                  value={healthDataForm.knownConditions?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('knownConditions', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="medications">Current Medications (comma-separated)</Label>
                <Input
                  id="medications"
                  value={healthDataForm.medications?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('medications', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                <Input
                  id="allergies"
                  value={healthDataForm.allergies?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('allergies', e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}