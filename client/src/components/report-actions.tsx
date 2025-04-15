import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, AlertCircle, FileText, File } from "lucide-react";
import { MedicalTerm } from "@shared/schema";
import { jsPDF } from "jspdf";

interface ReportActionsProps {
  originalText: string;
  simplifiedText: string;
  identifiedTerms: MedicalTerm[];
  onFileUpload?: (text: string) => void;
}

export default function ReportActions({
  originalText,
  simplifiedText,
  identifiedTerms,
  onFileUpload
}: ReportActionsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError(null);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setUploadError("Only PDF files are supported");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // In a real application, you would use a PDF parsing library here
      // For this demo, we'll simulate reading text from the PDF
      // In a production app, you might use PDF.js or a backend service for this
      
      // Simulate PDF text extraction with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated extracted text
      const extractedText = `This is a simulated text extracted from ${selectedFile.name}. 
      In a real application, we would parse the actual PDF content.
      Blood pressure: 120/80 mmHg
      Cholesterol: 180 mg/dL
      Glucose: 85 mg/dL`;
      
      if (onFileUpload) {
        onFileUpload(extractedText);
      }
      
      toast({
        title: "File uploaded successfully",
        description: `Processed ${selectedFile.name}`,
        variant: "default",
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFile(null);
      
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Failed to process the file. Please try again.");
      
      toast({
        title: "Upload failed",
        description: "There was a problem processing your file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Generate and download PDF
  const handleDownload = async () => {
    if (!simplifiedText) {
      toast({
        title: "No report to download",
        description: "Please process a medical report first",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Medical Report Explanation", 20, 20);
      
      // Add original text section
      doc.setFontSize(14);
      doc.text("Original Medical Report", 20, 30);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Handle text wrapping for original text
      const splitOriginalText = doc.splitTextToSize(originalText, 170);
      doc.text(splitOriginalText, 20, 40);
      
      // Add simplified text section
      let yPos = 40 + splitOriginalText.length * 5;
      doc.setFontSize(14);
      doc.text("Simplified Explanation", 20, yPos);
      doc.setFontSize(10);
      
      // Handle text wrapping for simplified text
      const splitSimplifiedText = doc.splitTextToSize(simplifiedText, 170);
      doc.text(splitSimplifiedText, 20, yPos + 10);
      
      // Add medical terms section
      yPos = yPos + 10 + splitSimplifiedText.length * 5;
      doc.setFontSize(14);
      doc.text("Medical Terms Explained", 20, yPos);
      doc.setFontSize(10);
      
      // Add each term
      yPos += 10;
      identifiedTerms.forEach((term, index) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 150);
        doc.text(`${term.term}:`, 20, yPos);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const explanation = `${term.simplified}`;
        const splitExplanation = doc.splitTextToSize(explanation, 160);
        doc.text(splitExplanation, 30, yPos + 5);
        
        yPos += 15 + (splitExplanation.length - 1) * 5;
        
        // Add new page if needed
        if (yPos > 270 && index < identifiedTerms.length - 1) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Generated by Medical Report Explainer - For educational purposes only.", 20, 290);
      
      // Save the PDF
      doc.save("medical-report-explanation.pdf");
      
      toast({
        title: "PDF downloaded",
        description: "Your medical report explanation has been downloaded",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      
      toast({
        title: "Download failed",
        description: "There was a problem generating your PDF",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="w-full sm:w-1/2">
            <Label htmlFor="pdf-upload" className="text-sm font-medium mb-2 block">
              Upload Medical Report (PDF)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button 
                onClick={handleUpload} 
                disabled={isUploading || !selectedFile}
                variant="outline"
                className="whitespace-nowrap"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            {selectedFile && (
              <div className="mt-2 text-sm text-neutral-500 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </div>
            )}
            {uploadError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="w-full sm:w-1/2 sm:flex sm:justify-end">
            <div className="mt-4 sm:mt-0">
              <Label className="text-sm font-medium mb-2 block">
                Download Explanation Report
              </Label>
              <Button 
                onClick={handleDownload} 
                disabled={isDownloading || !simplifiedText}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              <p className="mt-2 text-xs text-neutral-500">
                Download a PDF report with both original and simplified explanations
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}