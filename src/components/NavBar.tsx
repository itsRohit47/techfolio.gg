'use client';
import { usePathname } from "next/navigation"
import NavItem from "./NavItem"
import type { LucideIcon } from "lucide-react"
import Breadcrumb from "./breadcrumb";

type NavLink = {
    name: string;
    href: string;
    iconName: string;
}

type NavBarProps = {
    links: NavLink[];
}

export default function NavBar({ links }: NavBarProps) {
    const pathname = usePathname()

    return (
        <div className="fixed top-1/2 -translate-y-1/2 left-6 flex flex-col gap-4 items-center justify-center">
            <header className="flex flex-col py-3 px-2 items-center justify-between w-max mx-auto gap-y-2 bg-white rounded-lg transition-all duration-200  z-50 shadow-xl border border-gray-200">
                {links.map((link, index) => (
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
