import { Link } from "lucide-react";
import { useState } from "react";

export default function HeroSection() {
    const [username, setUsername] = useState<string>('');
    return (
        <div className="flex flex-col items-center justify-center p-4 lg:p-32 h-full w-full gap-5 ">
            <h1 className="text-5xl lg:text-6xl font-bold text-center text-primary-foreground gradient">Build & share your cyber portfolio!</h1>
            <p className="text-sm lg:text-lg text-center max-w-2xl text-secondary">
                Everything you need to create high quality data projects and showcase them on your own beautiful portfolio website.
            </p>
            <div className={`flex gap-px items-center justify-center border border-gray-700 rounded-lg p-2 shadow-xl`}>
                <div className="gradient">cyberportfol.io/</div>
                <input
                    type="text"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    className="p-0 w-full border-none bg-transparent rounded-none text-sm text-secondary outline-none focus:ring-0"
                    placeholder="rohitbajaj"
                    minLength={5}
                />
                <Link href={`auth?user=${username}`} className="text-sm bg-secondary border border-secondary text-white/80 hover:text-white rounded-lg px-3 py-2">
                    Claim
                </Link>
            </div>
        </div >
    );
}