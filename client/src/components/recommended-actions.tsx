import { 
  Card, 
  CardContent 
} from "./ui/card";
import { Separator } from "./ui/separator";
import { MedicalTerm } from "@shared/schema";
import { 
  Info, 
  CheckCircle 
} from "lucide-react";

interface RecommendedActionsProps {
  terms: MedicalTerm[];
}

// Generate recommendations based on identified terms
const generateRecommendations = (terms: MedicalTerm[]) => {
  // Default recommendations for any medical report
  const defaultRecommendations = [
    "Schedule a follow-up appointment with your doctor to discuss your results",
    "Ask your doctor to explain any terms or results you don't understand",
    "Keep a copy of all your medical records for your personal files"
  ];
  
  // Special recommendations based on identified terms
  const specialRecommendations: string[] = [];
  
  // Check for specific conditions and add related recommendations
  const hasHighCholesterol = terms.some(term => 
    (term.term.includes("cholesterol") || term.term === "LDL") && 
    term.status && (term.status === "high" || term.status === "borderline-high")
  );
  
  const hasLowHDL = terms.some(term => 
    term.term === "HDL" && 
    term.status && (term.status === "low" || term.status === "borderline-low")
  );
  
  const hasHighTriglycerides = terms.some(term => 
    term.term === "triglycerides" && 
    term.status && (term.status === "high" || term.status === "borderline-high")
  );
  
  // Add specific recommendations based on identified conditions
  if (hasHighCholesterol || hasLowHDL || hasHighTriglycerides) {
    specialRecommendations.push(
      "Eat heart-healthy foods: fruits, vegetables, whole grains, lean proteins, and healthy fats",
      "Limit saturated and trans fats, which are found in red meat and full-fat dairy products",
      "Exercise regularly - aim for at least 30 minutes of moderate activity most days"
    );
    
    if (hasHighCholesterol) {
      specialRecommendations.push(
        "Consider discussing cholesterol-lowering medications (statins) with your doctor"
      );
    }
  }
  
  // Add any medication-related recommendations
  if (terms.some(term => term.term === "statin therapy")) {
    specialRecommendations.push(
      "Take cholesterol medication (statins) as prescribed by your doctor"
    );
  }
  
  // Check if there's any cardiovascular disease risk mentioned
  if (terms.some(term => term.term === "atherosclerotic cardiovascular disease")) {
    specialRecommendations.push(
      "Discuss your cardiovascular risk factors with your doctor",
      "Consider a heart-healthy diet and regular exercise routine"
    );
  }
  
  // Combine all recommendations, with special ones first
  return [...specialRecommendations, ...defaultRecommendations];
};

// Generate a summary based on the identified terms
const generateSummary = (terms: MedicalTerm[]) => {
  if (!terms.length) return "No medical terms were identified in the report.";
  
  // Check for common conditions
  const hasHighCholesterol = terms.some(term => 
    (term.term.includes("cholesterol") || term.term === "LDL") && 
    term.status && (term.status === "high" || term.status === "borderline-high")
  );
  
  const hasLowHDL = terms.some(term => 
    term.term === "HDL" && 
    term.status && (term.status === "low" || term.status === "borderline-low")
  );
  
  const hasHighTriglycerides = terms.some(term => 
    term.term === "triglycerides" && 
    term.status && (term.status === "high" || term.status === "borderline-high")
  );
  
  // Generate summary based on conditions
  if (hasHighCholesterol || hasLowHDL || hasHighTriglycerides) {
    let summary = "Your results show ";
    
    if (hasHighCholesterol) {
      summary += "higher than recommended levels of cholesterol (particularly LDL or 'bad' cholesterol)";
    }
    
    if (hasLowHDL) {
      if (hasHighCholesterol) summary += " and ";
      summary += "lower than recommended levels of HDL or 'good' cholesterol";
    }
    
    if (hasHighTriglycerides) {
      if (hasHighCholesterol || hasLowHDL) summary += " and ";
      summary += "elevated triglycerides (blood fats)";
    }
    
    summary += ". These results indicate an increased risk for heart disease and may require lifestyle changes";
    
    if (terms.some(term => term.term === "statin therapy")) {
      summary += " and medication";
    }
    
    summary += ".";
    
    return summary;
  }
  
  // Generic summary if no specific conditions are identified
  return "This report contains medical terminology that has been simplified. Follow the recommended steps below and consult with your healthcare provider for a complete interpretation.";
};

export default function RecommendedActions({ terms }: RecommendedActionsProps) {
  if (!terms.length) {
    return null;
  }

  const recommendations = generateRecommendations(terms);
  const summary = generateSummary(terms);

  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">What This Means For You</h2>
        
        <div className="bg-primary-50 border border-primary-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-primary mt-0.5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-primary-800">Summary</h3>
              <div className="mt-2 text-sm text-primary-700">
                <p>{summary}</p>
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="font-medium text-neutral-900 mb-2">Recommended Steps:</h3>
        <ul className="space-y-2 text-neutral-700 mb-4">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-secondary mt-1 mr-2 flex-shrink-0" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
        
        <Separator className="my-4" />
        
        <p className="text-sm text-neutral-500 italic">
          Note: This information is based on your medical report and general guidelines. Always follow your doctor's specific advice and recommendations.
        </p>
      </CardContent>
    </Card>
  );
}
