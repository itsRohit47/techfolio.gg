import Image from "next/image";
const Stats = () => {
    return (
        <div className="flex gap-3 p-3 h-max bg-secondary min-w-96 border-dashed border-2 rounded-lg">
            <div className='bg-tertiary p-3 rounded-lg flex flex-col items-center justify-center'>
                <div className="font-medium text-2xl">1</div>
                <div className="">
                    <Image src="/htb.png" alt="htb logo" width={100} height={100} className="h-full w-full object-cover mix-blend-lighten" />
                </div>
            </div>
            <div className='bg-tertiary p-3 rounded-lg flex flex-col items-center justify-center w-full'>
                <div className="font-medium text-2xl">1</div>
                <div className="">
                    <Image src="/thm.png" alt="htb logo" width={50} height={100} className="h-full w-full object-cover mix-blend-lighten" />
                </div>
            </div>
        </div>
    );
}
export default Stats;