import { FeaturesSection } from "@/components/HomePage/FeatureSection";
import { HeroSection } from "@/components/HomePage/HeroSection";
import { HowItWorksSection } from "@/components/HomePage/HowItWorksSection";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
