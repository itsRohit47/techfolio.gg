'use client';
import SideBar from "@/components/sidebar";
import { CommandIcon } from "lucide-react";
import { useState } from "react";
import Preview from "../../components/preview";

export default function AdminPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className="">
            <div className={`fixed inset-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50 transition-transform duration-300 ease-in-out`}>
                <SideBar />
            </div>
            <nav className="flex justify-end p-4 items-center gap-2 fixed right-0 w-max z-50">
                <button className="flex items-center gap-2 border-white/20 px-4 py-2 rounded-md bg-white text-gray-800 shadow-sm border hover:bg-gray-50 active:scale-95"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? "Preview" : "Edit"}
                </button>
                <button className="flex items-center gap-2 bg-violet-500 px-4 py-2 rounded-md text-white  shadow-md hover:bg-violet-600 border border-violet-500 active:scale-95">
                    Deploy
                </button>
            </nav>
            <ul className="flex flex-col gap-2 p-4 fixed bottom-0 right-0 z-20  items-end text-blue-500">
                <li>Featured</li>
            </ul>
            <Preview></Preview>
        </div >
    );
}