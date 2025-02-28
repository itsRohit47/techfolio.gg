import { PencilIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingRowProps {
    label: string;
    children: React.ReactNode;
}

export function SettingRow({ label, children }: SettingRowProps) {
    return (
        <div className="grid grid-cols-1 items-center">
            <label className="text-xs text-gray-700 font-extrabold mb-4">{label}</label>
            <div className="">{children}</div>
        </div>
    );
}

interface ColorOptionProps {
    color: string;
    currentColor?: string;
    isSelected: boolean;
    onClick: (color: string) => void;
    label: string;
    icon?: React.ReactNode;
    presetColors?: Array<{ value: string; label: string }>; // Add this prop
}

export function ColorOption({ color, currentColor, isSelected, onClick, label, icon, presetColors }: ColorOptionProps) {
    const isCustomColor = currentColor && presetColors?.every(c => c.value !== currentColor);

    // If it's the custom option (pencil icon with color input)
    if (color === 'custom') {
        return (
            <div className={`w-8 h-8 rounded-full relative ${isCustomColor ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                <input
                    type="color"
                    value={currentColor || '#000000'}
                    onChange={(e) => onClick(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    title={label}
                />
                <div
                    className={`w-full h-full rounded-full flex items-center justify-center bg-white
                        ${isCustomColor ? 'border-2' : 'border'}`}
                    style={{ borderColor: isCustomColor ? currentColor : '#e5e7eb' }}
                >
                    <PencilIcon className="w-3 h-3 text-gray-600" />
                </div>
            </div>
        );
    }

    // For preset colors
    return (
        <button
            onClick={() => onClick(color)}
            className={`w-8 h-8 rounded-full ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} border border-gray-200`}
            style={{ backgroundColor: color }}
            title={label}
        />
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
            className={`p-2 rounded-md ${isSelected ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-500 hover:bg-blue-200/80' : 'bg-black bg-opacity-5 hover:bg-opacity-10 text-gray-600'}`}
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
            className={`px-3 py-1.5 rounded-md text-sm ${checked ? 'bg-blue-100 border border-blue-500 hover:border-blue-600 hover:bg-blue-200/70 text-blue-600' : 'bg-black bg-opacity-5 hover:bg-opacity-10 border hover:border-gray-400 border-gray-300 text-gray-600'}`}
        >
            {label}
        </button>
    );
}
