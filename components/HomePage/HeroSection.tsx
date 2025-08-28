import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-card-foreground">
            AI-Powered Financial Intelligence
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          Smart Budgeting with <span className="text-primary">AI Insights</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Transform your financial future with intelligent budget tracking,
          personalized recommendations, and AI-driven insights that help you
          save more and spend smarter.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg bg-transparent"
          >
            Watch Demo
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-sm text-muted-foreground">
          <p className="mb-4">Trusted by 50,000+ users worldwide</p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <span className="font-semibold">Bank-level Security</span>
            <span>•</span>
            <span className="font-semibold">256-bit Encryption</span>
            <span>•</span>
            <span className="font-semibold">GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
