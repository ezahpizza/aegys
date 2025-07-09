import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  repeat?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "0px",
  textAlign = "center",
  onLetterAnimationComplete,
  repeat = false,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Kill existing timeline and scroll triggers
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const absoluteLines = splitType === "lines";
    if (absoluteLines) el.style.position = "relative";

    const splitter = new GSAPSplitText(el, {
      type: splitType,
      absolute: absoluteLines,
      linesClass: "split-line",
    });

    let targets: Element[];
    switch (splitType) {
      case "lines":
        targets = splitter.lines;
        break;
      case "words":
        targets = splitter.words;
        break;
      case "words, chars":
        targets = [...splitter.words, ...splitter.chars];
        break;
      default:
        targets = splitter.chars;
    }

    targets.forEach((t) => {
      (t as HTMLElement).style.willChange = "transform, opacity";
    });

    // Set initial state
    gsap.set(targets, { ...from, immediateRender: true });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 95%",
        end: "top 50%",
        toggleActions: "play none none none",
        refreshPriority: -1,
        onEnter: () => {
          // Reset and play animation when entering viewport
          gsap.set(targets, from);
          tl.restart();
        },
        onEnterBack: () => {
          // Reset and play animation when scrolling back into view
          gsap.set(targets, from);
          tl.restart();
        },
      },
      smoothChildTiming: true,
      onComplete: () => {
        onLetterAnimationComplete?.();
      },
    });

    tl.to(targets, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      force3D: true,
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === el) {
          trigger.kill();
        }
      });
      gsap.killTweensOf(targets);
      splitter.revert();
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
    repeat,
  ]);

  return (
    <p
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        overflow: "hidden",
        display: "block",
        whiteSpace: "normal",
        wordWrap: "break-word",
        width: "100%",
        minHeight: "1em",
        paddingTop: "20px", // Space for y-axis animation
        paddingBottom: "20px",
      }}
    >
      {text}
    </p>
  );
};

export default SplitText;