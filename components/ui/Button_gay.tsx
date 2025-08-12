import React from "react";

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    intensive?: boolean;
}

const FancyButton: React.FC<FancyButtonProps> = ({ intensive, children, ...props }) => {
    return (
        <button
            {...props}
            className={`relative px-8 py-3 bg-purple-950 text-white font-semibold rounded-lg border transition-all duration-300 group
        ${intensive
                ? "border-transparent hover:shadow-[0_0_25px_15px_rgba(255,94,247,0.8)] active:scale-95 active:shadow-[0_0_15px_8px_rgba(2,245,255,0.6)]"
                : "border-purple-500 hover:border-purple-400 hover:shadow-[0_0_20px_10px_rgba(168,85,247,0.6)] active:scale-95 active:shadow-[0_0_10px_5px_rgba(168,85,247,0.4)]"
            }`}
        >
      <span className="flex items-center space-x-2">
        {children}
      </span>
            <span
                className={`absolute inset-0 rounded-lg transition-opacity duration-300
          ${intensive
                    ? "opacity-100 bg-[radial-gradient(circle_farthest-corner_at_10%_20%,rgba(255,94,247,1)_17.8%,rgba(2,245,255,1)_100.2%)]"
                    : "opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500/20 to-indigo-500/20"
                }`}
            ></span>
        </button>
    );
};

export default FancyButton;
