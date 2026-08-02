import Navbar from "@/components/doba/Navbar";
import HeroSection from "@/components/doba/HeroSection";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";
import FullscreenToggle from "@/components/doba/FullscreenToggle";

const Index = () => {
  return (
    <div className="min-h-screen selection:bg-cyber-pink/30 relative">
      <VantaBackground />
      <FullscreenToggle />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
