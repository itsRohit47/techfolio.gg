/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { Size, Spacing, StyleObject, defaultStyle, sizeMap } from "@/types/common";
import { spacing } from "tailwindcss/defaultTheme";
import Loader from "./loader";
import Link from "next/link";
import { BsExclamationCircle } from "react-icons/bs";
import { headerComponents, HeaderProps } from "./headers";
import { assetCardComponent as AssetCard } from "./assets";
import Footer from './footer';
import { useSession } from "next-auth/react";
import { useState } from 'react';
import Tooltip from './tooltip';

export default function Portfolio({ style: propStyle, user, preview }: { style?: StyleObject, user?: string, preview?: boolean }) {
    const session = useSession();

    const { data: portfolio, isLoading } = api.asset.getUserPortfolioWithStyle.useQuery(
        { username: preview ? session.data?.user?.username ?? '' : user ?? '' }, {
        enabled: !!session.data?.user?.username || !!user,
    },
    );

    const u_id = portfolio?.header.id;
    const style = portfolio?.style ?? defaultStyle;
    const spacing = (style?.elementSpacing ?? Spacing.NORMAL) as keyof typeof sizeMap.elementSpacing;

    const HeaderComponent = headerComponents[style?.headerStyle || 'default'] ?? Header;

    const [selectedType, setSelectedType] = useState<string>('all');

    // Group assets by type
    const assetsByType = portfolio?.body.reduce((acc, asset) => {
        const type = asset.type || 'other';
        acc[type] = [...(acc[type] || []), asset];
        return acc;
    }, {} as Record<string, typeof portfolio.body>) || {};

    const assetTypes = ['all', ...Object.keys(assetsByType)];

    const filteredAssets = selectedType === 'all'
        ? portfolio?.body
        : assetsByType[selectedType] || [];

    const assetTypeConfig: Record<string, { emoji: string; label: string }> = {
        all: { emoji: '🔍', label: 'All' },
        certificate: { emoji: '🏆', label: 'Certificates' },
        project: { emoji: '🚀', label: 'Projects' },
        lab: { emoji: '🧪', label: 'Labs' },
        article: { emoji: '📝', label: 'Articles' },
        assignment: { emoji: '✍️', label: 'Assignments' },
        other: { emoji: '📌', label: 'Other' },
    };

    if (isLoading || !portfolio) {
        return <div className="h-full flex items-center justify-center w-full gap-x-2">
            <Loader />
        </div>;
    }


    if (!portfolio) {
        return <div className="h-full flex items-center justify-center w-full gap-x-2">
            <span>User not found</span>
        </div>;
    }


    return (
        <div className="max-h-screen h-full mx-auto relative">

            {!preview && session.data?.user?.id === u_id && (
                <div className="flex fixed z-50 top-4 right-4 gap-2">
                    <Link href={`/dashboard`} passHref className="bg-white text-black px-2 py-1 rounded-md shadow-md hover:bg-gray-100 border border-gray-200">
                        Dashboard
                    </Link>
                    <Link href={`/dashboard/design`} passHref className="bg-white text-black px-2 py-1 rounded-md shadow-md hover:bg-gray-100 border border-gray-200">
                        Edit design
                    </Link>
                    <Link href={`/dashboard/build`} passHref className="bg-white text-black px-2 py-1 rounded-md shadow-md hover:bg-gray-100 border border-gray-200">
                        Edit content
                    </Link>
                </div>
            )}

            {preview || session.data?.user?.id === u_id && <div className="absolute bg-gray-800 text-white rounded-lg px-3 text-xs py-1.5 top-4 z-50 left-4 flex items-center gap-x-2"><div className="w-2 h-2 rounded-full bg-orange-500 border ring-orange-500 ring-1 ring-offset-2 border-yellow-500 animate-pulse"></div>Preview mode</div>}


            {/* Background Image - only show if backgroundImage exists */}
            {style?.backgroundImage && (
                <img
                    src={style.backgroundImage}
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            )}

            {/* Overlay - only show if both backgroundImage and backgroundOverlay exist */}
            {style?.backgroundImage && style?.backgroundOverlay && (
                <div className={`absolute inset-0 ${style.backgroundOverlay}`} />
            )}

            {/* Apply background color if no background image */}
            <div
                className="relative h-full overflow-scroll"
                style={{
                    backgroundColor: !style?.backgroundImage ? style?.background : undefined
                }}
            >
                <div className={`${sizeMap.elementSpacing[spacing]} flex flex-col h-full overflow-scroll`}>
                    <HeaderComponent
                        style={style as StyleObject}
                        name={portfolio?.header.name ?? undefined}
                        bio={portfolio?.header.bio ?? undefined}
                        linkedin={portfolio?.header.linkedin ?? undefined}
                        github={portfolio?.header.github ?? undefined}
                        image={portfolio?.header.image ?? undefined}
                        location={portfolio?.header.location ?? undefined}
                        links={portfolio?.links ?? []}
                        email={portfolio?.header.email ?? undefined}
                    />
                    {/* Add condition for showing assets */}
                    {style?.showAssets && (
                        <>
                            {portfolio?.body.length === 0 ? (
                                <div className="flex items-center bg-transparent flex-col justify-center gap-2 text-red-500 overflow-scroll h-full flex-grow">
                                    <BsExclamationCircle className="text-xl" />
                                    <span>No assets to display</span>
                                    <a href="/dashboard/build" className="text-blue-500 hover:underline">
                                        Add assets
                                    </a>
                                </div>
                            ) : (
                                <>
                                    {style.categorizeAssets && (
                                        <div
                                            className={`px-3 mx-auto w-max rounded-lg py-2 flex justify-center ${style.assetTabSpacing} mt-4 ${style.assetTabShadow ? 'shadow-md' : ''}`}
                                            style={{
                                                backgroundColor: style.assetTabBackground,
                                                borderWidth: style.assetTabBorder ? '1px' : '0',
                                                borderColor: style.assetTabBorderColor,
                                                borderStyle: 'solid',
                                                borderRadius: style.assetTabBorderRadius === 'rounded-none' ? '0' :
                                                    style.assetTabBorderRadius === 'rounded-sm' ? '0.125rem' :
                                                        style.assetTabBorderRadius === 'rounded' ? '0.25rem' :
                                                            style.assetTabBorderRadius === 'rounded-lg' ? '0.5rem' :
                                                                style.assetTabBorderRadius === 'rounded-full' ? '9999px' : '0.5rem'
                                            }}
                                        >
                                            {assetTypes.map((type) => {
                                                const config = assetTypeConfig[type] || { emoji: '📌', label: type };
                                                const isSelected = selectedType === type;

                                                return (
                                                    <Tooltip key={type} content={isSelected ? '' : config.label}>
                                                        <button
                                                            onClick={() => setSelectedType(type)}
                                                            className={`transition-all text-xs ${style.assetTabPadding} hover:bg-opacity-100`}
                                                            style={{
                                                                backgroundColor: isSelected ? style.assetTabSelectedBg : 'transparent',
                                                                color: isSelected ? style.assetTabSelectedTextColor : style.assetTabTextColor,
                                                                borderRadius: style.assetTabBorderRadius === 'rounded-none' ? '0' :
                                                                    style.assetTabBorderRadius === 'rounded-sm' ? '0.125rem' :
                                                                        style.assetTabBorderRadius === 'rounded' ? '0.25rem' :
                                                                            style.assetTabBorderRadius === 'rounded-lg' ? '0.5rem' :
                                                                                style.assetTabBorderRadius === 'rounded-full' ? '9999px' : '0.5rem',
                                                            }}
                                                            onMouseOver={(e) => {
                                                                if (!isSelected) {
                                                                    e.currentTarget.style.backgroundColor = style.assetTabHoverBg;
                                                                }
                                                            }}
                                                            onMouseOut={(e) => {
                                                                if (!isSelected) {
                                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                                }
                                                            }}
                                                        >
                                                            {isSelected ? (
                                                                <span>{config.label} ({assetsByType[type]?.length || 0})</span>
                                                            ) : (
                                                                <span>{config.emoji}</span>
                                                            )}
                                                        </button>
                                                    </Tooltip>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <div className={`flex flex-grow px-4 py-4 pb-32 max-w-xl mx-auto w-full flex-col  ${sizeMap.elementSpacing[spacing]} ${sizeMap.sectionSpacing[spacing]}`}>
                                        {filteredAssets?.map((asset, index) => (
                                            <AssetCard
                                                preview={preview}
                                                key={index}
                                                asset={asset as any}
                                                style={style as StyleObject}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {!preview && <div className="h-52 mb-32"></div>}
                    <Footer style={style as StyleObject} preview={preview} />
                </div>
            </div>
        </div >
    );
}

function Header({ name, bio, location, links, style, image, linkedin, github }: HeaderProps) {
    const size = style?.layoutSize ?? Size.MD;
    const spacing = style?.elementSpacing ?? Spacing.NORMAL;

    // Map alignment to Tailwind classes
    const alignmentClass = {
        'left': 'items-start text-left',
        'center': 'items-center text-center',
        'right': 'items-end text-right'
    }[style?.headerAlignment ?? 'left'];

    // Apply element spacing directly to flex-col div
    return (
        <div className={`flex flex-col h-max ${alignmentClass} ${sizeMap.elementSpacing[spacing]}`}>
            {/* Update text colors to be more visible on background */}
            <img
                src={image}
                alt="avatar"
                className={`${sizeMap.image[size]} rounded-full border-2 border-white/20 object-cover shadow-lg`}
            />
            <span
                className={`${sizeMap.heading[size]} font-bold text-white`}
                style={{ color: style?.nameColor }}
            >
                {name}
            </span>
            {style?.showDescription && bio && (
                <span className={`${sizeMap.text[size]}`} style={{ color: style?.descriptionColor }}>
                    {bio}
                </span>
            )}
            {style?.showLocation && location && (
                <span
                    className={`${sizeMap.text[size]} flex items-center gap-1`}
                    style={{ color: style?.locationColor }}
                >
                    <span>📍</span> {location}
                </span>
            )}
            {style?.showLinks && (
                <div className={`flex gap-x-4 flex-wrap ${style?.headerAlignment === 'right' ? 'justify-end' : style?.headerAlignment === 'center' ? 'justify-center' : 'justify-start'} ${sizeMap.text[size]}`}>
                    {linkedin && (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer"
                            style={{ color: style?.linkColor }}>LinkedIn</a>
                    )}
                    {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer"
                            style={{ color: style?.linkColor }}>GitHub</a>
                    )}
                    {links?.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            className="hover:underline"
                            style={{ color: style?.linkColor }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}