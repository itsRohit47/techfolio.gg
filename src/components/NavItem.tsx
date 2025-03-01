'use client';
import Link from "next/link"
import * as Icons from "lucide-react"

type NavItemProps = {
    name: string;
    href: string;
    iconName: keyof typeof Icons;
    pathname: string;
}

export default function NavItem({ name, href, iconName, pathname }: NavItemProps) {
    const Icon = Icons[iconName] as React.ElementType;
    return (
        <Link href={href}
            className={`relative group p-2 rounded-md flex flex-col items-center gap-x-2 transition-all  duration-200 
                ${name === "Sign out"
                    ? "hover:bg-red-100"
                    : pathname === href
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "hover:bg-gray-100"
                }`}>
            <Icon size={14} className={`${name === "Sign out" ? "group-hover:text-red-500" : ""}`} />
            <div className={`${pathname === href ? 'flex' : 'hidden group-hover:flex'} bg-white px-2 py-2 absolute -top-px left-12 w-max h-max rounded-md text-xs 
                ${name === "Sign out" ? "text-red-500" : "text-black"}`}>
                {name}
            </div>
        </Link>
    )
}
