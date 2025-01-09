/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/trpc/react';
import { Loader2, PencilIcon, X, BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, TextQuoteIcon, Heading1, Heading2, Heading3Icon, ImageIcon, LinkIcon, CodeIcon, ListIcon, ListOrderedIcon, VideoIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'
import Youtube from '@tiptap/extension-youtube'

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

interface EditProjectDialogProps {
    project_id: string;
    onClose: () => void;
}

export default function EditProjectDialog({ project_id, onClose, }: EditProjectDialogProps) {
    const { mutate: editProject } = api.user.updateProject.useMutation();
    const { data } = api.user.getProjectById.useQuery({ projectId: project_id });
    const ctx = api.useUtils();
    const [icon, setIcon] = useState<string | null>(data?.icon ?? null);
    const [title, setTitle] = useState(data?.title ?? '');
    const [description, setDescription] = useState(data?.description ?? '');
    const [body, setBody] = useState(data?.body ?? '');
    const [link, setLink] = useState(data?.links ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [skills, setSkills] = useState<string[]>(data?.skills?.map(skill => skill.name) ?? []);
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data: skillSuggestions, isLoading: isLoadingSkills } = api.user.getSkillsBySearch.useQuery({
        search: search,
    });

    const handleAddSkill = (skill: string) => {
        if (!skills.includes(skill)) {
            setSkills([...skills, skill]);
        }
        setSearch("");
        setShowSuggestions(false);
    };

    const handleDeleteSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    useEffect(() => {
        setIcon(data?.icon ?? null);
        setTitle(data?.title ?? '');
        setDescription(data?.description ?? '');
        setBody(data?.body ?? '');
        setLink(data?.links ?? '');
        setSkills(data?.skills?.map(skill => skill.name) ?? []);
    }, [data]);


    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "To add detailed description of your project, use images, links and more" }),
            Underline,
            Heading.configure({ levels: [1, 2, 3] }),
            CodeBlock,
            Image,
            ListItem,
            OrderedList,
            Blockquote,
            Youtube.configure({
                controls: false,
                nocookie: true,
                inline: false,
                allowFullscreen: true,

            }),
            Link.configure({
                openOnClick: true,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        // disallowed protocols
                        const disallowedProtocols = ['ftp', 'file', 'mailto']
                        const protocol = parsedUrl.protocol.replace(':', '')

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }

                        // disallowed domains
                        const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                        const domain = parsedUrl.hostname

                        if (disallowedDomains.includes(domain)) {
                            return false
                        }

                        // all checks have passed
                        return true
                    } catch (error) {
                        return false
                    }
                },
                shouldAutoLink: url => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                        const domain = parsedUrl.hostname

                        return !disallowedDomains.includes(domain)
                    } catch (error) {
                        return false
                    }
                },
            }),
        ],
        content: data?.body || 'I love coding',
        editorProps: {
            attributes: {
                spellcheck: 'true',
                class: 'w-full h-full p-2  sm:text-sm overflow-auto prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
            },
        },
    })


    const addYoutubeVideo = () => {
        const url = prompt('Enter YouTube URL')

        if (url) {
            editor?.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 360,
            })
        }
    }


    const setURL = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        try {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url })
                .run()
        } catch (e: any) {
            alert(e.message)
        }
    }, [editor])


    const addImage = async () => {
        const reader = new FileReader();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg, image/png, image/jpg, image/gif';
        input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
                setImageFile(file);
                reader.readAsDataURL(file);
                reader.onload = () => {
                    setIcon(reader.result as string);
                };
            }
        };
        input.click();
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            const res = await fetch('/api/image/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                editor?.chain().focus().setImage({ src: data.url }).run()
            }
        }
    }

    const trigger = useRef<HTMLButtonElement>(null);
    return (
        <div className="">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold">Edit Project</h2>
                <Drawer>
                    <DrawerTrigger ref={trigger}>
                        <div className='bg-gray-100 px-2 py-1 rounded-sm text-xs border hover:border-gray-300  relative'>
                            <span className="absolute flex h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                                <span className="animate-ping absolute inset-0 h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                            </span>
                            Rich Text Editor
                        </div>
                    </DrawerTrigger>
                    <DrawerContent className='max-w-2xl mx-auto px-4 '>
                        <DrawerHeader className='p-0'>
                            <DrawerTitle>Edit project details</DrawerTitle>
                            <DrawerDescription>Use the rich text editor to add detailed description of your project, you can also add images, links and more</DrawerDescription>
                        </DrawerHeader>
                        <div className="flex gap-2 my-2">
                            <button
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                className={`${editor?.isActive('bold') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <BoldIcon size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                className={`${editor?.isActive('italic') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <ItalicIcon size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleStrike().run()}
                                className={`${editor?.isActive('strike') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <StrikethroughIcon size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                className={`${editor?.isActive('underline') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <UnderlineIcon size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={`${editor?.isActive('heading', { level: 1 }) ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <Heading1 size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={`${editor?.isActive('heading', { level: 2 }) ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <Heading2 size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={`${editor?.isActive('heading', { level: 3 }) ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <Heading3Icon size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                                className={`${editor?.isActive('blockquote') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <TextQuoteIcon size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                                className={`${editor?.isActive('codeBlock') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <CodeIcon size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                className={`${editor?.isActive('bulletList') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <ListIcon size={12} />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                className={`${editor?.isActive('orderedList') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <ListOrderedIcon size={12} />
                            </button>
                            <button
                                onClick={() => addImage()}
                                className={`${editor?.isActive('image') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <ImageIcon size={12} />
                            </button>
                            <button
                                onClick={() => setURL()}
                                className={`${editor?.isActive('link') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <LinkIcon size={12} />
                            </button>
                            <button
                                onClick={() => addYoutubeVideo()}
                                className={`${editor?.isActive('youtube') ? 'bg-violet-500 text-white ' : ''} p-2 rounded-md flex items-center justify-center w-max border`}
                            >
                                <VideoIcon size={12} />
                            </button>
                        </div>
                        <div className='w-full h-80 border border-gray-200 rounded-md max-h-[70vh] sm:text-sm overflow-auto'>
                            <EditorContent editor={editor} />
                        </div>
                        <DrawerFooter className='w-full p-0 my-2'>
                            <DrawerClose className='bg-violet-500 text-white p-2 rounded-md disabled:opacity-50 flex items-center justify-center hover:bg-violet-600'
                                onClick={() => setBody(editor?.getHTML() || '')}>
                                Save
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
            <div className="mt-4">
                <div className="relative w-max" onClick={async () => {
                    const reader = new FileReader();
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg, image/png, image/jpg, image/gif';
                    input.onchange = () => {
                        const file = input.files?.[0];
                        if (file) {
                            setImageFile(file);
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                setIcon(reader.result as string);
                            };
                        }
                    };
                    input.click();
                    if (imageFile) {
                        const formData = new FormData();
                        formData.append('file', imageFile);
                        const res = await fetch('/api/image/upload', {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await res.json();
                        if (data.url) {
                            setIcon(data.url);
                        }
                    }
                }}>
                    {icon ?
                        <img src={icon} alt="profile" className="w-16 h-16 rounded-full object-cover opacity-70 bg-black" />
                        : <img src="/avatar.png" alt="profile" className="w-16 h-16 rounded-full object-cover opacity-70 bg-black" />
                    }
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-0 bg-white rounded-full p-[6px] w-max h-max cursor-pointer">
                        <PencilIcon size={12} />
                    </div>
                </div>
                <input type="text" placeholder="Title" className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
                {title === "" && <span className="text-red-500 text-xs">* Title is required</span>}
                <input type="text" placeholder="Project Description" className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="text" placeholder="Project URL" className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={link} onChange={(e) => setLink(e.target.value)} />
                <div className='relative'>
                    <input type="text" placeholder="Add Skill" className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={search} onChange={(e) => {
                        setShowSuggestions(true);
                        setSearch(e.target.value);
                    }} />
                    {showSuggestions && search && (
                        <div className="absolute top-12 z-10 w-full bg-white rounded-md shadow-md p-2 max-h-60 border overflow-auto">
                            {
                                !isLoadingSkills && skillSuggestions && !skillSuggestions.some(skill => skill.name === search) && (
                                    <button className="flex items-center justify-between bg-slate-100 hover:bg-gray-100 p-2 rounded-md w-full" onClick={() => handleAddSkill(search)}>
                                        <p>Add <span className="font-bold">{search}</span></p>
                                    </button>
                                )
                            }
                            {
                                skillSuggestions?.map((skill) => (
                                    <button key={skill.id} className="flex items-center mt-1 justify-between p-2 rounded-md w-full hover:bg-gray-100" onClick={() => handleAddSkill(skill.name)}>
                                        <p>{skill.name}</p>
                                    </button>
                                ))
                            }
                            {
                                isLoadingSkills && (
                                    <div className="flex items-center justify-between mt-2 hover:bg-gray-100 p-2 rounded-md">
                                        <p>Loading...</p>
                                    </div>
                                )
                            }
                            {
                                !isLoadingSkills && skillSuggestions?.length === 0 && (
                                    <div className="flex items-center justify-between mt-2 p-2 rounded-md w-full">
                                        <p>No skill found related to <span className="font-bold">{search}</span></p>
                                    </div>
                                )
                            }
                        </div>
                    )}
                    {skills.length > 0 &&
                        <div className="flex gap-2 flex-wrap mt-2">
                            {
                                skills.map((skill, index) => (
                                    <Badge key={index} className="flex items-center gap-2 bg-blue-200">
                                        {skill}
                                        <button onClick={() => handleDeleteSkill(skill)} className="text-red-500">
                                            <X size={12} />
                                        </button>
                                    </Badge>
                                ))
                            }
                        </div>
                    }
                </div>
                {
                    // Check if body contains HTML tags
                    /<[^>]+>/.test(body) ? (
                        <div className='mt-2 w-full border-gray-300 flex-col gap-1 border p-2 h-20 flex items-center justify-center rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
                            <p className='text-gray-500 text-xs '>Looks like you used rich text editor</p>
                            <button className='bg-gray-100 px-2 py-1 rounded-sm text-xs border hover:border-gray-300  relative w-max' onClick={() => {
                                const triggerElement = trigger.current
                                triggerElement?.click()
                            }}>
                                Edit Rich Text
                            </button>
                        </div>
                    ) : (
                        <textarea
                            rows={6}
                            placeholder="Project Body"
                            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            defaultValue={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    )
                }
                <div className="flex justify-end mt-4">
                    <button className="bg-violet-500 text-white p-2 rounded-md flex items-center disabled:opacity-50" onClick={() => {
                        setIsLoading(true);
                        editProject({
                            projectId: project_id,
                            icon,
                            title,
                            description,
                            body: editor?.getHTML() || '',
                            link,
                            skills: skills,
                        }, {
                            onSuccess: () => {
                                void ctx.user.getUserProjects.invalidate();
                                void ctx.user.getUserSkills.invalidate();
                                void ctx.user.getSkillsBySearch.invalidate({ search: '' });
                                void ctx.user.getProjectById.invalidate({ projectId: project_id });
                                setIsLoading(false);
                                onClose();
                            },
                            onError: () => {
                                setIsLoading(false);
                            }
                        });
                    }} disabled={isLoading || title === ''}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update
                    </button>
                </div>
            </div>
        </div >
    );
}