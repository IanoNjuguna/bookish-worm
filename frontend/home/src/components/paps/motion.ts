import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Motion policy for the paps landing.
 *
 * Three rules, in order of importance:
 *   1. Reduce means reduce. `prefers-reduced-motion` gets the finished layout, not a
 *      faster animation. Everything renders correctly without a single tween.
 *   2. Mobile never pins. A pinned cross-fade on a phone steals the scroll, and the
 *      address bar collapsing makes it jump. Phones get reveals; desktops get choreography.
 *   3. Animate transform and opacity only. No width, height, top or filter tweens on
 *      anything that appears more than once.
 */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Reveal a block once, as it enters. Disabled entirely under reduced motion. */
export function useReveal<T extends HTMLElement>(options?: {
  y?: number;
  delay?: number;
  /** When the same element is also driven by a desktop ScrollTrigger, the reveal must
   *  stay out of its way: `only: 'mobile'` keeps this hook below the pin breakpoint. */
  only?: 'mobile';
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (options?.only === 'mobile' && window.matchMedia('(min-width: 900px)').matches) {
      gsap.set(el, { clearProps: 'opacity,transform' });
      return;
    }

    const tween = gsap.from(el, {
      y: options?.y ?? 18,
      opacity: 0,
      duration: 0.7,
      delay: options?.delay ?? 0,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [options?.delay, options?.y]);

  return ref;
}

/**
 * The desktop-only set piece: three feature panels pinned while the page scrolls, each
 * fading in over the last. `gsap.matchMedia` reverts every trace when the viewport drops
 * below the breakpoint or motion is reduced, so a phone that rotates cannot inherit a
 * half-built pin.
 */
export function usePinnedPanels(
  hostRef: React.RefObject<HTMLElement | null>,
  panelSelector: string,
) {
  useEffect(() => {
    const host = hostRef.current;
    if (!host || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px)', () => {
      const panels = gsap.utils.toArray<HTMLElement>(panelSelector, host);
      if (panels.length < 2) return;

      gsap.set(panels.slice(1), { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: host,
          start: 'top top',
          end: () => `+=${panels.length * 60}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      panels.slice(1).forEach((panel, i) => {
        tl.to(panels[i], { autoAlpha: 0, y: -24, duration: 0.4 }, i)
          .to(panel, { autoAlpha: 1, y: 0, duration: 0.4 }, i);
      });

      return () => {
        gsap.set(panels, { clearProps: 'all' });
      };
    });

    return () => mm.revert();
  }, [hostRef, panelSelector]);
}

/** One load-in timeline for the hero. Words rise; nothing counts up. */
export function useHeroIntro<T extends HTMLElement>(lineSelector: string) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const lines = gsap.utils.toArray<HTMLElement>(lineSelector, host);
    if (!lines.length) return;

    // Nothing in the markup starts at opacity 0: if the script never runs (blocked CDN,
    // an old browser, a failed chunk) the hero must still be readable. The hidden state is
    // set here, then tweened away.
    if (prefersReducedMotion()) return;

    gsap.set(lines, { opacity: 0, y: 26 });
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(lines, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 });

    return () => tl.kill();
  }, [lineSelector]);

  return ref;
}
