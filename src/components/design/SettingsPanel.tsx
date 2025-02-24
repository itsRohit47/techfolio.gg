import { Alignment, Size, Spacing, StyleObject } from "@/types/common";
import { SettingRow, ColorOption, IconOption, ToggleOption } from "./SettingOptions";
import { BsLayoutSidebarReverse, BsLayoutTextWindowReverse, BsLayoutTextWindow } from "react-icons/bs";
import { LuAlignLeft, LuAlignCenter, LuAlignRight } from "react-icons/lu";
import { TbSpacingVertical } from "react-icons/tb";

interface SettingsPanelProps {
    style: StyleObject;
    onStyleChange: (newStyle: StyleObject) => void;
}

export default function SettingsPanel({ style, onStyleChange }: SettingsPanelProps) {
    const updateStyle = (updates: Partial<StyleObject>) => {
        onStyleChange({ ...style, ...updates });
    };

    const backgroundColors = [
        { value: 'bg-white', label: 'White' },
        { value: 'bg-gray-50', label: 'Light Gray' },
        { value: 'bg-gray-900', label: 'Dark' }
    ];

    const nameColors = [
        { value: 'text-black', label: 'Black' },
        { value: 'text-gray-900', label: 'Dark' },
        { value: 'text-gray-600', label: 'Gray' },
        { value: 'text-gray-500', label: 'Light' },
        { value: 'text-blue-500', label: 'Blue' },
        { value: 'text-green-600', label: 'Green' },
        { value: 'text-violet-500', label: 'Purple' },
        { value: 'text-white', label: 'White' }
    ];

    const descriptionColors = [
        { value: 'text-black', label: 'Black' },
        { value: 'text-gray-900', label: 'Dark' },
        { value: 'text-gray-600', label: 'Gray' },
        { value: 'text-gray-500', label: 'Light' },
        { value: 'text-blue-500', label: 'Blue' },
        { value: 'text-green-600', label: 'Green' },
        { value: 'text-violet-500', label: 'Purple' },
        { value: 'text-white', label: 'White' }
    ];

    const linkColors = [
        { value: 'text-black', label: 'Black' },
        { value: 'text-gray-900', label: 'Dark' },
        { value: 'text-gray-600', label: 'Gray' },
        { value: 'text-gray-500', label: 'Light' },
        { value: 'text-blue-500', label: 'Blue' },
        { value: 'text-green-600', label: 'Green' },
        { value: 'text-violet-500', label: 'Purple' },
        { value: 'text-white', label: 'White' }
    ];

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

    return (
        <div className="space-y-4 p-4 h-full overflow-y-auto">
            <SettingRow label="Background Color">
                <div className="flex gap-3">
                    {backgroundColors.map(color => (
                        <ColorOption
                            key={color.value}
                            color={color.value}
                            isSelected={style.background === color.value}
                            onClick={() => updateStyle({ background: color.value })}
                            label={color.label}
                        />
                    ))}
                </div>
            </SettingRow>
            <SettingRow label="Name Color">
                <div className="flex gap-3">
                    {nameColors.map(color => (
                        <ColorOption
                            key={color.value}
                            color={color.value.replace('text-', 'bg-')}
                            isSelected={style.nameColor === color.value}
                            onClick={() => updateStyle({ nameColor: color.value })}
                            label={color.label}
                        />
                    ))}
                </div>
            </SettingRow>

            <SettingRow label="Bio Color">
                <div className="flex gap-3">
                    {descriptionColors.map(color => (
                        <ColorOption
                            key={color.value}
                            color={color.value.replace('text-', 'bg-')}
                            isSelected={style.descriptionColor === color.value}
                            onClick={() => updateStyle({ descriptionColor: color.value })}
                            label={color.label}
                        />
                    ))}
                </div>
            </SettingRow>


            <SettingRow label="Link Color">
                <div className="flex gap-3">
                    {linkColors.map(color => (
                        <ColorOption
                            key={color.value}
                            color={color.value.replace('text-', 'bg-')}
                            isSelected={style.linkColor === color.value}
                            onClick={() => updateStyle({ linkColor: color.value })}
                            label={color.label}
                        />
                    ))}
                </div>
            </SettingRow>

            <SettingRow label="Size">
                <div className="flex gap-3">
                    {Object.entries(sizeMappings).map(([size, icon]) => (
                        <IconOption
                            key={size}
                            icon={icon}
                            isSelected={style.layoutSize === (size as Size)}
                            onClick={() => updateStyle({ layoutSize: size as Size })}
                            label={size}
                        />
                    ))}
                </div>
            </SettingRow>

            <SettingRow label="Spacing">
                <div className="flex gap-3">
                    {Object.entries(spacingMappings).map(([spacing, { icon, label }]) => (
                        <IconOption
                            key={spacing}
                            icon={icon}
                            isSelected={style.elementSpacing === (spacing as Spacing)}
                            onClick={() => updateStyle({ elementSpacing: spacing as Spacing })}
                            label={label}
                        />
                    ))}
                </div>
            </SettingRow>

            <SettingRow label="Alignment">
                <div className="flex gap-3">
                    {Object.entries(alignmentMappings).map(([align, icon]) => (
                        <IconOption
                            key={align}
                            icon={icon}
                            isSelected={style.headerAlignment === align}
                            onClick={() => updateStyle({ headerAlignment: align as Alignment })}
                            label={`Align ${align}`}
                        />
                    ))}
                </div>
            </SettingRow>

            <SettingRow label="Elements">
                <div className="flex gap-2">
                    <ToggleOption
                        checked={style.showDescription}
                        onChange={(checked) => updateStyle({ showDescription: checked })}
                        label="Bio"
                    />
                    <ToggleOption
                        checked={style.showLinks}
                        onChange={(checked) => updateStyle({ showLinks: checked })}
                        label="Links"
                    />
                </div>
            </SettingRow>
        </div >
    );
}
