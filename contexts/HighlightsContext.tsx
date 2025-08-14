"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DriveImage {
    id: string;
    name: string;
    thumbnailLink?: string;
    webContentLink?: string;
    webViewLink?: string;
    mimeType?: string;
}

interface HighlightsContextType {
    preloadedImages: DriveImage[];
    setPreloadedImages: (images: DriveImage[]) => void;
    isPreloaded: boolean;
    setIsPreloaded: (preloaded: boolean) => void;
}

const HighlightsContext = createContext<HighlightsContextType | undefined>(undefined);

export function HighlightsProvider({ children }: { children: ReactNode }) {
    const [preloadedImages, setPreloadedImages] = useState<DriveImage[]>([]);
    const [isPreloaded, setIsPreloaded] = useState(false);

    return (
        <HighlightsContext.Provider value={{
            preloadedImages,
            setPreloadedImages,
            isPreloaded,
            setIsPreloaded
        }}>
            {children}
        </HighlightsContext.Provider>
    );
}

export function useHighlights() {
    const context = useContext(HighlightsContext);
    if (context === undefined) {
        throw new Error('useHighlights must be used within a HighlightsProvider');
    }
    return context;
}