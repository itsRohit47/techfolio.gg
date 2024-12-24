/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, ExpandIcon } from "lucide-react";
import { Badge } from "../ui/badge";

interface Contact {
    name: string;
    email: string;
    image: string;
    industry: string;
    role: string;
    company: string;
    location: string;
    linkedin: string;
    mobile: string;
}

const contacts = [
    {
        name: 'Elon Musk',
        email: 'elumah@x.com',
        image: 'https://nld.mediacdn.vn/291774122806476800/2024/11/7/ty-phu-elon-musk-shutterstock-173097232703759673740.jpg',
        industry: 'Software Development',
        role: 'Software Engineer',
        company: 'Example Inc',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/johndoe',
        mobile: '+1 123 456 7890',
    },
    {
        name: 'Jeff Bezos',
        email: 'jeffbezoz@amazon.com',
        image: 'https://imageio.forbes.com/specials-images/imageserve/5f469ea85cc82fc8d6083f05/Amazon-Founder-and-CEO-Jeff-Bezos/960x0.jpg?format=jpg&width=960',
        industry: 'Software Development',
        role: 'Software Engineer',
        company: 'Example Inc',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/johndoe',
        mobile: '+1 123 456 7890',
    },
    {
        name: 'Andrew Tate',
        email: 'andrewtate@tate.com',
        image: 'https://quick-crane.transforms.svdcdn.com/production/images/16723620780107.remini-enhanced.jpg?w=2640&h=1760&auto=compress%2Cformat&fit=crop&dm=1677668818&s=189c58125339b911c65ff2b050071f8c',
        industry: 'Software Development',
        role: 'Software Engineer',
        company: 'Example Inc',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/janedoe',
        mobile: '+1 123 456 7890',
    },
];


export default function Contacts() {
    return (
        <div className="flex flex-col h-max rounded-lg lightBg dark:bg-primary bg-gradient-to-t relative pb-5">
            <h2 className="text-xs px-3 pt-3">Recent Contacts</h2>
            {contacts.map((contact, index) => (
                <div key={index}>
                    <ContactItem contact={contact} />
                </div>
            ))}
            <div className="dark:from-[#121212] from-gray-100 to-background-200/0 pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t rounded-lg">
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-xs text-white/70 cursor-pointer w-max z-10 absolute bottom-3 right-1/2 translate-x-1/2 bg-primary rounded-lg">
                <span>View All</span>
                <ExpandIcon size={12} />
            </button>
        </div >
    );
}


function ContactItem({ contact }: { contact: Contact }) {
    return (
        <div className="flex gap-x-3 items-center px-3 pt-3">
            <img src={contact.image} alt="profile" className="rounded-lg p-1 border h-10 w-10 object-cover transition-all duration-300" />
            <div className="flex flex-col ">
                <h1 className="text-sm text-white/70">{contact.name}</h1>
                <h2 className="text-xs">{contact.email}</h2>
            </div>
        </div>
    );
}