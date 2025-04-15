import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MedicalTerm } from "@shared/schema";
import { Copy, CheckIcon } from "lucide-react";

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

  if (!originalText || !simplifiedText) {
    return null;
  }

  return (
    <section className="mb-6">
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
    </section>
  );
}
