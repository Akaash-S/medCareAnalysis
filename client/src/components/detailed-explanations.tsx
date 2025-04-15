import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "./ui/accordion";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MedicalTerm } from "@shared/schema";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface DetailedExplanationsProps {
  terms: MedicalTerm[];
}

export default function DetailedExplanations({ terms }: DetailedExplanationsProps) {
  const [displayCount, setDisplayCount] = useState(3);
  
  if (!terms.length) {
    return null;
  }

  const visibleTerms = terms.slice(0, displayCount);
  const hasMoreTerms = terms.length > displayCount;

  // Function to determine the badge variant based on status
  const getBadgeVariant = (status?: string) => {
    if (!status) return "default";
    return status as "high" | "low" | "normal" | "borderline-high" | "borderline-low" | "abnormal";
  };

  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Medical Terms Explained</h2>
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {visibleTerms.map((term, index) => (
              <AccordionItem 
                key={index} 
                value={`term-${index}`}
                className="border border-neutral-200 rounded-md p-4 mb-4 overflow-hidden"
              >
                <AccordionTrigger className="font-medium text-neutral-900 hover:no-underline">
                  {term.term}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-neutral-700 mt-2">{term.definition}</p>
                  
                  {(term.normalRange || term.value) && (
                    <div className="mt-2 pt-2 border-t border-neutral-100">
                      {term.normalRange && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-neutral-500">Normal range:</span>
                          <span className="ml-2 text-sm text-neutral-700">{term.normalRange}</span>
                        </div>
                      )}
                      
                      {term.value && (
                        <div className="flex items-center mt-1">
                          <span className="text-sm font-medium text-neutral-500">Your value:</span>
                          <div className="ml-2 text-sm">
                            <Badge variant={getBadgeVariant(term.status)}>
                              {term.value} {term.status && `(${term.status.replace('-', ' ')})`}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {hasMoreTerms && (
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                className="text-primary hover:text-primary/80 font-medium"
                onClick={() => setDisplayCount(terms.length)}
              >
                View All Terms <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
          
          {!hasMoreTerms && terms.length > 3 && (
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                className="text-primary hover:text-primary/80 font-medium"
                onClick={() => setDisplayCount(3)}
              >
                Show Less
              </Button>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link href="/dictionary">
              <Button 
                variant="outline" 
                className="text-primary hover:bg-primary/10 border-primary/20"
              >
                Browse Full Medical Dictionary
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
