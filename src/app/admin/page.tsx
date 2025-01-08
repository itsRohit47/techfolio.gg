'use client';
import SideBar from "@/components/sidebar";
import { useState } from "react";
import Preview from "../../components/preview";
import { useSession } from "next-auth/react";
import { PaletteIcon, Edit2Icon, RocketIcon } from "lucide-react";



export default function AdminPage() {
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [designMode, setDesignMode] = useState(false);
    return (
        <div className="">
            <div className={`fixed inset-0 h-screen w-max transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50 transition-transform duration-300 ease-in-out`}>
                <SideBar></SideBar>
            </div>
            <div className={`fixed inset-0 bg-black/50 z-20 ${designMode ? 'block' : 'hidden'}`} onClick={() => setDesignMode(false)}>
            </div>
            <div className={`fixed inset-0 h-screen w-max transform ${designMode ? 'translate-x-0' : '-translate-x-full'} z-50 transition-transform duration-300 ease-in-out`}>
                <SideBar></SideBar>
            </div>
            <div className={`fixed inset-0 bg-black/50 z-20 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}>
            </div>
            <nav className="flex justify-end p-4 items-center gap-2 fixed right-0 w-max z-50 text-xs">
                <button className="flex items-center gap-2 border-gray-200 px-4 py-2 rounded-md bg-white text-gray-800 shadow-sm border hover:bg-gray-50 active:scale-95"
                    onClick={() => {
                        setSidebarOpen(!sidebarOpen);
                        if (!sidebarOpen) setDesignMode(false);
                    }}
                >
                    {sidebarOpen ? "Preview" : <Edit2Icon size={14} />} {sidebarOpen ? null : "Edit"}
                </button>
                {/* <button className="flex items-center gap-2 border-gray-200 px-4 py-2 rounded-md bg-white text-gray-800 shadow-sm border hover:bg-gray-50 active:scale-95"
                    onClick={() => {
                        setDesignMode(!designMode);
                        if (!designMode) setSidebarOpen(false);
                    }}
                >
                    {designMode ? "Preview" : <PaletteIcon size={14}/>} {designMode ? null : "Design"}
                </button> */}

                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white shadow-sm border border-blue-600 hover:bg-blue-600 active:scale-95">
                    <RocketIcon size={16} />  Deploy
                </button>
            </nav>
            <Preview username={session?.user.username || ''}></Preview>
        </div >
    );
}