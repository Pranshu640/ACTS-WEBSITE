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
        <div className="relative bg-[#330066] bg-transparent text-gray-400">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />

            <div className="relative flex items-center justify-center px-4 py-[0.100rem] text-xs font-thin">
                <div className="flex items-center gap-2">
                    <span className="animate-bounce">🎉</span>
                    <span>Interview results will be out soon</span>
                </div>
            </div>
        </div>
    );
}
