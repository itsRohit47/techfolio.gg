/* eslint-disable @next/next/no-img-element */
import { Alignment, Size, Spacing, StyleObject } from "@/types/common";
import { SettingRow, ColorOption, IconOption, ToggleOption } from "./SettingOptions";
import { BsLayoutSidebarReverse, BsLayoutTextWindowReverse, BsLayoutTextWindow } from "react-icons/bs";
import { LuAlignLeft, LuAlignCenter, LuAlignRight } from "react-icons/lu";
import { TbSpacingVertical } from "react-icons/tb";
import { api } from "@/trpc/react";
import { PencilIcon, ChevronDown, ChevronUp } from 'lucide-react';
import ThemePresets from './ThemePresets';
import { useEffect, useState } from 'react';
import { ImageIcon, Loader, UploadIcon, Trash2 } from 'lucide-react';
import toast from "react-hot-toast";
import { headerOptions } from '../headers';
import Toggle from "../toogle";
import SavePresetModal from './SavePresetModal';
import { useSession } from "next-auth/react";

// Updated SectionTitle component
function SectionTitle({ title, isOpen, onClick }: {
    title: string;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 border-b border-b-gray-400 pb-2 mb-4 hover:text-blue-600"
        >
            {title}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
    );
}

interface SettingsPanelProps {
    style?: StyleObject;
}

export default function SettingsPanel({ style }: SettingsPanelProps) {
    const utils = api.useUtils();
    const session = useSession();
    const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
    const [selectedBgImage, setSelectedBgImage] = useState<File | null>(null);
    const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);
    const [uploadingBg, setUploadingBg] = useState(false);
    const [openSection, setOpenSection] = useState('Background'); // Default open section
    const [showSavePresetModal, setShowSavePresetModal] = useState(false);

    const { data: savedStyle, isLoading } = api.asset.getPortfolioStyle.useQuery({
        username: session.data?.user?.username
    }, {
        enabled: !!session.data?.user?.username
    });

    // Add local state to manage optimistic updates
    const [localStyle, setLocalStyle] = useState<StyleObject>(() => {
        const initialStyle = savedStyle ?? style ?? {} as StyleObject;
        return {
            ...initialStyle,
            layoutSize: initialStyle.layoutSize as Size,
            elementSpacing: initialStyle.elementSpacing as Spacing,
            headerAlignment: initialStyle.headerAlignment as Alignment
        } as StyleObject;
    });

    // Update local state when savedStyle changes
    useEffect(() => {
        if (savedStyle) {
            setLocalStyle(savedStyle as StyleObject);
        }
    }, [savedStyle]);

    useEffect(() => {
        // Only switch to custom tab if themeId is explicitly null, undefined, or 'None'
        if (savedStyle?.themeId === null || savedStyle?.themeId === undefined || savedStyle?.themeId === 'None') {
            setActiveTab('custom');
        } else {
            setActiveTab('presets');
        }
    }, [savedStyle?.themeId]);

    const { mutate: updateStyle } = api.asset.updatePortfolioStyle.useMutation({
        onMutate: async (newStyle) => {
            // Cancel outgoing fetches for both queries
            await utils.asset.getPortfolioStyle.cancel();
            await utils.asset.getUserPortfolioWithStyle.cancel();

            // Snapshot previous values
            const previousStyle = utils.asset.getPortfolioStyle.getData();
            const previousPortfolio = utils.asset.getUserPortfolioWithStyle.getData({ username: session.data?.user?.username ?? '' });

            // Update PortfolioStyle cache
            utils.asset.getPortfolioStyle.setData({ username: session.data?.user?.username ?? '' }, old => {
                if (!old) return old;
                return {
                    ...old,
                    ...newStyle
                };
            });

            // Update Portfolio with Style cache
            utils.asset.getUserPortfolioWithStyle.setData(
                { username: session.data?.user?.username ?? '' },
                old => {
                    if (!old?.style) return old;
                    return {
                        ...old,
                        style: {
                            ...old.style,
                            ...newStyle,
                            id: old.style.id // Preserve the required id field
                        }
                    };
                }
            );

            return { previousStyle, previousPortfolio };
        },
        onError: (err, newStyle, context) => {
            // Revert both caches on error
            utils.asset.getPortfolioStyle.setData(
                { username: session.data?.user?.username ?? '' },
                context?.previousStyle
            );
            utils.asset.getUserPortfolioWithStyle.setData(
                { username: session.data?.user?.username ?? '' },
                context?.previousPortfolio
            );
        },
        onSettled: () => {
            // Invalidate both queries after settling
            void utils.asset.getPortfolioStyle.invalidate();
            void utils.asset.getUserPortfolioWithStyle.invalidate();
        },
    });

    const { mutate: savePreset } = api.asset.saveStylePreset.useMutation({
        onSuccess: () => {
            toast.success('Preset saved successfully');
            void utils.asset.getStylePresets.invalidate();
        },
    });

    const handleCustomStyleUpdate = (updates: Partial<StyleObject>) => {
        // Simply call updateStyle directly without debouncing
        updateStyle({
            ...updates,
            themeId: null // Explicitly remove theme when making custom changes
        });
        setActiveTab('custom');
    };

    const handlePresetSelect = (newStyle: StyleObject, themeId: string) => {
        // Don't debounce preset selection as it's a deliberate action
        updateStyle({
            ...newStyle,
            themeId
        });
    };

    const handleSavePreset = (name: string, isPublic: boolean) => {
        savePreset({
            name,
            style: currentStyle,
            isPublic,
        }, {
            onSuccess: (newPreset) => {
                // Switch to presets tab and select the new preset
                setActiveTab('presets');
                handlePresetSelect(currentStyle, newPreset.id);
                toast.success('Preset saved successfully');
            }
        });
    };

    // Use the saved style for initial state and cast to StyleObject
    const currentStyle: StyleObject = localStyle;

    const backgroundColors = [
        // Light Mode
        { value: '#FFFFFF', label: 'White' },
        { value: '#F8FAFC', label: 'Light Gray' },
        { value: '#F1F5F9', label: 'Cool Gray' },
        // Dark Mode
        { value: '#1E293B', label: 'Navy' },
        { value: '#0F172A', label: 'Dark Blue' },
        { value: '#020617', label: 'Black' },
        { value: 'custom', label: 'Custom' }  // Removed icon prop
    ];

    const nameColors = [
        // Light Mode
        { value: '#000000', label: 'Black' },
        { value: '#334155', label: 'Slate' },
        { value: '#475569', label: 'Gray' },
        // Dark Mode
        { value: '#FFFFFF', label: 'White' },
        { value: '#F1F5F9', label: 'Light' },
        { value: '#E2E8F0', label: 'Silver' },
        { value: 'custom', label: 'Custom' }  // Removed icon prop
    ];

    const descriptionColors = [
        // Light Mode
        { value: '#334155', label: 'Slate' },
        { value: '#475569', label: 'Gray' },
        { value: '#64748B', label: 'Medium' },
        // Dark Mode
        { value: '#F1F5F9', label: 'Light' },
        { value: '#E2E8F0', label: 'Silver' },
        { value: '#CBD5E1', label: 'Gray' },
        { value: 'custom', label: 'Custom' }  // Removed icon prop
    ];

    const linkColors = [
        // Light Mode
        { value: '#2563EB', label: 'Blue' },
        { value: '#4F46E5', label: 'Indigo' },
        { value: '#7C3AED', label: 'Purple' },
        // Dark Mode
        { value: '#60A5FA', label: 'Light Blue' },
        { value: '#818CF8', label: 'Light Indigo' },
        { value: '#A78BFA', label: 'Light Purple' },
        { value: 'custom', label: 'Custom' }  // Removed icon prop
    ];

    const locationColors = [
        // Light Mode
        { value: '#334155', label: 'Slate' },
        { value: '#475569', label: 'Gray' },
        { value: '#64748B', label: 'Medium' },
        // Dark Mode
        { value: '#F1F5F9', label: 'Light' },
        { value: '#E2E8F0', label: 'Silver' },
        { value: '#CBD5E1', label: 'Gray' },
        { value: 'custom', label: 'Custom' }
    ];

    const handleColorChange = (type: 'background' | 'name' | 'description' | 'link' | 'location', selectedColor: string) => {
        const updates = {
            [`${type}${type === 'background' ? '' : 'Color'}`]: selectedColor
        };
        console.log('Color update:', updates); // Add this for debugging
        handleCustomStyleUpdate(updates);
    };

    const sizeMappings = {
        [Size.SM]: <BsLayoutSidebarReverse className="w-5 h-5" />,
        [Size.MD]: <BsLayoutTextWindowReverse className="w-5 h-5" />,
        [Size.LG]: <BsLayoutTextWindow className="w-5 h-5" />
    };

    const alignmentMappings = {
        'left': <LuAlignLeft className="w-5 h-5" />,
        'center': <LuAlignCenter className="w-5 h-5" />,
        'right': <LuAlignRight className="w-5 h-5" />
    };

    const spacingMappings = {
        [Spacing.COMPACT]: {
            icon: <TbSpacingVertical className="w-4 h-4" />,
            label: 'Compact'
        },
        [Spacing.NORMAL]: {
            icon: <TbSpacingVertical className="w-5 h-5" />,
            label: 'Normal'
        },
        [Spacing.RELAXED]: {
            icon: <TbSpacingVertical className="w-6 h-6" />,
            label: 'Relaxed'
        }
    };

    const handleBgImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedBgImage(file);
            setBgImagePreview(URL.createObjectURL(file));
        }
    };

    const handleBgImageUpload = async () => {
        if (!selectedBgImage) return;

        try {
            setUploadingBg(true);
            const formData = new FormData();
            formData.append('file', selectedBgImage);

            const response = await fetch('/api/image/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload image');
            const data = await response.json();

            // Update style with new background image
            handleCustomStyleUpdate({
                backgroundImage: data.url
            });

            setSelectedBgImage(null);
            setBgImagePreview(null);
        } catch (error) {
            toast.error('Failed to upload background image');
        } finally {
            setUploadingBg(false);
        }
    };

    const handleRemoveBackgroundImage = () => {
        handleCustomStyleUpdate({
            backgroundImage: '',
            backgroundOverlay: '' // Also clear the overlay when removing background
        });
    };

    const assetCardColorSection = (
        <SettingRow label="Card Colors">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">Background Color</label>
                    <input
                        type="color"
                        value={currentStyle.assetCardBackground}
                        onChange={(e) => handleCustomStyleUpdate({ assetCardBackground: e.target.value })}
                        className="w-full h-8 bg-black bg-opacity-5"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">Text Color</label>
                    <input
                        type="color"
                        value={currentStyle.assetCardTextColor}
                        onChange={(e) => handleCustomStyleUpdate({ assetCardTextColor: e.target.value })}
                        className="w-full h-8 bg-black bg-opacity-5"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">Description Color</label>
                    <input
                        type="color"
                        value={currentStyle.assetCardDescriptionColor}
                        onChange={(e) => handleCustomStyleUpdate({ assetCardDescriptionColor: e.target.value })}
                        className="w-full h-8 bg-black bg-opacity-5"
                    />
                </div>
            </div>
        </SettingRow>
    );

    const sections = {
        'Background': (
            <div className="space-y-4">
                <SettingRow label="Background Image">
                    <div className="relative group">
                        <label
                            className="h-32 w-full rounded-lg border-2 border-dashed border-gray-300 overflow-hidden block cursor-pointer"
                            htmlFor="bg-image-input"
                        >
                            {(bgImagePreview || currentStyle.backgroundImage) ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={bgImagePreview || currentStyle.backgroundImage}
                                        alt="Background preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (selectedBgImage) {
                                                // If there's a selected image that hasn't been uploaded yet
                                                setSelectedBgImage(null);
                                                setBgImagePreview(null);
                                            } else {
                                                // If we're removing an existing background from the db
                                                handleRemoveBackgroundImage();
                                            }
                                        }}
                                        className="absolute top-2 right-2 bg-red-100 text-red-500 rounded-full p-1.5 hover:bg-red-200"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                    <span className="mt-2 text-sm text-gray-500">Click to upload background</span>
                                </div>
                            )}
                        </label>
                        <input
                            id="bg-image-input"
                            type="file"
                            className="hidden"
                            onChange={handleBgImageSelect}
                            accept="image/*"
                        />
                        {selectedBgImage && (
                            <button
                                onClick={handleBgImageUpload}
                                disabled={uploadingBg}
                                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                {uploadingBg ? (
                                    <>
                                        <Loader className="animate-spin" size={16} />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <UploadIcon size={16} />
                                        Upload Background
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </SettingRow>
                <SettingRow label="Background Overlay">
                    <select
                        value={currentStyle.backgroundOverlay || ''}
                        onChange={(e) => handleCustomStyleUpdate({ backgroundOverlay: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded-md text-sm bg-black bg-opacity-5"
                    >
                        <option value="">None</option>
                        <option value="bg-black/10">Light</option>
                        <option value="bg-black/30">Medium</option>
                        <option value="bg-black/50">Dark</option>
                        <option value="bg-black/70">Very Dark</option>
                    </select>
                </SettingRow>
                <SettingRow label="Background Color">
                    <div className="flex gap-3 flex-wrap">
                        {backgroundColors.map(color => (
                            <ColorOption
                                key={color.value}
                                color={color.value}
                                currentColor={currentStyle.background}
                                isSelected={currentStyle.background === color.value}
                                onClick={(selectedColor) => handleColorChange('background', selectedColor)}
                                label={color.label}
                                presetColors={backgroundColors}
                            />
                        ))}
                    </div>
                </SettingRow>
            </div>
        ),
        'Visibility': (
            <div className="space-y-4">
                <SettingRow label="Show Elements">
                    <div className="flex gap-2">
                        <ToggleOption
                            checked={currentStyle.showAssets}
                            onChange={(checked) => handleCustomStyleUpdate({ showAssets: checked })}
                            label="Assets"
                        />
                        <ToggleOption
                            checked={currentStyle.showFooter}
                            onChange={(checked) => handleCustomStyleUpdate({ showFooter: checked })}
                            label="Footer"
                        />
                    </div>
                </SettingRow>
            </div>
        ),
        'Layout': (
            <div className="space-y-4">
                <SettingRow label="Size">
                    <div className="flex gap-3">
                        {Object.entries(sizeMappings).map(([size, icon]) => (
                            <IconOption
                                key={size}
                                icon={icon}
                                isSelected={currentStyle.layoutSize === (size as Size)}
                                onClick={() => handleCustomStyleUpdate({ layoutSize: size as Size })}
                                label={size} />
                        ))}
                    </div>
                </SettingRow>
                <SettingRow label="Spacing">
                    <div className="flex gap-3">
                        {Object.entries(spacingMappings).map(([spacing, { icon, label }]) => (
                            <IconOption
                                key={spacing}
                                icon={icon}
                                isSelected={currentStyle.elementSpacing === (spacing as Spacing)}
                                onClick={() => handleCustomStyleUpdate({ elementSpacing: spacing as Spacing })}
                                label={label} />
                        ))}
                    </div>
                </SettingRow>
            </div>
        ),
        'Header': (
            <div className="space-y-4">
                {/* Visibility Options */}
                <SettingRow label="Show Elements">
                    <div className="flex gap-2">
                        <ToggleOption
                            checked={currentStyle.showDescription}
                            onChange={(checked) => handleCustomStyleUpdate({ showDescription: checked })}
                            label="Bio"
                        />
                        <ToggleOption
                            checked={currentStyle.showLocation}
                            onChange={(checked) => handleCustomStyleUpdate({ showLocation: checked })}
                            label="Location"
                        />
                        <ToggleOption
                            checked={currentStyle.showLinks}
                            onChange={(checked) => handleCustomStyleUpdate({ showLinks: checked })}
                            label="Links"
                        />
                        <ToggleOption
                            checked={currentStyle.showEmail}
                            onChange={(checked) => handleCustomStyleUpdate({ showEmail: checked })}
                            label="Email"
                        />
                    </div>
                </SettingRow>

                {/* Layout Style */}
                <SettingRow label="Layout Style">
                    <div className="grid grid-cols-3 gap-3">
                        {headerOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => handleCustomStyleUpdate({ headerStyle: option.id })}
                                className={`p-3 border rounded-lg text-left transition-all ${currentStyle.headerStyle === option.id
                                    ? 'border-blue-500 bg-blue-100 hover:bg-blue-200/80'
                                    : 'hover:border-gray-400 bg-black bg-opacity-5 hover:bg-opacity-10 '
                                    }`}
                            >
                                <div className="font-medium">{option.label}</div>
                            </button>
                        ))}
                    </div>
                </SettingRow>

                {/* Header Alignment */}
                <SettingRow label="Header Alignment">
                    <div className="flex gap-3">
                        {Object.entries(alignmentMappings).map(([align, icon]) => (
                            <IconOption
                                key={align}
                                icon={icon}
                                isSelected={currentStyle.headerAlignment === align}
                                onClick={() => handleCustomStyleUpdate({ headerAlignment: align as Alignment })}
                                label={`Align ${align}`} />
                        ))}
                    </div>
                </SettingRow>

                {/* Text Colors */}
                <SettingRow label="Text Colors">
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Name</label>
                            <div className="flex gap-3">
                                {nameColors.map(color => (
                                    <ColorOption
                                        key={color.value}
                                        color={color.value}
                                        currentColor={currentStyle.nameColor}
                                        isSelected={currentStyle.nameColor === color.value}
                                        onClick={(selectedColor) => selectedColor && handleColorChange('name', selectedColor)}
                                        label={color.label}
                                        presetColors={nameColors}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Bio</label>
                            <div className="flex gap-3">
                                {descriptionColors.map(color => (
                                    <ColorOption
                                        key={color.value}
                                        color={color.value}
                                        currentColor={currentStyle.descriptionColor}
                                        isSelected={currentStyle.descriptionColor === color.value}
                                        onClick={(selectedColor) => selectedColor && handleColorChange('description', selectedColor)}
                                        label={color.label}
                                        presetColors={descriptionColors}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Location</label>
                            <div className="flex gap-3">
                                {locationColors.map(color => (
                                    <ColorOption
                                        key={color.value}
                                        color={color.value}
                                        currentColor={currentStyle.locationColor}
                                        isSelected={currentStyle.locationColor === color.value}
                                        onClick={(selectedColor) => selectedColor && handleColorChange('location', selectedColor)}
                                        label={color.label}
                                        presetColors={locationColors}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Links</label>
                            <div className="flex gap-3">
                                {linkColors.map(color => (
                                    <ColorOption
                                        key={color.value}
                                        color={color.value}
                                        currentColor={currentStyle.linkColor}
                                        isSelected={currentStyle.linkColor === color.value}
                                        onClick={(selectedColor) => selectedColor && handleColorChange('link', selectedColor)}
                                        label={color.label}
                                        presetColors={linkColors}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </SettingRow>
            </div>
        ),
        'Asset Cards': (
            <div className="space-y-6">
                {/* Card Colors */}
                {assetCardColorSection}

                {/* Card Elements */}
                <SettingRow label="Card Elements">
                    <div className="space-x-3">
                        <ToggleOption
                            checked={currentStyle.showAssetIcon}
                            onChange={(checked) => handleCustomStyleUpdate({ showAssetIcon: checked })}
                            label="Show Icon"
                        />
                        <ToggleOption
                            checked={currentStyle.showAssetDescription}
                            onChange={(checked) => handleCustomStyleUpdate({ showAssetDescription: checked })}
                            label="Show Description"
                        />
                        <ToggleOption
                            checked={currentStyle.showAssetType}
                            onChange={(checked) => handleCustomStyleUpdate({ showAssetType: checked })}
                            label="Show Type Badge"
                        />
                    </div>
                </SettingRow>

                {/* Card Border */}
                <SettingRow label="Card Border">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <ToggleOption
                                checked={currentStyle.assetCardBorder}
                                onChange={(checked) => handleCustomStyleUpdate({ assetCardBorder: checked })}
                                label="Show Border"
                            />
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Border Radius</label>
                                <select
                                    value={currentStyle.assetCardBorderRadius}
                                    onChange={(e) => handleCustomStyleUpdate({ assetCardBorderRadius: e.target.value })}
                                    className="w-full p-2 border rounded-md bg-black bg-opacity-5"
                                >
                                    <option value="rounded-none">Square</option>
                                    <option value="rounded-sm">Small</option>
                                    <option value="rounded">Medium</option>
                                    <option value="rounded-lg">Large</option>
                                    <option value="rounded-full">Pill</option>
                                </select>
                            </div>
                            {currentStyle.assetCardBorder && (
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Border Color</label>
                                    <input
                                        type="color"
                                        value={currentStyle.assetCardBorderColor}
                                        onChange={(e) => handleCustomStyleUpdate({ assetCardBorderColor: e.target.value })}
                                        className="w-full h-8 bg-black bg-opacity-5"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </SettingRow>

                {/* Card Effects */}
                <SettingRow label="Card Effects">
                    <div className="space-x-2">
                        <ToggleOption
                            checked={currentStyle.assetCardShadow}
                            onChange={(checked) => handleCustomStyleUpdate({ assetCardShadow: checked })}
                            label="Shadow"
                        />
                        <ToggleOption
                            checked={currentStyle.assetCardHoverShadow}
                            onChange={(checked) => handleCustomStyleUpdate({ assetCardHoverShadow: checked })}
                            label="Hover Shadow"
                        />
                        <ToggleOption
                            checked={currentStyle.assetCardHoverScale}
                            onChange={(checked) => handleCustomStyleUpdate({ assetCardHoverScale: checked })}
                            label="Hover Scale"
                        />
                    </div>
                </SettingRow>

                {/* Asset Categorization */}
                <SettingRow label="Asset Categorization">
                    <div className="space-y-4">
                        <ToggleOption
                            checked={currentStyle.categorizeAssets}
                            onChange={(checked) => handleCustomStyleUpdate({ categorizeAssets: checked })}
                            label="Group by Type"
                        />

                        {currentStyle.categorizeAssets && (
                            <div className="space-y-4">
                                {/* Tab Colors */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Colors</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500">Background</label>
                                            <input
                                                type="color"
                                                value={currentStyle.assetTabBackground}
                                                onChange={(e) => handleCustomStyleUpdate({ assetTabBackground: e.target.value })}
                                                className="w-full h-8 bg-black bg-opacity-5"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Selected Background</label>
                                            <input
                                                type="color"
                                                value={currentStyle.assetTabSelectedBg}
                                                onChange={(e) => handleCustomStyleUpdate({ assetTabSelectedBg: e.target.value })}
                                                className="w-full h-8 bg-black bg-opacity-5"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Text Color</label>
                                            <input
                                                type="color"
                                                value={currentStyle.assetTabTextColor}
                                                onChange={(e) => handleCustomStyleUpdate({ assetTabTextColor: e.target.value })}
                                                className="w-full h-8 bg-black bg-opacity-5"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Selected Text</label>
                                            <input
                                                type="color"
                                                value={currentStyle.assetTabSelectedTextColor}
                                                onChange={(e) => handleCustomStyleUpdate({ assetTabSelectedTextColor: e.target.value })}
                                                className="w-full h-8 bg-black bg-opacity-5"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Hover Background</label>
                                            <input
                                                type="color"
                                                value={currentStyle.assetTabHoverBg}
                                                onChange={(e) => handleCustomStyleUpdate({ assetTabHoverBg: e.target.value })}
                                                className="w-full h-8 bg-black bg-opacity-5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tab Layout */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Border & Shadow</label>
                                        <div className="space-x-2 mt-2">
                                            <ToggleOption
                                                checked={currentStyle.assetTabBorder}
                                                onChange={(checked) => handleCustomStyleUpdate({ assetTabBorder: checked })}
                                                label="Show Border"
                                            />
                                            <ToggleOption
                                                checked={currentStyle.assetTabShadow}
                                                onChange={(checked) => handleCustomStyleUpdate({ assetTabShadow: checked })}
                                                label="Show Shadow"
                                            />
                                        </div>
                                        {currentStyle.assetTabBorder && (
                                            <input
                                                type="color"
                                                value={currentStyle.assetTabBorderColor}
                                                onChange={(e) => handleCustomStyleUpdate({ assetTabBorderColor: e.target.value })}
                                                className="w-full h-8 bg-black bg-opacity-5 mt-2"
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Layout</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <select
                                                value={currentStyle.assetTabBorderRadius}
                                                onChange={(e) => handleCustomStyleUpdate({ assetTabBorderRadius: e.target.value })}
                                                className="w-full p-2 border rounded-md bg-black bg-opacity-5"
                                            >
                                                <option value="rounded-none">Square</option>
                                                <option value="rounded-sm">Small</option>
                                                <option value="rounded">Medium</option>
                                                <option value="rounded-lg">Large</option>
                                                <option value="rounded-full">Pill</option>
                                            </select>
                                            <select
                                                value={currentStyle.assetTabPadding}
                                                onChange={(e) => handleCustomStyleUpdate({ assetTabPadding: e.target.value })}
                                                className="w-full p-2 border rounded-md bg-black bg-opacity-5"
                                            >
                                                <option value="px-2 py-1">Compact</option>
                                                <option value="px-3 py-1.5">Normal</option>
                                                <option value="px-4 py-2">Relaxed</option>
                                                <option value="px-6 py-3">Large</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </SettingRow>
            </div>
        ),
        'Footer': (
            <div className="space-y-6">
                <SettingRow label="Footer Style">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Fixed Position</span>
                            <Toggle
                                initialValue={currentStyle.footerFixed}
                                onToggle={(checked: boolean) => {
                                    handleCustomStyleUpdate({ footerFixed: checked });
                                }}
                            />
                        </div>
                    </div>
                </SettingRow>

                <SettingRow label="Button">
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={currentStyle.footerButtonText}
                            onChange={(e) => handleCustomStyleUpdate({ footerButtonText: e.target.value })}
                            placeholder="Button Text"
                            className="w-full p-2 border rounded-md bg-black bg-opacity-5"
                        />

                        <div className="space-y-2"></div>
                        <label className="text-sm text-gray-600">Button Type</label>
                        <select
                            value={currentStyle.footerButtonType}
                            onChange={(e) => handleCustomStyleUpdate({ footerButtonType: e.target.value as 'link' | 'email' | 'phone' })}
                            className="w-full p-2 border rounded-md bg-black bg-opacity-5"
                        >
                            <option value="link">External Link</option>
                            <option value="email">Email Address</option>
                            <option value="phone">Phone Number</option>
                        </select>
                    </div>

                    {currentStyle.footerButtonType === 'link' && (
                        <input
                            type="url"
                            value={currentStyle.footerButtonUrl}
                            onChange={(e) => handleCustomStyleUpdate({ footerButtonUrl: e.target.value })}
                            placeholder="External URL"
                            className="w-full p-2 border rounded-md mt-2 bg-black bg-opacity-5"
                        />
                    )}

                    {currentStyle.footerButtonType === 'email' && (
                        <input
                            type="email"
                            value={currentStyle.footerButtonEmail}
                            onChange={(e) => handleCustomStyleUpdate({ footerButtonEmail: e.target.value })}
                            placeholder="Email Address"
                            className="w-full p-2 border rounded-md mt-2 bg-black bg-opacity-5"
                        />
                    )}

                    {currentStyle.footerButtonType === 'phone' && (
                        <input
                            type="tel"
                            value={currentStyle.footerButtonPhone}
                            onChange={(e) => handleCustomStyleUpdate({ footerButtonPhone: e.target.value })}
                            placeholder="Phone Number"
                            className="w-full p-2 border rounded-md mt-2 bg-black bg-opacity-5"
                        />
                    )}

                    <div className="space-y-2 mt-4">
                        <label className="text-sm text-gray-600">Text Color</label>
                        <input
                            type="color"
                            value={currentStyle.footerButtonColor}
                            onChange={(e) => handleCustomStyleUpdate({ footerButtonColor: e.target.value })}
                            className="w-full h-8 bg-black bg-opacity-5"
                        />
                    </div>
                    <div className="space-y-2 mt-4">
                        <label className="text-sm text-gray-600">Background Color</label>
                        <input
                            type="color"
                            value={currentStyle.footerButtonBg}
                            onChange={(e) => handleCustomStyleUpdate({ footerButtonBg: e.target.value })}
                            className="w-full h-8 bg-black bg-opacity-5"
                        />
                    </div>
                    <div className="space-y-3 mt-2">
                        <select
                            value={currentStyle.footerButtonRadius}
                            onChange={(e) => handleCustomStyleUpdate({ footerButtonRadius: e.target.value })}
                            className="w-full p-2 border rounded-md bg-black bg-opacity-5"
                        >
                            <option value="rounded-none">Square</option>
                            <option value="rounded-sm">Small</option>
                            <option value="rounded">Medium</option>
                            <option value="rounded-lg">Large</option>
                            <option value="rounded-full">Pill</option>
                        </select>
                    </div>
                    <div className="space-x-2 mt-4">
                        <ToggleOption
                            checked={currentStyle.footerButtonShadow}
                            onChange={(checked) => handleCustomStyleUpdate({ footerButtonShadow: checked })}
                            label="Shadow"
                        />
                        <ToggleOption
                            checked={currentStyle.footerButtonHoverScale}
                            onChange={(checked) => handleCustomStyleUpdate({ footerButtonHoverScale: checked })}
                            label="Hover Scale"
                        />
                    </div>
                </SettingRow >
            </div >
        ),

    };

    const handleSectionClick = (sectionName: string) => {
        setOpenSection(openSection === sectionName ? '' : sectionName);
    };

    if (isLoading || !session.data?.user) {
        return <div className="flex justify-center items-center h-full">Loading settings...</div>;
    }
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between gap-x-4 py-2">
                <div className="flex gap-x-4 px-2">
                    <button
                        className={`px-1 py-2 ${activeTab === 'presets' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('presets')}
                    >
                        Presets
                    </button>
                    <button
                        className={`py-2 px-1 ${activeTab === 'custom' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('custom')}
                    >
                        Custom
                    </button>
                </div>
                {/* Only show Save as Preset button when in custom tab */}
                {activeTab === 'custom' && (
                    <button
                        onClick={() => setShowSavePresetModal(true)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Save as Preset
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-auto mt-4 pb-10">
                {activeTab === 'presets' ? (
                    <ThemePresets
                        onSelect={handlePresetSelect}
                        currentThemeId={savedStyle?.themeId}
                    />
                ) : (
                    <div className="space-y-6">
                        {Object.entries(sections).map(([name, content]) => (
                            <div key={name} className={`border rounded-lg py-4 px-4 bg-black bg-opacity-5 ${openSection === name ? 'border-blue-500' : 'border-transparent'}`}>
                                <SectionTitle
                                    title={name}
                                    isOpen={openSection === name}
                                    onClick={() => handleSectionClick(name)}
                                />
                                {openSection === name && (
                                    <div className="mt-4">
                                        {content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add SavePresetModal component */}
            <SavePresetModal
                isOpen={showSavePresetModal}
                onClose={() => setShowSavePresetModal(false)}
                onSave={handleSavePreset}
                currentStyle={currentStyle}
            />
        </div>
    );
}
