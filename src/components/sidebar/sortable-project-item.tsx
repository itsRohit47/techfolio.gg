
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Loader2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import EditProjectDialog from "../dialogs/edit-project-dialog";

export default function SortableProjectItem({ id, proj }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`flex items-center gap-2 group  w-full pb-2 ${/* existing classes */}`}
        >
            {proj.icon ? <img src={proj.icon} alt="project" className="w-6 h-6 border rounded-full object-cover" /> : <div className="w-6 h-6 rounded-full bg-gray-200"></div>}
            <p className="text-sm line-clamp-1 w-full">{proj.title}</p>
            <div className="flex gap-1">
                {proj.skills.slice(0, 2).map((skill, index) => (
                    <div key={index} className="text-xs bg-gray-100 text-nowrap border text-gray-600 px-1 rounded-md">{skill.name}</div>
                ))}
                {proj.skills.length > 2 && (
                    <span className="text-xs bg-gray-100 text-nowrap border text-gray-600 px-1 rounded-md">...</span>
                )}
            </div>
            <Dialog>
                <DialogTrigger>
                    <div className="hover:bg-sky-100 p-1 rounded-md cursor-pointer border border-sky-200 bg-sky-50 text-xs text-sky-600">
                        Edit
                    </div>
                </DialogTrigger>
                <DialogContent className="p-4">
                    <DialogTitle className="hidden">Edit Project</DialogTitle>
                    <EditProjectDialog project_id={id} />
                </DialogContent>
            </Dialog>
            <div className="hover:bg-red-100 flex gap-1 items-center p-1 rounded-md cursor-pointer border border-red-200 bg-red-50 text-xs text-red-600">
                {proj.isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : ''} Delete
            </div>
            <GripVertical className="cursor-grab" size={20} />
        </div>
    );
}