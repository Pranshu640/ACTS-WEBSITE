"use client"

import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap'
      ];

      fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
          link.rel = 'stylesheet';
        };
        document.head.appendChild(link);
      });

      // Preload critical images
      const criticalImages = [
        '/Logo/image 3.svg',
        '/Logo/Toprightbig.svg',
        '/Logo/bottomleftbig.svg',
        '/Logo/bottomrightbig.svg'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize images with lazy loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.loading) {
          img.loading = 'lazy';
        }
        if (!img.decoding) {
          img.decoding = 'async';
        }
      });
    };

    // Reduce layout shifts
    const reduceLayoutShifts = () => {
      // Add aspect ratio containers for images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.style.aspectRatio && img.naturalWidth && img.naturalHeight) {
          img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
        }
      });
    };

    // Optimize animations
    const optimizeAnimations = () => {
      // Use will-change for animated elements
      const animatedElements = document.querySelectorAll('[data-animate], .motion-div, [class*="animate"]');
      animatedElements.forEach(el => {
        (el as HTMLElement).style.willChange = 'transform, opacity';
      });

      // Clean up will-change after animations
      setTimeout(() => {
        animatedElements.forEach(el => {
          (el as HTMLElement).style.willChange = 'auto';
        });
      }, 3000);
    };

    // Debounce resize events
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        window.dispatchEvent(new Event('debouncedResize'));
      }, 250);
    };

    // Initialize optimizations
    preloadCriticalResources();
    
    // Run after DOM is ready
    const runOptimizations = () => {
      optimizeImages();
      reduceLayoutShifts();
      optimizeAnimations();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
      runOptimizations();
    }

    // Add debounced resize listener
    window.addEventListener('resize', debouncedResize, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
      document.removeEventListener('DOMContentLoaded', runOptimizations);
    };
  }, []);

  return null; // This component doesn't render anything
}