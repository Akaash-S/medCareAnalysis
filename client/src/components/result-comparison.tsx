import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MedicalTerm } from "@shared/schema";
import { Copy, CheckIcon, BarChart2, Volume2 } from "lucide-react";
import VoiceReader from "./voice-reader";
import DataVisualization from "./data-visualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResultComparisonProps {
  originalText: string;
  simplifiedText: string;
  identifiedTerms: MedicalTerm[];
}

export default function ResultComparison({ 
  originalText, 
  simplifiedText,
  identifiedTerms 
}: ResultComparisonProps) {
  const [originalCopied, setOriginalCopied] = useState(false);
  const [simplifiedCopied, setSimplifiedCopied] = useState(false);
  const [showTools, setShowTools] = useState(true);

  const copyToClipboard = async (text: string, type: 'original' | 'simplified') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'original') {
        setOriginalCopied(true);
        setTimeout(() => setOriginalCopied(false), 2000);
      } else {
        setSimplifiedCopied(true);
        setTimeout(() => setSimplifiedCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Function to highlight medical terms in original text
  const highlightOriginalTerms = () => {
    if (!originalText || identifiedTerms.length === 0) return originalText;
    
    let highlightedText = originalText;
    const sortedTerms = [...identifiedTerms].sort((a, b) => b.term.length - a.term.length);
    
    sortedTerms.forEach(term => {
      const regex = new RegExp(`\\b${term.term}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span class="font-semibold text-primary-700">$&</span>`
      );
    });
    
    return highlightedText;
  };
  
  // Function to highlight simplified terms
  const highlightSimplifiedTerms = () => {
    if (!simplifiedText || identifiedTerms.length === 0) return simplifiedText;
    
    let highlightedText = simplifiedText;
    const sortedTerms = [...identifiedTerms].sort((a, b) => b.simplified.length - a.simplified.length);
    
    sortedTerms.forEach(term => {
      const regex = new RegExp(`\\b${term.simplified}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span class="font-semibold text-secondary-700">$&</span>`
      );
    });
    
    return highlightedText;
  };

  const toggleTools = () => {
    setShowTools(prev => !prev);
  };

  if (!originalText || !simplifiedText) {
    return null;
  }

  return (
    <section className="mb-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Report */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-neutral-900">Original Report</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(originalText, 'original')}
                className="text-neutral-500 hover:text-neutral-700"
              >
                {originalCopied ? <CheckIcon className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div 
              className="prose max-w-none text-neutral-700"
              dangerouslySetInnerHTML={{ __html: highlightOriginalTerms() }}
            />
          </CardContent>
        </Card>
        
        {/* Simplified Report */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-neutral-900">Simplified Explanation</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(simplifiedText, 'simplified')}
                className="text-neutral-500 hover:text-neutral-700"
              >
                {simplifiedCopied ? <CheckIcon className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div 
              className="prose max-w-none text-neutral-700"
              dangerouslySetInnerHTML={{ __html: highlightSimplifiedTerms() }}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Visual and Audio Tools */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Analysis Tools</h2>
        <Button 
          variant="outline" 
          onClick={toggleTools}
          className="text-sm"
        >
          {showTools ? "Hide Tools" : "Show Tools"}
        </Button>
      </div>
      
      {showTools && (
        <Tabs defaultValue="visualization" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Data Visualization</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>Voice Reader</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="mt-4">
            <DataVisualization terms={identifiedTerms} />
          </TabsContent>
          
          <TabsContent value="voice" className="mt-4">
            <VoiceReader 
              originalText={originalText}
              simplifiedText={simplifiedText}
              identifiedTerms={identifiedTerms}
              useSimplified={true}
            />
          </TabsContent>
        </Tabs>
      )}
      
      {/* Medical Terms Section */}
      {identifiedTerms.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Identified Medical Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {identifiedTerms.map((term, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-primary-700">{term.term}</h3>
                  <p className="text-neutral-600 text-sm">{term.definition}</p>
                  <p className="mt-2 font-medium">Simplified: <span className="text-secondary-700">{term.simplified}</span></p>
                  {term.normalRange && (
                    <p className="text-xs text-neutral-500 mt-1">Normal Range: {term.normalRange}</p>
                  )}
                  {term.value && (
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-neutral-500">Value: {term.value}</span>
                      {term.status && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          term.status === 'normal' 
                            ? 'bg-green-100 text-green-800' 
                            : term.status === 'high' || term.status === 'borderline-high'
                            ? 'bg-red-100 text-red-800'
                            : term.status === 'low' || term.status === 'borderline-low'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {term.status.replace('-', ' ')}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
