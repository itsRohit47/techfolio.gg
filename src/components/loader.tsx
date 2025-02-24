'use client'
import { useEffect, useState } from "react";
export default function Loader() {
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((current) => (current + 1) % 3);
        }, 500);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="flex items-center justify-center h-full gap-1">
            {[0, 1, 2].map((index) => {
                const isActive = index === activeIndex;
                return (
                    <div
                        key={index}
                        className={`w-1 h-1 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-900 scale-110 -translate-y-px' : 'bg-gray-300'
                            }`}
                    ></div>
                );
            })}
        </div>
    );
}