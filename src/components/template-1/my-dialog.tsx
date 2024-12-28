import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function MyDialog({ body, children, title, des }: { children: React.ReactNode, title: string, des?: string, body: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader className="">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{des}</DialogDescription>
                </DialogHeader>
                {body}
            </DialogContent>
        </Dialog>
    )
}