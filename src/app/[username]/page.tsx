import type { Metadata, ResolvingMetadata } from 'next'
import ClassicPortfolio from "@/templates/Classic/ClassicPortfolio";
import { api } from '@/trpc/server';
type Props = {
    params: Promise<{ username: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    // read route params
    const id = (await params).username

    const p = await params;

    const m = await api.user.getUserMetadata({ username: p.username });

    // optionally access and extend (rather than replace) parent metadata

    return {
        title: m?.name,
        description: m?.bio?.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags from bio
    }
}
export default async function UserPortfolio({ params }: Props) {
    return (
        <ClassicPortfolio username={(await params).username} />
    );
}