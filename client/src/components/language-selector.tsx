import { useState } from "react";
import { supportedLanguages } from "@shared/schema";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LanguageSelectorProps {
  userId?: number;
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export default function LanguageSelector({ 
  userId, 
  currentLanguage = "en",
  onLanguageChange
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const { toast } = useToast();
  
  // Mutation to update user language preference
  const updateLanguageMutation = useMutation({
    mutationFn: async (language: string) => {
      if (!userId) return null;
      const response = await apiRequest("POST", `/api/user/${userId}/language`, { language });
      return response.json();
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: "Language updated",
          description: "Your language preference has been updated.",
          variant: "default",
        });
      } else {
        toast({
          title: "Failed to update language",
          description: data?.message || "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to update language",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    
    // Update language preference if user is logged in
    if (userId) {
      updateLanguageMutation.mutate(language);
    }
    
    // Notify parent component
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  const getLanguageName = (code: string) => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? language.name : "English";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Globe className="h-4 w-4 mr-1" />
          <span>{getLanguageName(selectedLanguage)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            className={selectedLanguage === language.code ? "bg-primary/10" : ""}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}