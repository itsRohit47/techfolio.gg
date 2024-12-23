import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { CogIcon, ClipboardCheckIcon, Telescope, LineChartIcon, UsersIcon, SunIcon, MoonIcon } from "lucide-react";


function NavMenu() {
    const session = useSession();
    return (
        <div className="flex min-w-60 border-2 flex-col gap-1 absolute top-12 right-0 p-2 rounded-lg z-10 text-xs bg-primary shadow-2xl">
            <Link href={`/${session.data?.user.username}`} className="text-white/80 hover:text-white p-3 w-full rounded-lg hover:bg-secondary flex items-center">
                <ClipboardCheckIcon size={16} className="inline-block mr-2" />
                My portfolio
            </Link>
            <Link href="/stats" className="text-white/80 hover:text-white p-3 w-full rounded-lg hover:bg-secondary flex items-center">
                <LineChartIcon size={16} className="inline-block mr-2" />
                Analytics
            </Link>
            <Link href="/explore" className="text-white/80 hover:text-white p-3 w-full rounded-lg hover:bg-secondary flex items-center">
                <Telescope size={16} className="inline-block mr-2" />
                Explore
            </Link>
            <Link href="/build" className="text-white/80 hover:text-white p-3 w-full rounded-lg hover:bg-secondary flex items-center">
                <UsersIcon size={16} className="inline-block mr-2" />
                Join the community
            </Link>
            <Link href="/settings" className="text-white/80 hover:text-white p-3 w-full rounded-lg hover:bg-secondary flex items-center">
                <CogIcon size={16} className="inline-block mr-2" />
                Settings
            </Link>
        </div>
    );
}

export default function UserNav() {
    const { data } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const session = useSession();
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className="relative flex gap-5 w-full items-center" ref={menuRef}>
            <div className="flex items-center gap-2">
                {isDarkMode ? (
                    <MoonIcon className="text-gray-500 cursor-pointer p-1" onClick={() => setIsDarkMode(false)} />
                ) : (
                    <SunIcon className="text-yellow-500 cursor-pointer p-1" onClick={() => setIsDarkMode(true)} />
                )}
            </div>
            <div
                className="cursor-pointer w-full text-nowrap border dark:border-none rounded-lg bg-gray-50 dark:bg-secondary p-1 flex items-center gap-2 px-3 py-2 text-xs"
                onClick={() => setIsOpen(!isOpen)}
            >
                {session.data?.user.name}
            </div>
            {isOpen && (
                <NavMenu />
            )}
        </div>
    );
}

