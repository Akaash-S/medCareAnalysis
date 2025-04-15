import { useState } from "react";
import { MedicalTerm } from "@shared/schema";
import HeroSection from "@/components/hero-section";
import ReportForm from "@/components/report-form";
import ResultComparison from "@/components/result-comparison";
import DetailedExplanations from "@/components/detailed-explanations";
import RecommendedActions from "@/components/recommended-actions";
import AdditionalResources from "@/components/additional-resources";
import ReportActions from "@/components/report-actions";

export default function Home() {
  const [reportResult, setReportResult] = useState<{
    originalText: string;
    simplifiedText: string;
    identifiedTerms: MedicalTerm[];
    isAnonymized: boolean;
  } | null>(null);

  const handleProcessSuccess = (data: {
    originalText: string;
    simplifiedText: string;
    identifiedTerms: MedicalTerm[];
    isAnonymized: boolean;
  }) => {
    setReportResult(data);
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleFileUpload = (extractedText: string) => {
    // Process the extracted text using the report form
    // In a real application, this would be connected to an API call
    // For now, we'll just set the form value
    
    // Submit the text to be processed
    const processedData = {
      originalText: extractedText,
      simplifiedText: `This is a simplified version of the uploaded file. 
        It would normally be processed by the backend.
        Your blood pressure is normal.
        Cholesterol levels are within normal range.
        Blood glucose is normal.`,
      identifiedTerms: [
        {
          term: "Blood pressure",
          simplified: "How hard your blood pushes against your arteries",
          definition: "Blood pressure is the force of blood pushing against the walls of your arteries as your heart pumps blood.",
          normalRange: "90/60 - 120/80 mmHg",
          value: "120/80 mmHg",
          status: "normal" as "normal"
        },
        {
          term: "Cholesterol",
          simplified: "Fat-like substance in your blood",
          definition: "Cholesterol is a waxy, fat-like substance found in all cells of the body.",
          normalRange: "125-200 mg/dL",
          value: "180 mg/dL",
          status: "normal" as "normal"
        },
        {
          term: "Glucose",
          simplified: "Sugar in your blood",
          definition: "Glucose is a type of sugar that is your body's main source of energy.",
          normalRange: "70-100 mg/dL",
          value: "85 mg/dL",
          status: "normal" as "normal"
        }
      ],
      isAnonymized: true
    };
    
    handleProcessSuccess(processedData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeroSection />
      
      {/* Report Upload/Download Actions */}
      <ReportActions 
        originalText={reportResult?.originalText || ""}
        simplifiedText={reportResult?.simplifiedText || ""}
        identifiedTerms={reportResult?.identifiedTerms || []}
        onFileUpload={handleFileUpload}
      />
      
      <ReportForm onSuccess={handleProcessSuccess} />
      
      {reportResult && (
        <div id="results">
          <ResultComparison 
            originalText={reportResult.originalText}
            simplifiedText={reportResult.simplifiedText}
            identifiedTerms={reportResult.identifiedTerms}
          />
          
          <DetailedExplanations terms={reportResult.identifiedTerms} />
          
          <RecommendedActions terms={reportResult.identifiedTerms} />
          
          <AdditionalResources />
        </div>
      )}
    </div>
  );
}
