import { useState, useEffect } from "react";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    const handleFullscreenChange = () => {
      const fullscreenActive = !!document.fullscreenElement;
      setIsFullscreen(fullscreenActive);

      document.body.style.overflow = fullscreenActive ? "hidden" : originalBodyOverflow;
      document.documentElement.style.overflow = fullscreenActive ? "hidden" : originalHtmlOverflow;
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
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
    <div className="fixed bottom-8 right-8 z-[100] hidden md:block">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="w-12 h-12 rounded-full glass-surface border-black/10 dark:border-white/10 bg-white/80 dark:bg-void/80 text-zinc-900 dark:text-white/80 hover:text-cyber-pink dark:hover:text-lavender hover:border-cyber-pink/50 dark:hover:border-lavender/50 hover:bg-black/5 dark:hover:bg-white/5 shadow-lg dark:shadow-2xl transition-all duration-300 group"
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <IconMinimize className="h-5 w-5 transition-transform group-hover:scale-110" />
            ) : (
              <IconMaximize className="h-5 w-5 transition-transform group-hover:scale-110" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-white/90 dark:bg-void/90 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white backdrop-blur-md">
          <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default FullscreenToggle;
