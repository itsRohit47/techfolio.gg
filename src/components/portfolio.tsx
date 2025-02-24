/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { Size, Spacing, StyleObject, sizeMap } from "@/types/common";
import { spacing } from "tailwindcss/defaultTheme";

export default function Portfolio({ style }: { style: StyleObject }) {
    const { data: portfolio } = api.asset.getUserPortfolio.useQuery({
        username: 'rohit',
    });
    const size = style.layoutSize ?? Size.MD;
    const spacing = style.elementSpacing ?? Spacing.NORMAL;

    return (
        <div className={`max-w-xl mx-auto overflow-auto flex flex-col relative h-full py-6 ${style.background} ${sizeMap.elementSpacing[spacing]} ${sizeMap.text[size]}`}>
            <Header style={style} name={portfolio?.header.name ?? undefined} bio={portfolio?.header.bio ?? undefined} linkedin={portfolio?.header.linkedin ?? undefined} github={portfolio?.header.github ?? undefined} image={
                portfolio?.header.image ?? undefined
            } />
            <Assets assets={portfolio?.body ?? []} style={style} />
        </div>
    );
}

function Header({ name, bio, linkedin, github, style, image }: { name?: string, bio?: string, linkedin?: string, github?: string, style: StyleObject, image?: string }) {
    const size = style.layoutSize ?? Size.MD;
    const spacing = style.elementSpacing ?? Spacing.NORMAL;

    // Map alignment to Tailwind classes
    const alignmentClass = {
        'left': 'items-start text-left',
        'center': 'items-center text-center',
        'right': 'items-end text-right'
    }[style.headerAlignment ?? 'left'];

    // Apply element spacing directly to flex-col div
    return (
        <div className={`flex flex-col h-max ${alignmentClass} ${sizeMap.elementSpacing[spacing]}`}>
            <img
                src={image ? image : '/logo2.png'}
                alt="avatar"
                className={`${sizeMap.image[size]} rounded-full border border-gray-200`}
            />
            <span className={`${sizeMap.heading[size]} font-bold ${style.nameColor}`}>
                {name}
            </span>
            {style.showDescription && (
                <span className={`${sizeMap.text[size]} ${style.descriptionColor ?? style.textColor}`}>
                    {bio}
                </span>
            )}
            {style.showLinks && (
                <div className={`flex gap-x-4 ${style.headerAlignment === 'right' ? 'justify-end' : style.headerAlignment === 'center' ? 'justify-center' : 'justify-start'} ${sizeMap.text[size]}`}>
                    {linkedin && <a href={linkedin} className={`hover:underline ${style.linkColor ?? style.textColor}`}>LinkedIn</a>}
                    {github && <a href={github} className={`hover:underline ${style.linkColor ?? style.textColor}`}>GitHub</a>}
                </div>
            )}
        </div>
    );
}

function AssetCard({ asset, style }: { asset: any, style: StyleObject }) {
    const size = style.layoutSize ?? Size.MD;
    const spacing = style.elementSpacing ?? Spacing.NORMAL;
    return (
        <div className={`bg-white rounded-lg shadow border p-4 w-full ${sizeMap.elementSpacing[spacing]} ${sizeMap.text[size]} `}>
            <div className="flex items-center gap-4">
                {asset.icon ? (
                    <img src={asset.icon
                    } alt={asset.title} className="w-12 h-12 object-cover rounded-full" />
                ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                )}
                <div>
                    <h3 className={`font-bold ${style.textColor}`}>{asset.title}</h3>
                    <p className={style.textColor}>{asset.description}</p>
                </div>
            </div>
        </div>
    );
}

function Assets({ assets, style }: { assets: any[], style: StyleObject }) {
    const size = style.layoutSize ?? Size.MD;
    const spacing = style.elementSpacing ?? Spacing.NORMAL;

    return (
        <div className={`flex flex-wrap ${sizeMap.elementSpacing[spacing]} ${sizeMap.sectionSpacing[spacing]}`}>
            {assets.map((asset, index) => (
                <AssetCard key={index} asset={asset} style={style} />
            ))}
        </div>
    );
}