import InterestClickBar from "@/components/interest-click-bar";

export default function INeedThis({ caseNum }: { caseNum: number }) {
    return (
        <section className="bg-secondary min-h-screen h-screen">
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md mt-12">
                    <InterestClickBar caseNum={
                        caseNum
                    } />
                </div>
            </div>
        </section>
    );
}
