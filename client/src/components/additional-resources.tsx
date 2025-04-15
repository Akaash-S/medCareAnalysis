import { Card, CardContent } from "./ui/card";
import { ArrowRight } from "lucide-react";

type Resource = {
  title: string;
  description: string;
  link: string;
};

// Define medical resources based on identified terms
const getResources = () => {
  const defaultResources: Resource[] = [
    {
      title: "Understanding Medical Terminology",
      description: "A comprehensive guide to common medical terms and abbreviations.",
      link: "#",
    },
    {
      title: "How to Read Your Lab Results",
      description: "Learn how to interpret your laboratory test results and what the numbers mean.",
      link: "#",
    },
    {
      title: "Questions to Ask Your Doctor",
      description: "Prepare for your next appointment with this helpful checklist.",
      link: "#",
    },
    {
      title: "Patient Rights and Medical Records",
      description: "Information about your rights to access and understand your medical information.",
      link: "#",
    },
  ];

  return defaultResources;
};

export default function AdditionalResources() {
  const resources = getResources();

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Learn More About Your Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <a 
              key={index} 
              href={resource.link} 
              className="block group"
            >
              <div className="border border-neutral-200 rounded-md p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <h3 className="font-medium text-neutral-900 group-hover:text-primary-700">
                  {resource.title}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {resource.description}
                </p>
                <span className="inline-flex items-center text-primary text-sm font-medium mt-2">
                  Read more
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:ml-2 transition-all duration-200" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
