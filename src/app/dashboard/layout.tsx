'use client';
import Link from "next/link"
import {
    CogIcon, PaintBucketIcon, HammerIcon, ChevronLeft, ChevronRight
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <section className="flex h-screen pr-4">
            <SideBar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            <div className={`px-4 py-4 flex-grow overflow-y-auto mx-auto border border-gray-200 bg-white/80 h-[calc(100vh-2rem)] m-4 rounded-lg shadow-xl`}>
                {children}
            </div>
        </section>
    )
}

function SideBar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
    const path = usePathname();
    const [copied, setCopied] = useState(false)

    const navItems = [
        { name: 'Build', href: '/dashboard/build', icon: HammerIcon, isPro: false },
        { name: 'Design', href: '/dashboard/design', icon: PaintBucketIcon, isPro: false },
        { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, isPro: false },
    ]
    return (
        <aside className=" flex flex-col gap-2 justify-between pt-2 pb-4">
            <nav className="w-max h-full  p-2 flex flex-col gap-2 justify-between">
                <ul className="space-y-1 relative">
                    {navItems.map((item) => (
                        <Link href={item.href} key={item.href} className={`px-4 py-3  rounded-lg flex items-center gap-2 ${path === item.href ? 'bg-blue-100 text-blue-500 hover:bg-blue-200/70' : ' text-gray-700 hover:bg-violet-200/30'}`}>
                            <item.icon size="14" />
                            {isCollapsed ? null : item.name}
                        </Link>
                    ))}
                </ul>
                <button onClick={onToggle} className="fixed bottom-4 left-4 p-2 bg-white rounded-full shadow-lg">
                    {isCollapsed ? <ChevronRight size="24" /> : <ChevronLeft size="24" />}
                </button>
            </nav>
        </aside >
    )
}