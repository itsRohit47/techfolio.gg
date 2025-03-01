'use client';
import NavBar from "@/components/NavBar"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Breadcrumb from '@/components/breadcrumb';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = useSession()

    const links = [
        { name: 'Home', href: '/dashboard', iconName: 'Home' },
        { name: "Build", href: "/dashboard/build", iconName: "Hammer" },
        { name: "Design", href: "/dashboard/design", iconName: "PaintBucket" },
        { name: "Profile", href: "/dashboard/profile", iconName: "User" },
        { name: "Settings", href: "/dashboard/settings", iconName: "Cog" },
        { name: "Preview", href: `/${session.data?.user.username}`, iconName: "ArrowUpRight" },
        { name: "Sign out", href: "/api/auth/signout", iconName: "Power" },
    ]

    return (
        <section className="h-screen max-w-5xl mx-auto w-full">
            <NavBar links={links} />
            {children}
        </section>
    )
}