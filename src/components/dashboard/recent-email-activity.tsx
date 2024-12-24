/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, ExpandIcon } from "lucide-react";
import { Badge } from "../ui/badge";

interface EmailActivity {
    sender: string;
    subject: string;
    timestamp: string;
    activitie: string;
    image: string;
}


//add emoji to the end of the string
const emailActivities = [
    {
        sender: 'Elon Musk',
        subject: 'SpaceX Launch',
        activitie: 'clicked on the link',
        timestamp: '2 hours ago',
        image: 'https://nld.mediacdn.vn/291774122806476800/2024/11/7/ty-phu-elon-musk-shutterstock-173097232703759673740.jpg',
    },
    {
        sender: 'Elon Musk',
        subject: 'Tesla Update',
        activitie: 'opened your email',
        timestamp: '2 hours ago',
        image: 'https://nld.mediacdn.vn/291774122806476800/2024/11/7/ty-phu-elon-musk-shutterstock-173097232703759673740.jpg',
    },
    {
        sender: 'Jeff Bezos',
        subject: 'Amazon Sale',
        activitie: 'clicked on the link',
        timestamp: '5 hours ago',
        image: 'https://imageio.forbes.com/specials-images/imageserve/5f469ea85cc82fc8d6083f05/Amazon-Founder-and-CEO-Jeff-Bezos/960x0.jpg?format=jpg&width=960',
    },
    {
        sender: 'Andrew Tate',
        subject: 'Motivational Speech',
        activitie: 'opened your email',
        timestamp: '1 day ago',
        image: 'https://quick-crane.transforms.svdcdn.com/production/images/16723620780107.remini-enhanced.jpg?w=2640&h=1760&auto=compress%2Cformat&fit=crop&dm=1677668818&s=189c58125339b911c65ff2b050071f8c',
    },
    {
        sender: 'Selena Gomez',
        subject: 'New Album Release',
        activitie: 'clicked on your email',
        timestamp: '2 days ago',
        image: 'https://cdn.britannica.com/81/160781-050-8B7BF24D/Selena-Gomez-2010.jpg',
    }
];

export default function RecentEmailActivity() {
    return (
        <div className="flex flex-col h-max rounded-lg lightBg dark:bg-primary bg-gradient-to-t relative pb-5">
            <h2 className="text-xs px-3 pt-3">Recent Email Activity</h2>
            {emailActivities.map((activity, index) => (
                <div key={index}>
                    <EmailActivityItem activity={activity} />
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

function EmailActivityItem({ activity }: { activity: EmailActivity }) {
    return (
        <div className="flex gap-x-1 items-center px-3 pt-3 justify-between">
            <div className="flex gap-x-1 items-center">
                <img src={activity.image} alt="profile" className="w-4 h-4 rounded-full object-cover" />
                <h1 className="text-xs text-white/70">{activity.sender}</h1>
                <span className="text-xs text-gray-500">{activity.activitie}</span>
            </div>
            <span className="text-xs text-white/70">{activity.timestamp}</span>
        </div>
    );
}
