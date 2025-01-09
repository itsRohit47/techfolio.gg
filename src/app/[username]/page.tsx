import type { Metadata, ResolvingMetadata } from 'next'
import ClassicPortfolio from "@/templates/Classic/ClassicPortfolio";
import { api } from '@/trpc/server';
type Props = {
    params: Promise<{ username: string }>
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const uname = (await params).username

    // fetch data
    const data = await api.user.getUserMetadata({ username: uname })

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: `${data?.name}` || 'User Portfolio',
        description: `${data?.bio}`,
        openGraph: {
            images: [`${data?.image}`, ...previousImages],
        },
    }
}

export default async function UserPortfolio({ params, searchParams }: Props) {
    return (
        <ClassicPortfolio username={(await params).username} />
    );
}