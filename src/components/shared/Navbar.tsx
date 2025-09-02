
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "react-router";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={"/"} className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BudgetAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </a>
            <SignedOut>
              <div className="flex gap-3">
                {/* Sign In Button */}
                <SignInButton>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </SignInButton>

                {/* Sign Up Button */}
                <SignUpButton>
                  <Button size="sm" className="bg-accent hover:bg-accent/90">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <Link to={'/dashboard'}>
                <Button className="cursor-pointer">Dashbaord</Button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How it Works
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent/90">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
