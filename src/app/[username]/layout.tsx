'use client'
import { api } from "@/trpc/react"
import { usePathname } from "next/navigation"

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const username = pathname ? pathname.split("/")[1] : "";
    const { data: userData, isLoading } = api.user.getUserData.useQuery({ username: username! });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User not found</div>;
    }

    return (
        <main>
            {userData?.email}
            {children}
        </main>
    )
}