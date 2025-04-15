import { Card, CardContent } from "./ui/card";

export default function HeroSection() {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Understand Your Medical Reports</h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-neutral-500">
          We translate complex medical terminology into simple, easy-to-understand language.
        </p>
      </div>
      
      <Card className="bg-white shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-neutral-900">How it works</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border border-neutral-200 rounded-md p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <svg 
                    className="h-6 w-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-neutral-900">1. Copy & Paste</h3>
                <p className="text-neutral-500 text-sm mt-1">Copy text from your medical report and paste it below</p>
              </div>
              
              <div className="border border-neutral-200 rounded-md p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <svg 
                    className="h-6 w-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-neutral-900">2. Simplify</h3>
                <p className="text-neutral-500 text-sm mt-1">Our system identifies and explains medical terminology</p>
              </div>
              
              <div className="border border-neutral-200 rounded-md p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <svg 
                    className="h-6 w-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-neutral-900">3. Understand</h3>
                <p className="text-neutral-500 text-sm mt-1">Review the simplified explanation of your medical report</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
