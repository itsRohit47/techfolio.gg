import ClassicPortfolio from "@/templates/Classic/ClassicPortfolio";
export default async function UserPortfolio({ params }: { params: Promise<{ username: string }> }) {
    const p = await params;
    return (

        <ClassicPortfolio username={p.username} />
    );
}