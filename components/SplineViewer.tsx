"use client"

import { useEffect, useRef } from 'react';

interface SplineViewerProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
  prefetch?: boolean; // New prop to enable prefetching
}

export default function SplineViewer({ url, className, style, prefetch = true }: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Prefetch the Spline scene
  useEffect(() => {
    if (prefetch && url) {
      // Prefetch the main Spline file
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);

      // Also prefetch common Spline assets if they follow predictable patterns
      const baseUrl = url.replace(/\/[^\/]*$/, '');
      const commonExtensions = ['.splinecode', '.bin', '.jpg', '.png', '.webp'];

      commonExtensions.forEach(ext => {
        const assetLink = document.createElement('link');
        assetLink.rel = 'prefetch';
        assetLink.href = `${baseUrl}/scene${ext}`;
        document.head.appendChild(assetLink);
      });

      return () => {
        // Cleanup prefetch links
        document.querySelectorAll(`link[href="${url}"]`).forEach(link => link.remove());
        commonExtensions.forEach(ext => {
          document.querySelectorAll(`link[href="${baseUrl}/scene${ext}"]`).forEach(link => link.remove());
        });
      };
    }
  }, [url, prefetch]);

  useEffect(() => {
    // Preload the Spline viewer script
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

      // Add loading attribute for better performance
      splineViewer.setAttribute('loading', 'eager');

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

// Utility function to prefetch Spline scenes globally
export function prefetchSplineScene(url: string) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

export function usePrefetchSplineScenes(urls: string[]) {
  useEffect(() => {
    urls.forEach(url => {
      if (url) {
        prefetchSplineScene(url);
      }
    });
  }, [urls]);
}
