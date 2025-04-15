import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MedicalTerm } from "@shared/schema";

interface ReportFormProps {
  onSuccess: (data: {
    originalText: string;
    simplifiedText: string;
    identifiedTerms: MedicalTerm[];
    isAnonymized: boolean;
  }) => void;
}

export default function ReportForm({ onSuccess }: ReportFormProps) {
  const [reportText, setReportText] = useState<string>("");
  const [isAnonymized, setIsAnonymized] = useState<boolean>(false);
  const { toast } = useToast();
  
  const processMutation = useMutation({
    mutationFn: async (data: { originalText: string; isAnonymized: boolean }) => {
      const response = await apiRequest("POST", "/api/process-report", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        onSuccess({
          originalText: data.report.originalText,
          simplifiedText: data.report.simplifiedText,
          identifiedTerms: data.report.identifiedTerms,
          isAnonymized: data.report.isAnonymized
        });
        
        toast({
          title: "Report successfully processed",
          description: "Your medical report has been simplified.",
          variant: "default",
        });
      } else {
        toast({
          title: "Processing failed",
          description: data.message || "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!reportText.trim()) {
      toast({
        title: "Empty report",
        description: "Please enter your medical report text",
        variant: "destructive",
      });
      return;
    }
    
    processMutation.mutate({
      originalText: reportText,
      isAnonymized
    });
  };

  const handleClear = () => {
    setReportText("");
    setIsAnonymized(false);
  };

  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Enter your medical report</h2>
        <div>
          <Textarea 
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="w-full px-3 py-2 text-neutral-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
            rows={8} 
            placeholder="Paste your medical report here..."
          />
          
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <Checkbox
                id="isAnonymized"
                checked={isAnonymized}
                onCheckedChange={(checked) => setIsAnonymized(checked === true)}
                className="h-4 w-4 text-primary border-neutral-300 rounded"
              />
              <label htmlFor="isAnonymized" className="ml-2 block text-sm text-neutral-700">
                Anonymize personal information
              </label>
            </div>
            
            <div>
              <Button
                onClick={handleSubmit}
                disabled={processMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md shadow-sm"
              >
                {processMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Simplify Report"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="ml-3 bg-white text-neutral-700 hover:bg-neutral-50 font-medium py-2 px-4 border border-neutral-300 rounded-md shadow-sm"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
