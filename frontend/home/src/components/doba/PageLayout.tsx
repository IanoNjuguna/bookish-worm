import { ReactNode } from "react";
import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: "4xl" | "5xl";
  className?: string;
  floating?: ReactNode;
}

export default function PageLayout({
  children,
  maxWidth = "4xl",
  className,
  floating,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <VantaBackground />
      <Navbar />

      <main
        className={cn(
          "pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 mx-auto w-full",
          maxWidth === "5xl" ? "max-w-5xl" : "max-w-4xl",
          className
        )}
      >
        {children}
      </main>

      {floating}
      <Footer />
    </div>
  );
}
