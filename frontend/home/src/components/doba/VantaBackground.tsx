import { useEffect, useRef } from "react";

interface VantaOptions {
  el: HTMLElement | null;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
  backgroundColor?: number;
  color1?: number;
  color2?: number;
  colorMode?: string;
  birdSize?: number;
  wingSpan?: number;
  speedLimit?: number;
  separation?: number;
  alignment?: number;
  cohesion?: number;
  quantity?: number;
}

interface VantaEffect {
  destroy: () => void;
}

declare global {
  interface Window {
    VANTA: {
      BIRDS: (options: VantaOptions) => VantaEffect;
    };
  }
}

const VantaBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<VantaEffect | null>(null);

  useEffect(() => {
    // Suppress Three.js and React Router warnings
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const msg = args[0];
      if (typeof msg === 'string') {
        if (msg.includes('THREE.BufferAttribute: .length')) return;
        if (msg.includes('React Router Future Flag Warning')) return;
      }
      originalWarn(...args);
    };

    let retryCount = 0;
    const maxRetries = 15;

    const initVanta = () => {
      if (vantaEffectRef.current) return;

      if (window.VANTA && window.VANTA.BIRDS && vantaRef.current) {
        try {
          vantaEffectRef.current = window.VANTA.BIRDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x0d0d12,
            color1: 0x4a0000,
            color2: 0x8b0000,
            colorMode: "lerpGradient",
            birdSize: 1.5,
            wingSpan: 3.0,
            speedLimit: 4.5,
            separation: 30.0,
            alignment: 20.0,
            cohesion: 10.0,
            quantity: 5.0,
          });
        } catch (err) {
          console.error("Vanta Birds init error:", err);
        }
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(initVanta, 500);
      }
    };

    initVanta();

    return () => {
      console.warn = originalWarn;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ background: "#0d0d12" }}
    />
  );
};

export default VantaBackground;
