'use client';
import Link from "next/link"
import {
    CogIcon, PaintBucketIcon, HammerIcon, ArrowUpRightIcon, ChevronRight
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const links = [
        { name: "Build", href: "/dashboard/build", icon: HammerIcon },
        { name: "Design", href: "/dashboard/design", icon: PaintBucketIcon },
        { name: "Preview", href: "/rohit", icon: ArrowUpRightIcon },
        { name: "Settings", href: "/dashboard/settings", icon: CogIcon },
    ]
    return (
        <section className="h-screen max-w-5xl mx-auto w-full">
            <header className="flex flex-col fixed top-1/2 -translate-y-1/2 left-4  py-3 px-2 items-center justify-between w-max mx-auto gap-y-2 bg-white rounded-full transition-all duration-200 shadow-xl border border-gray-200">
                {links.map((link, index) => (
                    <Link key={index} href={link.href} className={` hover:py-4 relative group p-2 rounded-full flex flex-col items-center gap-x-2 transition-all duration-200 ${pathname === link.href ? ' bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}`}>
                        <link.icon size={14} />
                        <div className="hidden group-hover:flex bg-white p-2 absolute inset-0 translate-y-1 translate-x-12 w-max h-max rounded-lg text-black text-xs">{link.name}</div>
                    </Link>
                ))}
            </header>
            {children}
        </section>
    )
}