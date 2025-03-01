/* eslint-disable @next/next/no-img-element */
import { StyleObject } from "@/types/common";
import { Size, Spacing } from "@/types/common";
import { Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { useState } from 'react';
import Link from 'next/link';

type FilterType = 'all' | 'public' | 'user';

interface FilterPillProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

function FilterPill({ label, isActive, onClick }: FilterPillProps) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors border
                ${isActive
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-neutral-300'
                }`}
        >
            {label}
        </button>
    );
}

interface PresetTheme {
    id: string;
    name: string;
    style: StyleObject;
}

interface ThemePresetProps {
    onSelect: (style: StyleObject, themeId: string) => void;
    currentThemeId?: string | null;
}

interface PreviewProps {
    style: StyleObject;
}

interface UserInfo {
    name: string;
    image: string;
}

interface PresetData extends PresetTheme {
    userId: string | null;
    isBuiltIn: boolean;
    user?: UserInfo;  // Add user info
}

// Add PresetPreview component
function PresetPreview({ style }: PreviewProps) {
    return (
        <div className="w-full h-24 rounded-md mb-2 relative overflow-hidden">
            {/* Background Layer */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: style.background,
                    backgroundImage: style.backgroundImage ? `url(${style.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Overlay Layer */}
            {style.backgroundOverlay && (
                <div className={`absolute inset-0 ${style.backgroundOverlay}`} />
            )}

            {/* Content Preview */}
            <div className={`relative z-10 h-full p-3 flex flex-col ${style.headerAlignment === 'center' ? 'items-center text-center' :
                style.headerAlignment === 'right' ? 'items-end text-right' :
                    'items-start text-left'
                }`}>
                <div className="h-4 w-4 rounded-full mb-2" style={{ backgroundColor: style.assetCardBackground }} />
                <div className="h-2 w-24 rounded-sm mb-2" style={{ backgroundColor: style.assetCardBackground }} />
                <div className="h-2 w-32 rounded-sm" style={{ backgroundColor: style.assetCardBackground }} />
                <div className="h-2 w-24 mt-auto rounded-full" style={{ backgroundColor: style.footerButtonBg }} />

            </div>
        </div>
    );
}

function DeletePresetModal({ isOpen, onClose, onConfirm, presetName }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    presetName: string;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Delete Preset</h3>
                <p className="text-gray-600 mb-4">
                    Are you sure you want to delete &quot;{presetName}&quot;? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main component
export default function ThemePresets({ onSelect, currentThemeId }: ThemePresetProps) {
    const { data: session } = useSession();
    const { data: presets, isLoading } = api.asset.getStylePresets.useQuery();
    const utils = api.useUtils();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState<{ id: string, name: string } | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const { mutate: deletePreset } = api.asset.deleteStylePreset.useMutation({
        onSuccess: () => {
            toast.success('Preset deleted');
            void utils.asset.getStylePresets.invalidate();
        }
    });

    // Combine built-in presets with user presets
    const allPresets = [
        ...(presets?.map(preset => ({
            id: preset.id,
            name: preset.name,
            style: preset.style as unknown as StyleObject,
            isBuiltIn: false,
            userId: preset.userId,
            user: preset.user // This will come from the backend
        })) ?? [])
    ];

    const userPresets = allPresets.filter(preset => preset.userId === session?.user?.id);
    const publicPresets = allPresets.filter(preset => preset.isBuiltIn && preset.userId !== session?.user?.id);

    const filteredPresets = {
        all: allPresets,
        public: publicPresets,
        user: userPresets
    }[activeFilter];

    const handleDelete = (preset: { id: string, name: string }, e: React.MouseEvent) => {
        e.stopPropagation();
        setPresetToDelete(preset);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (presetToDelete) {
            deletePreset({ id: presetToDelete.id });
            setDeleteModalOpen(false);
            setPresetToDelete(null);
        }
    };

    if (isLoading) return <div className="h-96 flex items-center justify-center">Loading presets...</div>;

    if (!allPresets.length) return <div className="h-96 flex text-center px-20 items-center justify-">No presets found, switch to the custom design tab to save your current design as a preset.</div>;


    return (
        <>
            <div className="space-y-4">
                {/* Filter Pills */}
                <div className="flex gap-2 px-px">
                    <FilterPill
                        label="All Presets"
                        isActive={activeFilter === 'all'}
                        onClick={() => setActiveFilter('all')}
                    />
                    <FilterPill
                        label="Public"
                        isActive={activeFilter === 'public'}
                        onClick={() => setActiveFilter('public')}
                    />
                    <FilterPill
                        label="My Presets"
                        isActive={activeFilter === 'user'}
                        onClick={() => setActiveFilter('user')}
                    />
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-2 gap-4 py-4 px-2">
                    {filteredPresets.map((preset) => (
                        <div
                            key={preset.id}
                            onClick={() => onSelect(preset.style, preset.id)}
                            className={`p-1 rounded-lg border border-gray-300 transition-all cursor-pointer ${currentThemeId === preset.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:border-gray-500'
                                }`}
                        >
                            <PresetPreview style={preset.style} />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{preset.name}</span>
                                <div className="flex items-center gap-2">
                                    {!preset.isBuiltIn && preset.user && (
                                        <Link
                                            href={`/${preset.user.username}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-2  hover:underline"
                                        >
                                            <img
                                                src={preset.user.image || '/default-avatar.png'}
                                                alt={preset.user.name ?? ''}
                                                className="w-5 h-5 rounded-full object-cover"
                                            />
                                            <span className="text-xs text-gray-500 hover:text-blue-600">{preset.user.name?.split(' ')[0]}</span>
                                        </Link>
                                    )}
                                    {preset.userId === session?.user?.id && (
                                        <div
                                            role="button"
                                            onClick={(e) => handleDelete({ id: preset.id, name: preset.name }, e)}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded-full cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPresets.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        {activeFilter === 'user'
                            ? "You haven't created any presets yet"
                            : activeFilter === 'public'
                                ? "No public presets available, when you create a preset you can choose to make it public"
                                : "No presets available, when you create a public preset it will appear here"}
                    </div>
                )}
            </div>

            <DeletePresetModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setPresetToDelete(null);
                }}
                onConfirm={confirmDelete}
                presetName={presetToDelete?.name ?? ''}
            />
        </>
    );
}