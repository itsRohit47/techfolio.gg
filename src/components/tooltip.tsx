import { ReactNode } from 'react';

interface TooltipProps {
    children: ReactNode;
    content: string;
}

export default function Tooltip({ children, content }: TooltipProps) {
    if (!content) return <>{children}</>;

    return (
        <div className="relative group z-50">
            {children}
            <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-white text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {content}
            </div>
        </div>
    );
}
