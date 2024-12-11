import Image from 'next/image';



const Certificates = () => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 p-3 h-max bg-secondary min-w-96 border-dashed border-2 rounded-lg">
            <div className="flex gap-3 items-center flex-col">
                <Image src="/oscp.png" alt="CISSP" width={80} height={80} />
                <span className="text-xs">98%</span>
            </div>
        </div>
    );
}


export default Certificates;