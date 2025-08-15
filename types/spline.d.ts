import { CSSProperties } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string;
        style?: CSSProperties;
        className?: string;
        loading?: 'lazy' | 'eager';
        'events-target'?: string;
      };
    }
  }
}

export {};