'use client';
import Link from "next/link";
import NavMenu from "./user-nav";
import { SendToBackIcon } from "lucide-react";


export default function NavBar() {
    return (
        <nav className="flex justify-between items-center  dark:text-white dark:text-white/80 p-3">
            <div className="">
                <span className="flex items-center gap-2">
                    <SendToBackIcon size={16} />
                    <div className="">
                        <span className="">Grad</span>
                        <span className="dark:text-primary text-gray-600">Reach</span>
                    </div>
                </span>
            </div>
            <NavMenu />
        </nav >
    );
}