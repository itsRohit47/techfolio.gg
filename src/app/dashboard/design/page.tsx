'use client';
import Portfolio from "@/components/portfolio";
import Toggle from "@/components/toogle";
import SettingsPanel from "@/components/design/SettingsPanel";
import { Size, Spacing, defaultStyle } from "@/types/common";
import { useState } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { PaintBucketIcon, WrenchIcon } from "lucide-react";

export default function DesignPage() {
    const [desktopMode, setDesktopMode] = useState(false);
    return (
        <main className={`grid gap-4 h-screen overflow-auto md:grid-cols-${desktopMode ? 1 : 2}`}>
            <div className="flex fixed z-50 top-4 right-4 gap-2 flex-col text-xs">
                <Link href={`/dashboard/design`} passHref className="bg-white border text-black px-2 py-2 rounded-md shadow-md flex items-center justify-center gap-2 hover:bg-gray-100">
                    Edit design <PaintBucketIcon className="w-4 h-4" />
                </Link>
                <Link href={`/dashboard/build`} passHref className="bg-white border text-black px-2 py-2 rounded-md shadow-md flex items-center gap-2 justify-center hover:bg-gray-100">
                    Edit content <WrenchIcon className="w-4 h-4" />
                </Link>
                <div className=" text-black px-2 py-1 flex items-center gap-2">
                    Desktop Mode <Toggle onToggle={(checked) => setDesktopMode(checked)} />
                </div>
            </div>
            {!desktopMode && (
                <div className="h-screen overflow-scroll">
                    <SettingsPanel style={defaultStyle} />
                </div>
            )
            }
            <div className="overflow-scroll rounded-xl border-4 border-black border-opacity-10  my-4">
                <Portfolio style={defaultStyle} preview />
            </div>
        </main >
    );
}