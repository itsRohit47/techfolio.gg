'use client';
import SideBar from "@/components/sidebar";
import { useState } from "react";
import Preview from "../../components/preview";
import { useSession } from "next-auth/react";


export default function AdminPage() {
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="">
            <div className={`fixed inset-0 h-screen w-max transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50 transition-transform duration-300 ease-in-out`}>
                <SideBar></SideBar>
            </div>
            <div className={`fixed inset-0 bg-black/50 z-20 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}>
            </div>
            <nav className="flex justify-end p-4 items-center gap-2 fixed right-0 w-max z-50">
                <button className="flex items-center gap-2 border-white/20 px-4 py-2 rounded-md bg-white text-gray-800 shadow-sm border hover:bg-gray-50 active:scale-95"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? "Preview" : "Edit"}
                </button>
                <button className="flex items-center gap-2 bg-violet-500 px-4 py-2 rounded-md text-white  shadow-xl border-white/20 hover:bg-violet-600 border active:scale-95">
                    Deploy
                </button>
            </nav>
            <Preview username={session?.user.username || ''}></Preview>
        </div >
    );
}