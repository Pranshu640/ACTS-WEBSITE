import React from 'react';

interface AnimatedBackgroundProps {
    children?: React.ReactNode;
    className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
                                                                   children,
                                                                   className = ""
                                                               }) => {
    // Circle configurations matching the original CSS
    const circles = [
        { size: 'w-20 h-20', left: 'left-1/4', delay: '0s', duration: '25s' },
        { size: 'w-5 h-5', left: 'left-[10%]', delay: '2s', duration: '12s' },
        { size: 'w-5 h-5', left: 'left-[70%]', delay: '4s', duration: '25s' },
        { size: 'w-15 h-15', left: 'left-[40%]', delay: '0s', duration: '18s' },
        { size: 'w-5 h-5', left: 'left-[65%]', delay: '0s', duration: '25s' },
        { size: 'w-28 h-28', left: 'left-3/4', delay: '3s', duration: '25s' },
        { size: 'w-36 h-36', left: 'left-[35%]', delay: '7s', duration: '25s' },
        { size: 'w-6 h-6', left: 'left-1/2', delay: '15s', duration: '45s' },
        { size: 'w-4 h-4', left: 'left-1/5', delay: '2s', duration: '35s' },
        { size: 'w-36 h-36', left: 'left-[85%]', delay: '0s', duration: '11s' }
    ];

    return (
        <div className={`relative ${className}`}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-950 to-[#5c00f2] -z-10">
                {/* Animated circles container */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    {circles.map((circle, index) => (
                        <div
                            key={index}
                            className={`
                absolute block list-none bg-white/20 animate-float
                ${circle.size} ${circle.left} -bottom-36
              `}
                            style={{
                                animationDelay: circle.delay,
                                animationDuration: circle.duration,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            {children}

            <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
        
        .animate-float {
          animation: float 25s linear infinite;
        }
        
        /* Custom width/height classes for sizes not in default Tailwind */
        .w-15 { width: 3.75rem; }
        .h-15 { height: 3.75rem; }
      `}</style>
        </div>
    );
};

export default AnimatedBackground;