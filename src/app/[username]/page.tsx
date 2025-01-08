import type { Metadata, ResolvingMetadata } from 'next'
import ClassicPortfolio from "@/templates/Classic/ClassicPortfolio";
import { api } from '@/trpc/server';
type Props = {
    params: Promise<{ username: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = (await params).username

    const p = await params;

    const m = await api.user.getUserMetadata({ username: p.username });

    // optionally access and extend (rather than replace) parent metadata

    return {
        title: m?.name,
        openGraph: {
            images: m ? [m.image].filter((image): image is string => image !== null) : [],
        },
        icons: m ? [m.image].filter((image): image is string => image !== null) : [],
        description: m?.bio?.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags from bio
    }
}

export default async function UserPortfolio({ params }: { params: Promise<{ username: string }> }) {
    const p = await params;
    return (
        <ClassicPortfolio username={p.username} />
    );
}