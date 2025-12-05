import { useState, useEffect, useRef } from "react";
import { interpolateColor } from "../utils/color";

export function useColorTween(
  initialColor: string,
  targetColor: string,
  duration = 500,
) {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [isAnimating, setIsAnimating] = useState(false);
  const startColorRef = useRef(targetColor);
  const startTimeRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (targetColor === currentColor) return;

    startColorRef.current = currentColor;
    startTimeRef.current = performance.now();
    setIsAnimating(true);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const newColor = interpolateColor(
        startColorRef.current,
        targetColor,
        progress,
      );

      setCurrentColor(newColor);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetColor, duration, currentColor]);

  return { currentColor, isAnimating };
}
