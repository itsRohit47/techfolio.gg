import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, SunIcon, MoonIcon } from "lucide-react";


export default function NavMenu() {
    const session = useSession();
    const [isDarkMode, setIsDarkMode] = useState(true);
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);
    return (
        <div className="flex gap-x-5 text-xs items-center font-normal">
            <Link href="/">
                Dashboard
            </Link>
            <Link href={`/${session.data?.user.username}`} className="flex items-center gap-1">
                Public Profile
                <ArrowUpRight size={16} />
            </Link>
            <Link href="/explore">
                Explore
            </Link>
            <Link href="/settings">
                Settings
            </Link>
            {/* <button onClick={() => setIsDarkMode(!isDarkMode)} className={`shadow-sm ${isDarkMode ? 'shadow-yellow-100 ' : 'light'}`}>
                {isDarkMode ? <SunIcon size={18} color="gray" /> : <MoonIcon size={18} color="gray" />}
            </button> */}
        </div>
    );
}
