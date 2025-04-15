import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface SignInProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SignIn({ onSuccess, onCancel }: SignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await signIn();
      
      if (user) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
          variant: "default",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An error occurred during sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Sign in to access your personalized medical insights and saved reports.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-sm text-neutral-600">
            By signing in, you can:
          </p>
          <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
            <li>Save your medical reports for future reference</li>
            <li>Track your health data over time</li>
            <li>Receive personalized health insights</li>
            <li>Access your data across devices</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Button 
          onClick={handleSignIn} 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Google
            </>
          )}
        </Button>
        
        {onCancel && (
          <Button 
            variant="ghost" 
            onClick={onCancel}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        )}
        
        <p className="text-xs text-center text-neutral-500 mt-4">
          We respect your privacy and comply with all data protection regulations.
          Your medical information is stored securely and never shared without your consent.
        </p>
      </CardFooter>
    </Card>
  );
}