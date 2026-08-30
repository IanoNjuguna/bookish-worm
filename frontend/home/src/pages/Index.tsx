import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/doba/PageLayout";
import PreDropSection from "@/components/doba/PreDropSection";
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

      <PageLayout floating={<FullscreenToggle />}>
        <PreDropSection />
      </PageLayout>
    </>
  );
};

export default Index;
