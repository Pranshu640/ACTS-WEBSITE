declare module '*.svg' {
    import React from 'react';
    // This is the named export provided by @svgr/webpack for the React component
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    // This is the default export, which is usually the URL path to the SVG.
    // Useful if you also want to use the SVG with `<img>` tag or CSS `background-image`.
    const src: string;
    export default src;
}