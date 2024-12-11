'use client';
import { useAppContext } from "../context";
const LinkButton = ({ children, selected, setSelectedCase }: { children: string, selected?: boolean, setSelectedCase: (value: string) => void }) => {
    return (
        <button onClick={() => {
            setSelectedCase(children);
        }} className={`text-xs border border-primary px-3 py-1 rounded-md border-dashed hover:bg-gray-50 hover:text-black ${selected ? 'bg-white text-black' : ''}`}>
            {children}
        </button>
    );
}


const NavLinks = () => {
    const { selectedCase, setSelectedCase } = useAppContext();

    const links = ['Overview', 'Education', 'Experience', 'Certificates', 'Projects', 'Blogs', 'Contact'];
    return (
        <div className="flex gap-2 overflow-auto items-center pb-3">
            {
                links.map((link) => (
                    <LinkButton key={link} selected={selectedCase === link} setSelectedCase={setSelectedCase}>
                        {link}
                    </LinkButton>
                ))
            }
        </div>
    );
}

export default NavLinks;