import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import Docs from "./pages/Docs.tsx";
import ForArtists from "./pages/ForArtists.tsx";
import Support from "./pages/Support.tsx";
import FAQ from "./pages/FAQ.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import MediaKit from "./pages/MediaKit.tsx";
import Research from "./pages/Research.tsx";
import PreDrop from "./pages/PreDrop.tsx";
// The paps landing carries GSAP; lazy so the rest of the marketing site never pays for it.
const Paps = lazy(() => import("./pages/Paps.tsx"));
import NotFound from "./pages/NotFound.tsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Route tree used by both the client (BrowserRouter) and SSR (StaticRouter).
export const AppRoutes = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/for-artists" element={<ForArtists />} />
      <Route path="/support" element={<Support />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/media-kit" element={<MediaKit />} />
      <Route path="/research" element={<Research />} />
      <Route path="/pre-drop" element={<PreDrop />} />
      <Route
        path="/paps"
        element={
          <Suspense fallback={<div className="min-h-screen bg-[hsl(30_9%_6%)]" />}>
            <Paps />
          </Suspense>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
