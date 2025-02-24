'use client';
import Portfolio from "@/components/portfolio";
import Toggle from "@/components/toogle";
import SettingsPanel from "@/components/design/SettingsPanel";
import { Size, Spacing, defaultStyle } from "@/types/common";
import { useState } from "react";

export default function DesignPage() {
    const [desktopMode, setDesktopMode] = useState(false);
    const [style, setStyle] = useState(defaultStyle);

    return (
        <main className={`grid gap-4 h-full md:grid-cols-${desktopMode ? 1 : 2}`}>
            <div className="overflow-auto absolute bottom-6  px-4 py-3 z-50 left-1/2 transform -translate-x-1/2 flex justify-center gap-4 bg-gray-700 text-white shadow-xl rounded-full items-center">
                Desktop mode <Toggle onToggle={() => setDesktopMode(!desktopMode)} />
            </div>
            {!desktopMode && (
                <div className="overflow-auto h-full">
                    <SettingsPanel style={style} onStyleChange={setStyle} />
                </div>
            )
            }
            <div className="overflow-auto">
                <div className={`shadow-sm h-full border rounded-md relative w-full overflow-hidden ${style.background} ${style.textColor}`}>
                    <Portfolio style={style} />
                </div>
            </div>
        </main >
    );
}