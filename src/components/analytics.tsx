import { XIcon } from "lucide-react";
import { useAppContext } from "./context";

export default function Analytics() {
    const { analytics, setAnalytics } = useAppContext();


    if (!analytics) {
        return null;
    }

    return (
        <div
            className={`max-w-xl lg:max-w-sm w-full border-l shadow-2xl bg-primary fixed top-0 right-0 h-full overflow-scroll p-4 flex flex-col gap-3`}
        >
            <div className="flex justify-between items-center">
                <h1 className="text-sm">Analytics</h1>
                <button onClick={() => setAnalytics(!analytics)}>
                    <XIcon size={32} className="icon-button" />
                </button>
            </div>
            <h2 className="text-lg">Analytics</h2>
            <p className="text-sm text-secondary">Coming soon</p>
        </div>
    );
}