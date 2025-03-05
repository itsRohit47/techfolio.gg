import { XIcon } from 'lucide-react';
import { useEffect } from 'react';

interface ImageViewerProps {
    src: string;
    onClose: () => void;
}

export function ImageViewer({ src, onClose }: ImageViewerProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/90 z-50 animate-fade-in flex items-center justify-center">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
                <XIcon size={24} />
            </button>
            <img
                src={src}
                alt="Full screen view"
                className="max-h-screen max-w-screen p-4 object-contain"
            />
        </div>
    );
}
