"use client"

import { useEffect, useRef } from 'react';

interface SplineViewerProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SplineViewer({ url, className, style }: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load the Spline viewer script if not already loaded
    if (!document.querySelector('script[src*="spline-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.48/build/spline-viewer.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Create the spline-viewer element
    if (containerRef.current) {
      const splineViewer = document.createElement('spline-viewer');
      splineViewer.setAttribute('url', url);

      // Disable all possible interactions
      splineViewer.setAttribute('mouse-controls', 'false');
      splineViewer.setAttribute('touch-controls', 'false');
      splineViewer.setAttribute('wheel-controls', 'false');
      splineViewer.setAttribute('keyboard-controls', 'false');

      // Additional Spline-specific attributes to disable interaction
      splineViewer.style.pointerEvents = 'none';
      splineViewer.style.touchAction = 'none';
      splineViewer.style.userSelect = 'none';
      splineViewer.style.webkitUserSelect = 'none';

      if (style) {
        Object.assign(splineViewer.style, style);
      }

      if (className) {
        splineViewer.className = className;
      }

      const container = containerRef.current;
      container.appendChild(splineViewer);

      // Comprehensive event prevention
      const preventAllInteraction = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      };

      // Apply to both container and spline viewer
      const elements = [container, splineViewer];
      const events = [
        'wheel', 'scroll', 'touchstart', 'touchmove', 'touchend',
        'mousedown', 'mousemove', 'mouseup', 'click', 'dblclick',
        'contextmenu', 'selectstart', 'dragstart', 'drag', 'dragend',
        'gesturestart', 'gesturechange', 'gestureend'
      ];

      elements.forEach(element => {
        events.forEach(eventType => {
          element.addEventListener(eventType, preventAllInteraction, {
            passive: false,
            capture: true
          });
        });
      });

      // Additional Safari-specific prevention
      const preventSafariScroll = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      };

      // Add to window to catch any bubbled events
      window.addEventListener('wheel', preventSafariScroll, { passive: false, capture: true });
      window.addEventListener('touchmove', preventSafariScroll, { passive: false, capture: true });

      return () => {
        if (container && splineViewer.parentNode) {
          // Remove all event listeners
          elements.forEach(element => {
            events.forEach(eventType => {
              element.removeEventListener(eventType, preventAllInteraction, { capture: true });
            });
          });

          window.removeEventListener('wheel', preventSafariScroll, { capture: true });
          window.removeEventListener('touchmove', preventSafariScroll, { capture: true });

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
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        pointerEvents: 'none'
      }}
    >
      {/* Transparent overlay to block all interactions */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999999,
          backgroundColor: 'transparent',
          pointerEvents: 'auto',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </div>
  );
}