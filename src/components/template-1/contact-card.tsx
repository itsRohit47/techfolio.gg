import { SendIcon, MailIcon } from "lucide-react";
import EditCardButton from "../edit-card-button";

export default function ContactCard() {
    return (
        <div className="flex flex-col gap-3 h-max lightBg dark:bg-secondary p-4 rounded-lg text-xs" >
            <div className="flex gap-2 mb-3 opacity-70">
                <MailIcon size={16} opacity={.7} />
                <div>Get in touch</div>
                <EditCardButton className="ml-auto" onEdit={() => { console.log('') }} onSave={() => { console.log('') }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Your email" className="" />
                <input type="text" placeholder="Your name" className="" />
                <div className="col-span-2 flex gap-3" >
                    <textarea rows={3} placeholder="Leave a message for me (50 max)" className="" />
                </div>
            </div>
            <button className="btn">
                <SendIcon size={14} />
                <span>Send Message</span>
            </button>
        </div >
    );
}