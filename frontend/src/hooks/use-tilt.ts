import { useRef, useEffect, RefObject } from "react";

interface TiltOptions {
  max: number;
  perspective: number;
  scale: number;
}

export function useTilt<T extends HTMLElement>(
  options: TiltOptions
): [RefObject<T>] {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { max, perspective, scale } = options;
    el.style.transformStyle = "preserve-3d";

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      // invert X so tilt feels natural
      const rotateY = ((x - midX) / midX) * max;
      const rotateX = -((y - midY) / midY) * max;
      el.style.transform = `
        perspective(${perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;
    };

    const handleMouseLeave = () => {
      el.style.transform = `
        perspective(${perspective}px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1,1,1)
      `;
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [options.max, options.perspective, options.scale]);

  return [ref];
} 