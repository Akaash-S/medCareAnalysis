import { Link, useLocation } from "wouter";
import { Menu, X, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import LanguageSelector from "./language-selector";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Mock user for demo - in a real app, this would come from auth state
  const mockUser = { id: 1, username: "demo_user" };
  const isLoggedIn = false; // Set to true to test with a logged-in user

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg
                className="h-6 w-6 text-primary mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-bold text-xl text-neutral-800">Medical Report Explainer</span>
            </div>
            
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/">
                <div className={`border-b-2 px-1 pt-1 inline-flex items-center text-sm font-medium ${
                  isActive("/") 
                    ? "border-primary text-primary" 
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                }`}>
                  Simplify Report
                </div>
              </Link>
              <Link href="/dictionary">
                <div className={`border-b-2 px-1 pt-1 inline-flex items-center text-sm font-medium ${
                  isActive("/dictionary") 
                    ? "border-primary text-primary" 
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                }`}>
                  Medical Dictionary
                </div>
              </Link>
              <Link href="/insights">
                <div className={`border-b-2 px-1 pt-1 inline-flex items-center text-sm font-medium ${
                  isActive("/insights") 
                    ? "border-primary text-primary" 
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                }`}>
                  My Insights
                </div>
              </Link>
              <Link href="/about">
                <div className={`border-b-2 px-1 pt-1 inline-flex items-center text-sm font-medium ${
                  isActive("/about") 
                    ? "border-primary text-primary" 
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                }`}>
                  About
                </div>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            {/* Language Selector */}
            <div className="mr-4">
              <LanguageSelector 
                userId={isLoggedIn ? mockUser.id : undefined} 
                currentLanguage="en"
              />
            </div>
            
            {isLoggedIn ? (
              <Button variant="ghost" className="flex items-center">
                <UserCircle2 className="h-6 w-6 mr-1" />
                <span>{mockUser.username}</span>
              </Button>
            ) : (
              <>
                <Button variant="outline" className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 mr-3">
                  Sign In
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-md px-3 py-2 text-sm font-medium shadow-sm">
                  Get Started
                </Button>
              </>
            )}
            
            <div className="md:hidden ml-4">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 pt-2 pb-3 px-4">
          <Link href="/">
            <div className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/") ? "text-primary" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
            }`}>
              Simplify Report
            </div>
          </Link>
          <Link href="/dictionary">
            <div className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/dictionary") ? "text-primary" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
            }`}>
              Medical Dictionary
            </div>
          </Link>
          <Link href="/insights">
            <div className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/insights") ? "text-primary" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
            }`}>
              My Insights
            </div>
          </Link>
          <Link href="/about">
            <div className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/about") ? "text-primary" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
            }`}>
              About
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}
