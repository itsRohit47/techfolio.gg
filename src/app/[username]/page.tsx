import ClassicPortfolio from "@/templates/Classic/ClassicPortfolio";
type Props = {
    params: Promise<{ username: string }>
}

export default async function UserPortfolio({ params }: Props) {
    return (
        <ClassicPortfolio username={(await params).username} />
    );
}