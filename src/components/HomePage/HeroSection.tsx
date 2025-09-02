import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Img } from "react-image";

export function HeroSection() {
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const imageElement = imageRef.current!;
    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background overflow-hidden">
      {/* Background blur effects */}
      {/* <div className="absolute inset-0"> */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Added orbs with primary color #006D3B */}
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-[#006D3B]/20 rounded-full blur-3xl animate-pulse delay-500" />
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-[#006D3B]/15 rounded-full blur-3xl animate-pulse delay-1500" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#006D3B]/25 rounded-full blur-3xl animate-pulse delay-2000" />
      {/* </div> */}

      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div>
        <div className="relative pt-20 z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-card-foreground">
              AI-Powered Financial Intelligence
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Smart Budgeting with{" "}
            <span className="text-primary">AI Insights</span>
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
        </div>
        <section className="pt-10 pb-20 px-4 ">
          <div className="text-center">
            <div className="hero-image-wrapper mt-5 md:mt-0">
              <div ref={imageRef} className="hero-image">
                <Img
                  src="/banner.jpg"
                  width={1280}
                  height={720}
                  alt="Dashboard Preview"
                  className="rounded-lg shadow-2xl border object-cover mx-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
