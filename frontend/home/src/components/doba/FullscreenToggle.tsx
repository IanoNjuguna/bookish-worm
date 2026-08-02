import { useState, useEffect } from "react";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a slight delay for a nice entrance
    const timer = setTimeout(() => setIsVisible(true), 1500);
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    const handleFullscreenChange = () => {
      const fullscreenActive = !!document.fullscreenElement;
      setIsFullscreen(fullscreenActive);

      // Hide scrollbars while fullscreen is active.
      document.body.style.overflow = fullscreenActive ? "hidden" : originalBodyOverflow;
      document.documentElement.style.overflow = fullscreenActive ? "hidden" : originalHtmlOverflow;
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-8 right-8 z-[100] hidden md:block"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="w-12 h-12 rounded-full glass-surface border-white/10 text-white/70 hover:text-lavender hover:border-lavender/50 hover:bg-lavender/5 shadow-2xl transition-all duration-300 group"
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >

                {isFullscreen ? (
                  <IconMinimize className="h-5 w-5 transition-transform group-hover:scale-110" />
                ) : (
                  <IconMaximize className="h-5 w-5 transition-transform group-hover:scale-110" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-void/90 border-white/10 text-white backdrop-blur-md">
              <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullscreenToggle;


