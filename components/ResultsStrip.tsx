'use client';

import { useState, useEffect } from 'react';

export default function ResultsAnnouncementStrip() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="py-2.5 relative bg-transparent text-white ">
            <div className="absolute inset-0 animate-pulse" />

            <div className="relative flex items-center justify-center px-4 py-[0.100rem] text-xs font-thin">
                <div className="flex items-center gap-2">
                    <span className="animate-bounce">🎉</span>
                    <span>Interview results will be out soon</span>
                </div>
            </div>
        </div>
    );
}
