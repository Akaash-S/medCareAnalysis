import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function UserProfile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentUser, logOut } = useAuth();
  const { toast } = useToast();

  if (!currentUser) return null;
  
  const displayName = currentUser.displayName || "User";
  const email = currentUser.email || "";
  const photoURL = currentUser.photoURL || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    try {
      await logOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
        variant: "default",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={photoURL} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{displayName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={photoURL} alt={displayName} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{displayName}</h3>
          <p className="text-sm text-neutral-500">{email}</p>
          
          <div className="mt-6 grid grid-cols-1 gap-3 w-full">
            <Button variant="outline" className="justify-start">
              <User className="mr-2 h-4 w-4" />
              Manage Account
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Button>
            <Button 
              variant="destructive" 
              className="justify-start mt-4"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}