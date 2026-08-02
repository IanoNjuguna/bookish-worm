import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/components/doba/Navbar";
import HeroSection from "@/components/doba/HeroSection";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";
import FullscreenToggle from "@/components/doba/FullscreenToggle";

// import heroBg from "@/assets/hero-bg.jpg"; // File missing

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = [
      "Healing", "Infinite", "Magic",
      "Connection", "Freedom", "Energy",
      "Perspective", "Emotion", "Art",
      "Revolution", "Sanctuary"
    ];

    const ctx = gsap.context(() => {
      // Hero cycling text
      const mainTl = gsap.timeline({ repeat: -1 });

      words.forEach((word) => {
        const wordTl = gsap.timeline({
          repeat: 1,
          yoyo: true,
          repeatDelay: 2, // Linger a bit longer
        });
        
        wordTl.to({}, {
          duration: 0.8,
          onUpdate: function () {
            const progress = this.progress();
            const charCount = Math.ceil(word.length * progress);
            const target = document.querySelector(".gsap-changing-text");
            if (target) {
              target.textContent = word.substring(0, charCount);
            }
          },
          ease: "none",
        });
        
        mainTl.add(wordTl);
      });


      // Floating particles parallax
      gsap.utils.toArray<HTMLElement>(".parallax-particle").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "1");
        gsap.to(el, {
          yPercent: -80 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });

      // Hero content stagger
      // Hero animations
      gsap.from(".gsap-hero-title-static", {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.3,
        ease: "expo.out",
      });

      gsap.from(".gsap-hero-attribution", {
        opacity: 0,
        y: 10,
        duration: 1,
        delay: 1.5,
        ease: "power2.out",
      });

      gsap.from(".gsap-hero-buttons", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 1.8,
        ease: "power3.out",
      });

      // Steps stagger
      gsap.from(".gsap-step-card", {
        opacity: 0,
        x: 40,
        stagger: 0.1,
        duration: 0.8,
        delay: 2,
        ease: "power3.out",
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="min-h-screen selection:bg-cyber-pink/30 relative">
      <VantaBackground />
      <FullscreenToggle />
      
      {/* Floating particles — global, parallax-driven */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="parallax-particle fixed w-1 h-1 rounded-full bg-cyber-pink/30 pointer-events-none will-change-transform"
          data-speed={(0.3 + Math.random() * 1.2).toFixed(2)}
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            opacity: 0.2 + Math.random() * 0.5,
          }}
        />
      ))}

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
