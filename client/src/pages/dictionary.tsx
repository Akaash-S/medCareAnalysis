import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { medicalDictionary } from "@shared/medical-dictionary";

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTerms, setFilteredTerms] = useState<string[]>([]);

  // Initialize with all terms
  useEffect(() => {
    setFilteredTerms(Object.keys(medicalDictionary));
  }, []);

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredTerms(Object.keys(medicalDictionary));
    } else {
      const filtered = Object.keys(medicalDictionary).filter(term => 
        term.toLowerCase().includes(value) || 
        medicalDictionary[term].simplified.toLowerCase().includes(value) ||
        medicalDictionary[term].definition.toLowerCase().includes(value)
      );
      setFilteredTerms(filtered);
    }
  };

  // Group terms alphabetically
  const groupTerms = () => {
    const groups: Record<string, string[]> = {};
    
    filteredTerms.forEach(term => {
      const firstLetter = term[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });
    
    // Sort each group
    Object.keys(groups).forEach(letter => {
      groups[letter].sort();
    });
    
    return groups;
  };

  const termGroups = groupTerms();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Medical Dictionary</h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-neutral-500">
          Browse our comprehensive collection of medical terms and their simplified explanations.
        </p>
      </div>
      
      <Card className="bg-white shadow-sm mb-8">
        <CardContent className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <Input
              type="search"
              placeholder="Search for a medical term..."
              className="pl-10 py-3"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="mt-4 text-sm text-neutral-500">
            {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'} found
          </div>
        </CardContent>
      </Card>
      
      {filteredTerms.length === 0 ? (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 text-center py-10">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No terms found</h3>
            <p className="text-neutral-500">Try adjusting your search or browse all terms by clearing the search.</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setFilteredTerms(Object.keys(medicalDictionary));
              }}
              className="mt-4"
            >
              Show All Terms
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <Accordion type="single" collapsible>
              {Object.keys(termGroups).sort().map(letter => (
                <div key={letter}>
                  <h2 className="text-xl font-bold text-neutral-900 mb-3">{letter}</h2>
                  
                  {termGroups[letter].map((term, index) => (
                    <AccordionItem 
                      key={term} 
                      value={term}
                      className="border border-neutral-200 rounded-md p-4 mb-3"
                    >
                      <AccordionTrigger className="font-medium text-neutral-900 hover:no-underline">
                        <div className="flex flex-col items-start text-left">
                          <span>{medicalDictionary[term].term}</span>
                          <span className="text-sm text-secondary-600">{medicalDictionary[term].simplified}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mt-2">
                          <p className="text-neutral-700">{medicalDictionary[term].definition}</p>
                          
                          {medicalDictionary[term].normalRange && (
                            <div className="mt-3 pt-3 border-t border-neutral-100">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-neutral-500">Normal range:</span>
                                <span className="ml-2 text-sm text-neutral-700">{medicalDictionary[term].normalRange}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  
                  <Separator className="my-6" />
                </div>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
