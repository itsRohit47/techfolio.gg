'use client';
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserNav from "./user-nav";

import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();
    const session = useSession();
    if (pathname === "/auth") return null
    return (
        <nav className="flex justify-between items-center rounded-lg  dark:text-white dark:text-white/80 ">
            <div className="flex items-center">
                <Link href={"/"} className="text-xs tracking-wider">
                    <span className="bg-gray-50 dark:bg-secondary border dark:border-none px-3 py-2 rounded-lg">whoami</span>
                </Link>

            </div>
            <div className="flex gap-5 items-center">
                <div className="hidden md:flex gap-5 items-center">
                    {!session.data ? (
                        <>
                            <Link href="/explore" className="text-sm text-white/80 hover:text-white">
                                Explore
                            </Link>
                            <Link href="#pricing" className="text-sm text-white/80 hover:text-white">
                                Pricing
                            </Link>
                            <Link href="/build" className="text-sm text-white/80 hover:text-white">
                                Build your own
                            </Link>
                            <Link href="/auth?signin" className="text-sm bg-secondary text-white/80 border border-secondary hover:text-white rounded-lg px-3 py-2">
                                Sign In
                            </Link>
                        </>
                    ) : (
                        <UserNav />
                    )}
                </div>
            </div>
        </nav >
    );
}