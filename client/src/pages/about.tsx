import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">About Medical Report Explainer</h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-neutral-500">
          Breaking down complex medical terminology into plain, understandable language.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 mb-12">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Mission</h2>
            <p className="text-neutral-700 mb-4">
              Medical Report Explainer was created with a simple but important mission: to help people understand their medical reports without needing a medical degree.
            </p>
            <p className="text-neutral-700 mb-4">
              Medical jargon can be overwhelming and intimidating, creating a barrier between patients and their own health information. We believe that everyone has the right to understand their medical data in clear, simple terms.
            </p>
            <p className="text-neutral-700">
              By translating complex terminology into everyday language, we aim to empower patients to take control of their health journey, ask informed questions, and make better decisions about their care.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">How It Works</h2>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <span className="text-lg font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Copy & Paste Your Report</h3>
                  <p className="mt-1 text-neutral-600">
                    Simply copy text from your medical report and paste it into our secure interface. Your data remains private and is never stored permanently.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <span className="text-lg font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Automated Term Recognition</h3>
                  <p className="mt-1 text-neutral-600">
                    Our system scans your text and identifies medical terminology, abbreviations, and values that might be difficult to understand.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <span className="text-lg font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Plain Language Translation</h3>
                  <p className="mt-1 text-neutral-600">
                    The identified terms are replaced with simpler alternatives, making your report easier to read and understand.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <span className="text-lg font-bold">4</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Detailed Explanations</h3>
                  <p className="mt-1 text-neutral-600">
                    Each identified term comes with a detailed explanation, normal values where applicable, and context to help you understand its significance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Important Disclaimer</h2>
            <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
              <p className="text-neutral-700">
                <strong>Medical Report Explainer is an educational tool only.</strong> While we strive for accuracy, our simplified explanations are not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p className="text-neutral-700 mt-3">
                Always consult with your healthcare provider about your medical reports, test results, and any questions or concerns you may have about your health.
              </p>
              <p className="text-neutral-700 mt-3">
                If you think you may have a medical emergency, call your doctor or emergency services immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
