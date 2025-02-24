import AssetPage from "@/components/asset-page"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <div className="p-4"><AssetPage id={id} /></div>
}



