'use client';

import { useState, useEffect } from 'react';

export default function ResultsAnnouncementStrip() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="top-[5.5rem] bottom-0 py-0 z-20 relative bg-transparent text-white/80 ">
            <div className="relative whitespace-nowrap">
                <div className="inline-block w-full animate-scroll">
                    <span className="inline-flex items-center gap-2 px-8 text-[0.8rem] font-medium">
                        Interview  results  are <span className="font-bold animate-gradient-text ">out</span> now 🎉
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(100%); }   /* start off screen right */
                    100% { transform: translateX(-20%); } /* move off screen left */
                }
                
                .animate-scroll {
                    animation: scroll 15s linear infinite;
                }
            `}</style>
        </div>
    );
}
