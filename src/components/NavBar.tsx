'use client';
import { usePathname } from "next/navigation"
import NavItem from "./NavItem"

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
        <div className="fixed lg:-translate-x-[99%] ml-px hover:translate-x-0 transition duration-300 lg:left-0 lg:top-1/2 left-1/2 bottom-4 z-50 -translate-x-1/2 lg:-translate-y-1/2  flex flex-col gap-4 items-center justify-center">
            <header className="flex lg:flex-col w-full py-2 lg:py-3 px-2 items-center justify-between mx-auto gap-2 bg-white rounded-lg transition-all duration-200  z-50 shadow-xl border border-gray-200">
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
