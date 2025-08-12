"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000); // adjust duration
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700"
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "black",
                        backgroundImage:
                            "radial-gradient(rgba(255, 255, 255, 0.09) 1.5px, transparent 0)",
                        backgroundSize: "30px 30px",
                        backgroundPosition: "-5px -5px",
                    }}
                >
                    {/* wrapper: no padding */}
                    <div className="relative inline-flex rounded-lg overflow-visible">
                        {/* Static gradient border placed slightly outside the inner box */}
                        <span
                            aria-hidden
                            className="absolute -inset-1 rounded-lg bg-[conic-gradient(from_90deg_at_50%_50%,#e7029a_0%,#f472b6_45%,#bd5fff_75%,#00d4ff_100%)] pointer-events-none"
                        />

                        {/* Static glow/bloom behind the border (larger blurred gradient) */}
                        <span
                            aria-hidden
                            className="absolute -inset-3 rounded-lg bg-[conic-gradient(from_90deg_at_50%_50%,#e7029a_0%,#f472b6_45%,#bd5fff_75%,#00d4ff_100%)] opacity-40 blur-[22px] pointer-events-none"
                        />

                        {/* Inner area: NO padding. Keeps a solid background so only border/glow are visible */}
                        <span className="relative inline-flex items-center justify-center rounded-lg bg-slate-950">
              <Image
                  src="/Logo.png"
                  alt="Logo"
                  width={96}
                  height={96}
                  className="block w-24 h-auto object-contain"
              />
            </span>
                    </div>
                </div>
            )}
        </>
    );
}
