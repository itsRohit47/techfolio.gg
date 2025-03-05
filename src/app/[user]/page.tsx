import Portfolio from "@/components/portfolio"
import NavBar from "@/components/NavBar"
import { defaultStyle } from "@/types/common"

export default async function PortfolioPage({
    params,
}: {
    params: Promise<{ user: string }>
}) {
    const user = (await params).user

    return <div className="relative h-screen overflow-scroll">
        <NavBar />
        <Portfolio style={defaultStyle} user={user} />
    </div>
}



