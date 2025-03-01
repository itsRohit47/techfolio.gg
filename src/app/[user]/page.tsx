import Portfolio from "@/components/portfolio"
import NavBar from "@/components/NavBar"
import { defaultStyle } from "@/types/common"

export default async function PortfolioPage({
    params,
}: {
    params: Promise<{ user: string }>
}) {
    const user = (await params).user
    const links = [
        { name: 'Home', href: '/dashboard', iconName: 'Home' },
        { name: "Build", href: "/dashboard/build", iconName: "Hammer" },
        { name: "Design", href: "/dashboard/design", iconName: "PaintBucket" },
        { name: "Settings", href: "/dashboard/settings", iconName: "Cog" },
        { name: "Sign out", href: "/api/auth/signout", iconName: "Power" },
    ]

    return <div className="relative h-screen overflow-scroll">
        <NavBar links={links} />
        <Portfolio style={defaultStyle} user={user} />
    </div>
}



