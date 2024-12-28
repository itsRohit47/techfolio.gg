import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import ReactMarkdown from 'react-markdown'



export default function MyDrawer({ body, children, title, des }: { children: React.ReactNode, title: string, des?: string, body?: string }) {
    return (
        <Drawer>
            <DrawerTrigger onBlur={(e) => {
                e.preventDefault();
            }
            }>
                {children}
            </DrawerTrigger>
            <DrawerContent className="p-0 w-max mx-auto ">
                <DrawerHeader className="p-4">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{des}</DrawerDescription>
                </DrawerHeader>
                <ReactMarkdown className='prose max-h-[500px] overflow-auto p-4 prose-sm dark:prose-invert w-full'>
                    {body ? body : "No content found"}
                </ReactMarkdown>
            </DrawerContent>
        </Drawer>
    )
}