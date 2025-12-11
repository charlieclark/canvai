"use client";

import { useEffect, useRef, useState } from "react";

type UseInViewOptions = {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
};

export const useInView = <T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) => {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = false } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry?.isIntersecting ?? false;
        setIsInView(inView);

        if (inView && triggerOnce) {
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
};




