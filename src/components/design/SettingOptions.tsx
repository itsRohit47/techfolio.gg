interface SettingRowProps {
    label: string;
    children: React.ReactNode;
}

export function SettingRow({ label, children }: SettingRowProps) {
    return (
        <div className="grid grid-cols-3 gap-4 items-center py-2">
            <label className="text-sm text-gray-600">{label}</label>
            <div className="col-span-2">{children}</div>
        </div>
    );
}

interface ColorOptionProps {
    color: string;
    isSelected: boolean;
    onClick: () => void;
    label: string;
}

export function ColorOption({ color, isSelected, onClick, label }: ColorOptionProps) {
    // Convert text-blue-500 or bg-blue-500 to bg-blue-500
    const bgClass = color.startsWith('text-') ? `bg-${color.substring(5)}` : color;

    return (
        <button
            onClick={onClick}
            className={`w-8 h-8 rounded-full ${bgClass} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} border border-gray-200`}
            title={label}
        >
            {color.includes('white') && <span className="block w-full h-full rounded-full bg-white" />}
        </button>
    );
}

interface IconOptionProps {
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
    label: string;
}

export function IconOption({ icon, isSelected, onClick, label }: IconOptionProps) {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-md ${isSelected ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}
            title={label}
        >
            {icon}
        </button>
    );
}

export function ToggleOption({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`px-3 py-1.5 rounded-md text-sm ${checked ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}
        >
            {label}
        </button>
    );
}
