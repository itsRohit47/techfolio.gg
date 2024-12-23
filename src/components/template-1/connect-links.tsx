import Link from "next/link"
import Image from "next/image"

export default function ConnectLink() {
    return (
        <div className="flex gap-2 items-center">
            <Link href="/connect/github" className="text-sm bg-tertiary hover:bg-tertiary/80 text-white/80 hover:text-white rounded-lg p-1">
                <Image src="/git.svg" alt="github" width={20} height={20} className="" />
            </Link>
            <Link href="/connect/linkedin" className="text-sm bg-tertiary hover:bg-tertiary/80 text-white/80 hover:text-white rounded-lg p-1">
                <Image src="/linkedin.svg" alt="linkedin" width={20} height={20} className="p-[2px]" />
            </Link>
        </div>
    )
}