import { Badge } from "@/components/ui/badge";
const SkillSection = () => {
    return (
        <div className="flex gap-2 items-center flex-wrap border-2 min-w-96 bg-secondary border-dashed p-3 rounded-lg">
            <Badge>Try Hack me 1%</Badge>
            <Badge>Kali Linux</Badge>
            <Badge>Python</Badge>
            <Badge>Nmap</Badge>
            <Badge>Metasploit</Badge>
            <Badge>Wireshark</Badge>
            <Badge>OSCP</Badge>
            <Badge>CEH</Badge>
            <Badge>CCNA</Badge>
            <Badge>CISSP</Badge>
            <Badge>CompTIA Security+</Badge>
        </div>
    );
}

export default SkillSection;