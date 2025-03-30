import { useState, useEffect, useCallback } from "react";

// Breakpoint constants
const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Custom hook to determine if the current viewport is below a specified breakpoint
 * @param breakpoint - The breakpoint to check against (default: 'md')
 * @returns boolean indicating if the viewport is below the breakpoint
 */
export function useBreakpoint(breakpoint: Breakpoint = 'md') {
  const breakpointValue = BREAKPOINTS[breakpoint];
  
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState<boolean>(() => {
    // Only run in browser, not during SSR
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpointValue;
  });

  const checkBreakpoint = useCallback(() => {
    setIsBelowBreakpoint(window.innerWidth < breakpointValue);
  }, [breakpointValue]);

  useEffect(() => {
    // Skip effect during SSR
    if (typeof window === 'undefined') return;

    // Check immediately to avoid any initial flicker
    checkBreakpoint();

    // Use matchMedia for better performance and more accurate tracking
    const mediaQuery = window.matchMedia(`(max-width: ${breakpointValue - 1}px)`);
    
    // Set up event listener
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsBelowBreakpoint(e.matches);
    };

    // Use the modern event listener pattern if available
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', checkBreakpoint);
    }

    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        window.removeEventListener('resize', checkBreakpoint);
      }
    };
  }, [breakpointValue, checkBreakpoint]);

  return isBelowBreakpoint;
}

/**
 * Determines if the viewport is mobile-sized (below md breakpoint)
 * @returns boolean indicating if the viewport is mobile-sized
 */
export function useIsMobile() {
  return useBreakpoint('md');
}
