/* eslint-disable @next/next/no-img-element */
import { Size, Spacing, StyleObject } from "@/types/common";
import { sizeMap } from "@/types/common";

export interface HeaderProps {
    name?: string;
    bio?: string;
    location?: string;
    links?: Array<{ id: string; label: string; url: string; }>;
    style?: StyleObject;
    image?: string;
    linkedin?: string;
    github?: string;
    email?: string;
}

// Shared function to render links and location
const SocialLinks = ({ style, linkedin, github, links, location, email }: HeaderProps) => {
    const size = style?.layoutSize ?? Size.MD;
    const alignClass = {
        'left': 'text-left items-start',
        'center': 'text-center items-center',
        'right': 'text-right items-end'
    }[style?.headerAlignment ?? 'left'];

    return (
        <div className={`space-y-2 flex flex-col ${alignClass}`}>
            {style?.showLinks && (
                <div
                    className={`flex gap-x-4 flex-wrap ${style?.headerAlignment === 'right' ? 'justify-end' :
                        style?.headerAlignment === 'center' ? 'justify-center' :
                            'justify-start'
                        }`}
                    style={{ color: style?.linkColor }}
                >
                    {style?.showEmail && (
                        <a href={`mailto:${email}`}
                            className="hover:underline"
                            style={{ color: style?.linkColor }}>
                            Email
                        </a>
                    )}
                    {linkedin && (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer"
                            className="hover:underline">LinkedIn</a>
                    )}
                    {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer"
                            className="hover:underline">GitHub</a>
                    )}
                    {links?.map((link) => (
                        <a key={link.id} href={link.url} className="hover:underline"
                            target="_blank" rel="noopener noreferrer">{link.label}</a>
                    ))}
                </div>
            )}
            {style?.showLocation && location && (
                <div
                    className={`${sizeMap.text[size]} flex items-center gap-1 ${style?.headerAlignment === 'right' ? 'justify-end' :
                        style?.headerAlignment === 'center' ? 'justify-center' :
                            'justify-start'
                        }`}
                    style={{ color: style?.locationColor || style?.descriptionColor }}
                >
                    <span>📍</span> {location}
                </div>
            )}
        </div>
    );
};

// Centered vertical layout (default)
export function DefaultHeader(props: HeaderProps) {
    const { style, name, bio, image } = props;
    const size = style?.layoutSize ?? Size.SM;
    const spacing = style?.elementSpacing ?? Spacing.NORMAL;
    const alignClass = {
        'left': 'items-start text-left',
        'center': 'items-center text-center',
        'right': 'items-end text-right'
    }[style?.headerAlignment ?? 'center'];

    return (
        <div className={`flex flex-col max-w-xl mx-auto px-4 pt-10 ${alignClass} ${sizeMap.elementSpacing[spacing]} items-center justify-center`}>
            <img
                src={image}
                alt="avatar"
                className={`${sizeMap.image[size]} max-w-28 max-h-28 rounded-full border-2 border-white/20 object-cover shadow-lg`}
            />
            <div className="space-y-2">
                <span className={`${sizeMap.heading[size]} font-bold block`}
                    style={{ color: style?.nameColor }}>{name}</span>
                {style?.showDescription && bio && (
                    <p className={sizeMap.text[size]} style={{ color: style?.descriptionColor }}>
                        {bio}
                    </p>
                )}
            </div>
            <SocialLinks {...props} />
        </div>
    );
}

// Horizontal layout with image on left
export function SideHeader(props: HeaderProps) {
    const { style, name, bio, image } = props;
    const size = style?.layoutSize ?? Size.MD;
    const spacing = style?.elementSpacing ?? Spacing.NORMAL;
    const alignClass = {
        'left': 'justify-start text-left',
        'center': 'justify-center text-center',
        'right': 'justify-end text-right'
    }[style?.headerAlignment ?? 'left'];

    return (
        <div className={`flex w-full max-w-xl mx-auto  px-4 pt-20 ${alignClass} ${sizeMap.elementSpacing[spacing]}`}>
            <div className="flex items-center gap-8">
                <img
                    src={image}
                    alt="avatar"
                    className={`${sizeMap.image[size]} rounded-full border-2 border-white/20 object-cover shadow-lg flex-shrink-0`}
                />
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className={`${sizeMap.heading[size]} font-bold block`}
                            style={{ color: style?.nameColor }}>{name}</span>
                        {style?.showDescription && bio && (
                            <p className={sizeMap.text[size]} style={{ color: style?.descriptionColor }}>
                                {bio}
                            </p>
                        )}
                    </div>
                    <SocialLinks {...props} />
                </div>
            </div>
        </div>
    );
}

export const headerComponents: Record<string, React.FC<HeaderProps>> = {
    default: DefaultHeader,
    side: SideHeader,
};

export const headerOptions = [
    { id: 'default', label: 'Centered', description: 'Classic vertical layout' },
    { id: 'side', label: 'Side by Side', description: 'Horizontal layout' },
];
