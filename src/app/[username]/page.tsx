import ClassicPortfolio from "@/templates/Classic/ClassicPortfolio";
export default function UserPortfolio({ params }: { params: { username: string } }) {
    return (
        <ClassicPortfolio username={params.username} />
    );
}