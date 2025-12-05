"use client";

import { useEffect, useState } from "react";

export enum Breakpoint {
  mobile = "mobile",
  tablet = "tablet",
  desktop = "desktop",
}

export const breakpointWidths = {
  [Breakpoint.mobile]: 768,
  [Breakpoint.tablet]: 1280,
};

// The breakpoints are sorted by width, so the last breakpoint is the default
const breakpoints = [
  { width: 768, breakpoint: Breakpoint.mobile },
  { width: 1280, breakpoint: Breakpoint.tablet },
];

function getCurrentBreakpoint() {
  if (typeof window === "undefined") {
    return Breakpoint.desktop;
  }
  return (
    breakpoints.find(
      ({ width }) => window.matchMedia(`(max-width: ${width}px)`).matches,
    )?.breakpoint ?? Breakpoint.desktop
  );
}

export function useBreakpoints() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    getCurrentBreakpoint(),
  );

  useEffect(() => {
    const updateCurrentBreakpoint = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    // Initial check
    updateCurrentBreakpoint();

    // Add resize listener
    window.addEventListener("resize", updateCurrentBreakpoint);

    // Cleanup
    return () => window.removeEventListener("resize", updateCurrentBreakpoint);
  }, [setCurrentBreakpoint]);

  return {
    currentBreakpoint,
    isMobile: currentBreakpoint === Breakpoint.mobile,
  };
}
