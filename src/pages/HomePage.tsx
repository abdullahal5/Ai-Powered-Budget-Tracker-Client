import { FeaturesSection } from "../components/HomePage/FeatureSection";
import { HeroSection } from "../components/HomePage/HeroSection";
import { HowItWorksSection } from "../components/HomePage/HowItWorksSection";

const HomePage = () => {
    return (
      <div>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </div>
    );
};

export default HomePage;