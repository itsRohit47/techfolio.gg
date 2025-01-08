import { Skeleton } from "../ui/skeleton";

export default function PreviewSkeleton() {
    return (
        <section className="max-w-xl mx-auto flex justify-center items-center p-4 py-10 md:p-10 w-full flex-col gap-4 h-full min-h-screen">
            <div className="w-full px-2">
                <section className="w-full">
                    <div className="flex gap-2 items-center flex-col text-center">
                        <div className="bg-gray-100 rounded-full flex items-center justify-center">
                            <Skeleton className="w-20 h-20 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-40 mx-auto" />
                            <Skeleton className="h-4 w-32 mx-auto" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-2 mb-2 text-center">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4 mx-auto" />
                            <Skeleton className="h-4 w-5/6 mx-auto" />
                            <Skeleton className="h-4 w-2/3 mx-auto" />
                        </div>
                    </div>
                </section>
            </div>
            <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex flex-col gap-3 w-full">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border cursor-pointer border-gray-200 rounded-xl p-3 flex gap-3 items-center transition-all duration-500 hover:shadow-sm hover:scale-[1.02] hover:-translate-y-[2px] ease-in-out bg-white/20 backdrop-blur-md">
                        <Skeleton className="w-12 h-12 rounded-md" />
                        <div className="flex flex-col gap-1 text-start flex-grow">
                            <div className="font-semibold text-sm flex items-center gap-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}