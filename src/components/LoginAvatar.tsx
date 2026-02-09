
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AvatarProps {
    isPasswordFocused: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ isPasswordFocused }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const avatarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (avatarRef.current) {
                const rect = avatarRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Calculate relative position and normalize
                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                const angle = Math.atan2(dy, dx);
                const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 20, 8); // Limit movement distance

                setMousePos({
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div ref={avatarRef} className="relative w-32 h-32 mx-auto mb-6">
            <motion.div
                className="w-full h-full bg-gradient-to-br from-serenity-200 to-calm-200 dark:from-serenity-800 dark:to-calm-800 rounded-full shadow-inner flex items-center justify-center relative overflow-hidden"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                {/* Face Details */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center">

                    {/* Eyes Container */}
                    <div className="flex gap-6 mb-2">
                        {/* Left Eye */}
                        <div className="w-8 h-8 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center relative shadow-sm overflow-hidden">
                            <motion.div
                                className="w-4 h-4 bg-gray-900 rounded-full"
                                animate={isPasswordFocused ? { y: 12, scaleY: 0.1 } : { x: mousePos.x, y: mousePos.y }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </div>
                        {/* Right Eye */}
                        <div className="w-8 h-8 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center relative shadow-sm overflow-hidden">
                            <motion.div
                                className="w-4 h-4 bg-gray-900 rounded-full"
                                animate={isPasswordFocused ? { y: 12, scaleY: 0.1 } : { x: mousePos.x, y: mousePos.y }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </div>
                    </div>

                    {/* Blush */}
                    <div className="absolute top-[60%] left-0 right-0 flex justify-between px-4 opacity-30">
                        <div className="w-4 h-2 bg-pink-400 rounded-full blur-[2px]" />
                        <div className="w-4 h-2 bg-pink-400 rounded-full blur-[2px]" />
                    </div>

                    {/* Mouth */}
                    <motion.div
                        className="w-6 h-3 border-b-2 border-gray-600 dark:border-gray-400 rounded-full"
                        animate={isPasswordFocused ? { width: 12, borderRadius: "50%" } : { width: 24, borderRadius: "0 0 12px 12px" }}
                    />
                </div>

                {/* Shine */}
                <div className="absolute top-2 left-6 w-8 h-4 bg-white/20 rounded-full rotate-[-40deg] blur-[2px]" />
            </motion.div>
        </div>
    );
};

export default Avatar;
