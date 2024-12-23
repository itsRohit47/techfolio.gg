/* eslint-disable @typescript-eslint/no-base-to-string */
'use client';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Home, Book, Briefcase, Award, Code } from "lucide-react";
import { usePathname } from "next/navigation";


const getIcon = (name: string) => {
    switch (name) {
        case 'Home':
            return <Home strokeWidth={1} size={16} />;
        case 'Education':
            return <Book strokeWidth={1} size={16} />;
        case 'Experience':
            return <Briefcase strokeWidth={1} size={16} />;
        case 'Certificates':
            return <Award strokeWidth={1} size={16} />;
        case 'Projects':
            return <Code strokeWidth={1} size={16} />;
        default:
            return null;
    }
}

const NavLinks = () => {
    const links = ['Home', 'Education', 'Experience', 'Certificates', 'Projects'];
    const path = usePathname();
    const { data: session } = useSession();
    return (
        <div className="flex gap-2 items-center overflow-auto">
            {links.map((link) => (
                <Link
                    href={link === 'Home' ? `/${session?.user?.username}` : `/${session?.user?.username}/${link.toLowerCase()}`}
                    key={link}
                    className={`flex items-center gap-1 p-2 border text-sm ${path === `/${session?.user?.username}${link === 'Home' ? '' : `/${link.toLowerCase()}`}` ? 'text-white border-gray-50/50' : 'text-white/80'} hover:text-white bg-secondary rounded-lg transition-all duration-300`}
                >
                    {getIcon(link)}
                </Link>
            ))
            }
        </div >
    );
}

export default NavLinks;