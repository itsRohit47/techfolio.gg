'use client';
import { usePathname } from "next/navigation"
import NavItem from "./NavItem"
import { useSession } from "next-auth/react"


type NavLink = {
    name: string;
    href: string;
    iconName: string;
}

type NavBarProps = {
    links?: NavLink[];
}

export default function NavBar({ links }: NavBarProps) {
    const pathname = usePathname()
    const session = useSession()

    const l = [
        { name: 'Home', href: '/dashboard', iconName: 'Home' },
        { name: "Build", href: "/dashboard/build", iconName: "Hammer" },
        { name: "Design", href: "/dashboard/design", iconName: "PaintBucket" },
        { name: "Profile", href: "/dashboard/profile", iconName: "User" },
        // { name: "Settings", href: "/dashboard/settings", iconName: "Cog" },
        { name: "Preview", href: `/${session.data?.user.username}`, iconName: "ArrowUpRight" },
        { name: "Sign out", href: "/api/auth/signout", iconName: "Power" },
    ]

    const links2 = links || l


    if (session.status === "unauthenticated") {
        return null
    }

    return (
        <div className="fixed lg:-translate-x-[99%] ml-px hover:translate-x-0 transition duration-300 lg:left-0 lg:top-1/2 left-1/2 bottom-4 z-50 -translate-x-1/2 lg:-translate-y-1/2  flex flex-col gap-4 items-center justify-center">
            <header className="flex lg:flex-col w-full py-2 lg:py-3 px-2 items-center justify-between mx-auto gap-2 bg-white rounded-lg transition-all duration-200  z-50 shadow-xl border border-gray-200">
                {links2?.map((link, index) => (
                    <NavItem
                        key={index}
                        name={link.name}
                        href={link.href}
                        iconName={link.iconName as keyof typeof import("lucide-react")}
                        pathname={pathname}
                    />
                ))}
            </header>
        </div>

    )
}
