import { Helmet } from "react-helmet-async";
import Navbar from "@/components/doba/Navbar";
import PreDropSection from "@/components/doba/PreDropSection";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";
import FullscreenToggle from "@/components/doba/FullscreenToggle";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>pre-drop your music on doba | for artists and super fans</title>
        <meta name="description" content="Doba lets artists release music as collectible song tokens. Fans collect, stream for free, and support the artists they love — before the streaming platforms." />
        <meta property="og:title" content="Doba | Music collectibles that stream free" />
        <meta property="og:description" content="Collect music. Stream free. Support artists directly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Doba | Music collectibles that stream free" />
        <meta name="twitter:description" content="Collect music. Stream free. Support artists directly." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/" />
      </Helmet>

      <div className="min-h-screen selection:bg-cyber-pink/30 relative">
        <VantaBackground />
        <FullscreenToggle />

        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <PreDropSection />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Index;
