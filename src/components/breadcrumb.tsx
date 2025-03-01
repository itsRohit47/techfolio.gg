'use client';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean).slice(1);
    if (paths.length === 0) {
        return null;
    }

    const formatPathSegment = (segment: string) => {
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    };

    return (
        <nav className="text-xs">
            {paths.map((path, index) => (
                <div key={path} className="flex items-center">
                    <Link
                        href={`/${paths.slice(0, index + 1).join('/')}`}
                        className={`hover:text-gray-700 hover:bg-blue-100 hover:border-blue-200 border border-transparent px-2 py-1 rounded-lg ${index === paths.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'
                            }`}
                    >
                        {formatPathSegment(path)}
                    </Link>
                </div>
            ))}
        </nav>
    );
}
