import { useState } from "react";
import { MedicalTerm } from "@shared/schema";
import HeroSection from "@/components/hero-section";
import ReportForm from "@/components/report-form";
import ResultComparison from "@/components/result-comparison";
import DetailedExplanations from "@/components/detailed-explanations";
import RecommendedActions from "@/components/recommended-actions";
import AdditionalResources from "@/components/additional-resources";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeroSection />
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
