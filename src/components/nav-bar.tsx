'use client';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAppContext } from "./context";

import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();
    const session = useSession();
    const { username } = useAppContext();
    if (pathname === "/auth") return null
    if (!session) return null;
    return (
        <nav className="flex justify-between items-center p-3 shadow-sm rounded-md mb-5 bg-secondary shadow-zinc-50/20 m-4 max-w-5xl mx-auto">
            <div className="flex items-center">
                <Link href="/" className="gradient text-base font-normal tracking-wider">
                    cyberportfol.io/{username}
                </Link>
            </div>

            <div className="flex gap-5 items-center">
                <div className="hidden md:flex gap-5 items-center">
                    <Link href="/explore" className="text-sm text-white/80 hover:text-white">
                        Explore
                    </Link>
                    <Link href="#pricing" className="text-sm text-white/80 hover:text-white">
                        Pricing
                    </Link>
                    <Link href="/build" className="text-sm text-white/80 hover:text-white">
                        Build your own
                    </Link>
                </div>
            </div>
            {!session ? (
                <Link href="/auth" className="text-sm text-white/80 hover:text-white">
                    Sign in
                </Link>
            ) : (
                <span className="text-sm text-white/80 hover:text-white">
                    Hello, {session.data?.user.name?.split(" ")[0]}
                </span>
            )}
        </nav>
    );
}

