'use client';
import { SidebarIcon } from "lucide-react";
import SideBar from "./sidebar";


export default function NavBar() {
    return (
        <nav className="flex justify-between p-4 items-center">
            <button className="flex items-center gap-4  p-2 rounded-lg hover:bg-gray-100">
                <SidebarIcon size={24} opacity={.7} />
            </button>
            <button className="flex items-center gap-2  bg-blue-500 px-4 py-2 rounded-lg text-white active:bg-blue-600 hover:bg-blue-600">
                <h1 className="">Deploy</h1>
            </button>
        </nav >
    );
}
