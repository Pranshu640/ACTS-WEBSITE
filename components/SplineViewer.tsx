"use client"

import { useEffect, useRef } from 'react';

interface SplineViewerProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SplineViewer({ url, className, style }: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load the Spline viewer script if not already loaded
    if (!document.querySelector('script[src*="spline-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.48/build/spline-viewer.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Create the spline-viewer element
    if (containerRef.current) {
      const splineViewer = document.createElement('spline-viewer');
      splineViewer.setAttribute('url', url);

      // Disable Spline interactions but allow page scrolling
      splineViewer.setAttribute('mouse-controls', 'false');
      splineViewer.setAttribute('touch-controls', 'false');
      splineViewer.setAttribute('wheel-controls', 'false');
      splineViewer.setAttribute('keyboard-controls', 'false');

      // Make Spline viewer non-interactive but allow events to pass through
      splineViewer.style.pointerEvents = 'none';
      splineViewer.style.userSelect = 'none';

      if (style) {
        Object.assign(splineViewer.style, style);
      }

      if (className) {
        splineViewer.className = className;
      }

      const container = containerRef.current;
      container.appendChild(splineViewer);

      return () => {
        if (container && splineViewer.parentNode) {
          container.removeChild(splineViewer);
        }
      };
    }
  }, [url, className, style]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        // Allow pointer events to pass through for page scrolling
        pointerEvents: 'none'
      }}
    />
  );
}