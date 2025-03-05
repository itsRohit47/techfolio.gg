'use client';
import { Size, Spacing, StyleObject } from "@/types/common";
import { sizeMap } from "@/types/common";
import { useRouter } from "next/navigation";

export interface AssetCardProps {
    asset: {
        id: string;
        title: string;
        description?: string;
        icon?: string;
        type: string;
    };
    style?: StyleObject;
    preview?: boolean;
}

export function AssetCard({ asset, style, preview }: AssetCardProps) {
    const size = style?.layoutSize ?? Size.MD;
    const router = useRouter();
    type AssetType = 'certificate' | 'project' | 'lab' | 'article' | 'assignment';
    const typeConfig: Record<AssetType, { emoji: string, color: string }> = {
        certificate: { emoji: '🏆', color: 'text-yellow-600' },
        project: { emoji: '🚀', color: 'text-blue-600' },
        lab: { emoji: '🧪', color: 'text-purple-600' },
        article: { emoji: '📝', color: 'text-green-600' },
        assignment: { emoji: '✍️', color: 'text-orange-600' }
    };

    const typeInfo = typeConfig[asset.type as AssetType] ?? { emoji: '📌', color: 'text-gray-600' };

    return (
        <div
            onClick={() => !preview ? router.push(`/asset/${asset.id}`) : null}
            className={`
                group transition-all duration-200 cursor-pointer ${style?.assetCardBorderRadius}
                ${style?.assetCardBorder ? 'border' : 'border-none'}
                ${style?.assetCardShadow ? 'shadow-sm' : ''}
                ${style?.assetCardShadow ? 'shadow-sm' : ''}
                ${style?.assetCardHoverShadow ? 'hover:shadow-md' : ''}
                ${style?.assetCardHoverScale ? 'hover:scale-[1.02]' : ''}
            `}
            style={{
                backgroundColor: style?.assetCardBackground,
                borderColor: style?.assetCardBorderColor,
                borderWidth: style?.assetCardBorderWidth,
            }}
        >
            <div className="p-4 flex items-center gap-4">
                {style?.showAssetIcon && asset.icon && (
                    <img src={asset.icon} alt={asset.title} 
                         className="w-12 h-12 object-cover rounded-full flex-shrink-0" />
                )}
                <div className="flex-grow min-w-0">
                    <h3 className={`${sizeMap.text[size]} font-medium truncate`}
                        style={{ color: style?.assetCardTextColor }}>
                        {asset.title}
                    </h3>
                    {style?.showAssetDescription && asset.description && (
                        <p className="text-sm line-clamp-2"
                           style={{ color: style?.assetCardDescriptionColor }}>
                            {asset.description}
                        </p>
                    )}
                </div>
                {style?.showAssetType && (
                    <div className={`px-2 py-1 rounded-full text-lg flex items-center gap-x-1 flex-shrink-0 ${typeInfo.color}`}>
                        {typeInfo.emoji}
                    </div>
                )}
            </div>
        </div>
    );
}

export const assetCardComponent = AssetCard;
