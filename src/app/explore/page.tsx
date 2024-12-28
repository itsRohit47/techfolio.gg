import { Badge } from "@/components/ui/badge";

export default function ExplorePage() {
    return (
        <div className="p-4 flex flex-col gap-4">
            <p className="text-4xl max-w-3xl">Get inspired by the amazing people in the community, and learn from their experiences.</p>
            <div className="flex gap-2">
                <Badge>Featured</Badge>
                <Badge>Popular</Badge>
                <Badge>New</Badge>
                <Badge>Top Rated</Badge>
            </div>
        </div>
    );
}