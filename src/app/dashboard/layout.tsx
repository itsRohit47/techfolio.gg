'use client';
import Link from "next/link"
import {
    CogIcon, HomeIcon, PaintBucketIcon, HammerIcon, ClipboardIcon, DropletIcon, BlocksIcon, ChartAreaIcon
} from "lucide-react"
import { usePathname } from "next/navigation"
import Button from "@/components/button";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex gap-4 h-screen">
            <SideBar />
            <div className="px-4 py-6 flex-grow overflow-y-auto">
                {children}
            </div>
        </section>
    )
}

function SideBar() {

    const path = usePathname()
    const { data } = useSession()
    const [copied, setCopied] = useState(false)

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: HomeIcon, isPro: false },
        { name: 'Analytics', href: '/dashboard/analytics', icon: ChartAreaIcon, isPro: true },
        { name: 'Build', href: '/dashboard/build', icon: HammerIcon, isPro: false },
        { name: 'Design', href: '/dashboard/design', icon: PaintBucketIcon, isPro: false },
        { name: 'Integrations', href: '/dashboard/integrations', icon: BlocksIcon, isPro: true },
        { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, isPro: false },
        { name: 'Resources', href: '/dashboard/resources', icon: DropletIcon, isPro: false },
    ]
    return (
        <aside className="pt-4 pl-4 flex flex-col gap-2 justify-between h-[calc(100vh-2rem)] sticky top-0">
            <div className={`text-sm text-gray-500 text-center bg-white p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2`}
                onClick={() => {
                    setCopied(true)
                    void window.navigator.clipboard.writeText(`https://techfolio.gg/${data?.user.name?.split(' ')[0]?.toLocaleLowerCase()}`)
                    toast.success('Copied to clipboard')
                    setTimeout(() => {
                        setCopied(false)
                    }, 2000)
                }}
            >
                {!copied ? <ClipboardIcon size="14" /> : '🎉 '}
                {copied ? 'Copied' : `techfolio.gg/${data?.user.name?.split(' ')[0]?.toLocaleLowerCase()}`}
            </div>
            <nav className="w-64 h-full border border-gray-200 rounded-lg bg-white/70 p-2 flex flex-col gap-2 justify-between">
                <ul className="space-y-0 relative">
                    {navItems.map((item) => (
                        <Link href={item.href} key={item.href} className={`px-4 py-3  rounded-lg flex items-center gap-2 ${path === item.href ? 'bg-blue-100 text-blue-500 hover:bg-blue-200/70' : ' text-gray-700 hover:bg-gray-100'}`}>
                            <item.icon size="14" />
                            {item.name}
                        </Link>
                    ))}
                </ul>

            </nav>
            <div className="flex flex-col gap-2">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Publish
                </Button>
            </div>

            <div className="flex items-start justify-center gap-4 text-xs text-gray-500">
                <Link href={'/terms'} className="hover:underline">
                    Terms of Service
                </Link>
                <Link href={'/pp'} className="hover:underline">
                    Privacy Policy
                </Link>
            </div>

        </aside >
    )
}