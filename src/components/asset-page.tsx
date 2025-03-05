/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from "next/router";
import { api } from "@/trpc/react";
import { FormEvent, useState, useEffect, useCallback } from "react";
// Add these new imports at the top
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';
import Youtube from '@tiptap/extension-youtube';
import Button from "./button";
import {
    Trash2Icon,
    UploadIcon,
    BoldIcon,
    ItalicIcon,
    ListIcon,
    LinkIcon,
    ListOrderedIcon,
    ImageIcon,
    Heading1Icon,
    PlusIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExpandIcon
} from "lucide-react";
import { Status } from "@prisma/client";
import Loader from "./loader";
import { useSession } from "next-auth/react";
import { TagInput } from "./tag-input"; // Add this new import
import { ImageViewer } from "./image-viewer"; // Add to imports

export default function AssetPage(
    { id }: { id: string }
) {
    const { data: session } = useSession();
    const ctx = api.useUtils();
    const { data: asset, isLoading } = api.asset.getAsset.useQuery({ id: id });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [status, setStatus] = useState<Status>(Status.DRAFT);
    const [iconFile, setIconFile] = useState<File | null | string>(null);
    const [saving, setSaving] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [existingMedia, setExistingMedia] = useState<string[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null); // Add new state near other state declarations
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false); // Add this state

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "Add a detailed description of your asset..." }),
            Underline,
            Heading.configure({ levels: [1, 2, 3] }),
            CodeBlock,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full',
                },
            }),
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
                validate: url => /^https?:\/\//.test(url),
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'w-full rounded-md h-full border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 hover:shadow-sm focus:bg-white focus:shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-200 overflow-y-auto',
            },
        },
    });

    // Add useEffect to update form values when asset data is loaded
    useEffect(() => {
        if (asset && editor) {
            setTitle(asset.title || "");
            setDescription(asset.description || "");
            setTags(asset.tags || []);
            setExistingMedia(asset.media || []);
            setIconFile(asset.icon || null);
            setStatus(asset.status || Status.DRAFT);
            editor.commands.setContent(asset.body || '');
        }
    }, [asset, editor]);

    const { mutate: saveAsset } = api.asset.updateAsset.useMutation({
        onSuccess: () => {
            setSaving(false);
            setSavingDraft(false);
            setEditMode(false);
            void ctx.asset.getAsset.invalidate()
            void ctx.asset.getAssets.invalidate();
        },
    });
    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/image/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        return data.url;
    };

    const handleSave = async (e: React.FormEvent, draft: boolean) => {
        e.preventDefault();
        if (!title || !editor) return;

        if (draft) {
            setSavingDraft(true);
        }
        else {
            setSaving(true);
        }

        try {
            let iconUrl = null;
            if (iconFile && iconFile instanceof File) {
                iconUrl = await uploadImage(iconFile);
            }

            // Upload new media files
            const newMediaUrls = await Promise.all(
                files.map(file => uploadImage(file))
            );

            // Combine existing and new media URLs
            const allMediaUrls = [...existingMedia, ...newMediaUrls];

            // Get the editor content
            const editorContent = editor.getHTML();

            saveAsset({
                id,
                title,
                description,
                tags,
                icon: iconFile instanceof File ? await uploadImage(iconFile) : (iconFile === null ? null : asset?.icon),
                media: allMediaUrls,
                status: Status[draft ? 'DRAFT' : 'PUBLISHED'],
                body: editorContent  // Save the editor content
            });

        } catch (error) {
            alert('Failed to upload images or save asset');
            console.error(error);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (file: File) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
        return validTypes.includes(file.type);
    };

    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;

        if (files.length + newFiles.length > 6) {
            alert('Maximum 6 files allowed');
            return;
        }

        const validFiles = Array.from(newFiles).filter(validateFile);
        if (validFiles.length !== newFiles.length) {
            alert('Only JPG, PNG, GIF, and SVG files are allowed');
        }

        setFiles(prev => [...prev, ...validFiles]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            setIconFile(file);
        } else {
            alert('Please upload a valid image file (JPG, PNG, GIF, or SVG)');
        }
    };

    const removeExistingMedia = (index: number) => {
        setExistingMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleContainerClick = () => {
        document.getElementById('file-input')?.click();
    };

    const scrollGallery = (direction: 'left' | 'right') => {
        const gallery = document.getElementById('media-gallery');
        if (gallery) {
            const scrollAmount = gallery.clientWidth;
            gallery.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const updateScrollButtons = () => {
        const gallery = document.getElementById('media-gallery');
        if (gallery) {
            setCanScrollLeft(gallery.scrollLeft > 0);
            setCanScrollRight(
                gallery.scrollLeft < gallery.scrollWidth - gallery.clientWidth
            );
        }
    };

    useEffect(() => {
        const gallery = document.getElementById('media-gallery');
        if (gallery) {
            gallery.addEventListener('scroll', updateScrollButtons);
            // Initial check
            updateScrollButtons();
            // Also check after images load
            gallery.querySelectorAll('img').forEach(img => {
                img.addEventListener('load', updateScrollButtons);
            });
        }
        return () => {
            const gallery = document.getElementById('media-gallery');
            if (gallery) {
                gallery.removeEventListener('scroll', updateScrollButtons);
            }
        };
    }, [asset?.media]); // Only re-run when media changes

    const setURL = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        try {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        } catch (e: any) {
            alert(e.message);
        }
    }, [editor]);

    const addImage = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg, image/png, image/jpg, image/gif';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                setIsImageUploading(true); // Set loading state
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/image/upload', {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await res.json();
                    if (data.url) {
                        editor?.chain().focus().setImage({ src: data.url }).run();
                    }
                } catch (error) {
                    alert('Failed to upload image');
                    console.error(error);
                } finally {
                    setIsImageUploading(false); // Reset loading state
                }
            }
        };
        input.click();
    };

    // Modify the first loading check to also prevent any content render
    if (isLoading || !asset) {
        return <div className="flex items-center justify-center h-screen">
            <Loader />
        </div>;
    }

    // Modify the published view condition to be more explicit
    if (asset.status === Status.PUBLISHED && !editMode && !saving && !savingDraft) {
        const isOwner = session?.user?.id === asset.userId;

        return (
            <div className="max-w-xl mx-auto gap-y-6 flex flex-col">
                <div className="flex items-center justify-between">
                    <a href={`/${asset.username}`} className="text-blue-500 hover:underline">
                        view {asset.username}&apos;s portfolio
                    </a>
                    {isOwner && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Edit
                        </button>
                    )}
                </div>
                <div className="flex items-start gap-6">
                    {asset.icon && (
                        <img
                            src={asset.icon}
                            alt={asset.title}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                    )}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {asset.title}
                        </h1>
                        <p className="text-gray-600">
                            {asset.description}
                        </p>

                    </div>
                </div>

                {asset.tags && asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {asset.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {asset.body && (
                    <div  id="content" className="max-w-none space-y-4 pb-32" dangerouslySetInnerHTML={{ __html: asset.body }}>
                    </div>
                )}

                {asset.media && asset.media.length > 0 && (
                    <div className="relative group">
                        <div
                            id="media-gallery"
                            className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
                        >
                            {asset.media.map((url, index) => (
                                <div
                                    key={index}
                                    className="flex-none w-full snap-center relative group/image"
                                >
                                    <img
                                        src={url}
                                        alt={`Project media ${index + 1}`}
                                        className="w-full h-[300px] object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => setFullScreenImage(url)}
                                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-lg text-white opacity-0 group-hover/image:opacity-100 transition-opacity"
                                    >
                                        <ExpandIcon size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {asset.media.length > 1 && (
                            <>
                                {canScrollLeft && (
                                    <button
                                        onClick={() => scrollGallery('left')}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeftIcon size={24} />
                                    </button>
                                )}
                                {canScrollRight && (
                                    <button
                                        onClick={() => scrollGallery('right')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRightIcon size={24} />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}

                {fullScreenImage && (
                    <ImageViewer
                        src={fullScreenImage}
                        onClose={() => setFullScreenImage(null)}
                    />
                )}
            </div>
        );
    }

    return <div>
        <div className="text-gray-800">
            <a href="/dashboard/build" className="hover:underline">All Assets</a> / {asset?.title}
        </div>
        <div>
            <div className="grid lg:grid-cols-2 mt-4 gap-4 lg:h-[calc(100vh-5rem)]">
                <div className="space-y-4 h-full flex flex-col">
                    <div className="flex items-center gap-4">
                        {(iconFile) ? (
                            <div className="relative group w-20 h-20">
                                <img
                                    src={typeof iconFile === 'string' ? iconFile : URL.createObjectURL(iconFile)}
                                    alt="Project icon"
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIconFile(null);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center"
                                >
                                    <Trash2Icon size="12" />
                                </button>
                            </div>
                        ) : (
                            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-white hover:bg-white/70">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png,.gif,.svg"
                                    onChange={handleIconUpload}
                                />
                                <UploadIcon className="w-6 h-6 text-gray-400" />
                            </label>
                        )}
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Small Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                        </div>

                    </div>
                    <TagInput
                        tags={tags}
                        setTags={setTags}
                        placeholder="Press enter to add tags"
                        maxTags={6}
                    />
                    <div
                        className={`bg-white border-2 border-dashed ${dragActive ? 'border-blue-500' : 'border-gray-300'} 
                                  rounded-lg p-4 hover:shadow-sm hover:bg-white/80 flex  gap-4 cursor-pointer justify-between items-center`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={handleContainerClick}
                    >
                        {existingMedia.length === 0 && files.length === 0 ? (
                            <div className="h-full flex items-center justify-center flex-col gap-3 w-full">
                                <UploadIcon className="w-12 h-12 text-gray-300" />
                                <div className="text-gray-400 text-center">
                                    <p className="font-medium">Drag and drop files here</p>
                                    <p className="text-sm">JPG, PNG, GIF, SVG only</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 items-center justify-center">
                                {/* Existing Media */}
                                {existingMedia.map((mediaUrl, index) => (
                                    <div
                                        key={`existing-${index}`}
                                        className="relative group border border-gray-300 rounded-lg p-1 overflow-hidden border-dashed h-28 lg:h-52"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img
                                            src={mediaUrl}
                                            alt={`Existing media ${index + 1}`}
                                            className="w-full h-full object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeExistingMedia(index);
                                            }}
                                            className="absolute top-3 right-3 rounded-full p-1 opacity-0 group-hover:opacity-100 bg-red-100 text-red-500 w-6 h-6 flex items-center justify-center"
                                        >
                                            <Trash2Icon size="12" />
                                        </button>
                                    </div>
                                ))}

                                {/* New Files */}
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative group border border-gray-300 rounded-lg p-1 overflow-hidden border-dashed h-28 lg:h-52"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Upload ${index + 1}`}
                                            className="w-full object-cover rounded h-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(index);
                                            }}
                                            className="absolute top-3 right-3 rounded-full p-1 opacity-0 group-hover:opacity-100 bg-red-100 text-red-500 w-6 h-6 flex items-center justify-center"
                                        >
                                            <Trash2Icon size="12" />
                                        </button>
                                    </div>
                                ))}
                                {existingMedia.length + files.length < 6 && (
                                    <div className="flex items-center justify-center gap-2 h-52 border border-gray-300 rounded-lg p-1 overflow-hidden border-dashed cursor-pointer hover:bg-gray-50 hover:border-gray-400">
                                        <PlusIcon size={24} className="text-gray-500" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Hidden file input */}
                        <input
                            id="file-input"
                            type="file"
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.gif,.svg"
                            multiple
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </div>
                </div>
                <div className="h-full space-y-2 flex flex-col justify-between">
                    <div className="bg-white border border-gray-200 rounded-t-lg p-2 flex gap-2">
                        <button
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                        >
                            <BoldIcon size={16} />
                        </button>
                        <button
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                        >
                            <ItalicIcon size={16} />
                        </button>
                        <div className="w-px bg-gray-200"></div>
                        <button
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
                        >
                            <Heading1Icon size={16} />
                        </button>
                        <div className="w-px bg-gray-200"></div>
                        <button
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                        >
                            <ListIcon size={16} />
                        </button>
                        <button
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                        >
                            <ListOrderedIcon size={16} />
                        </button>
                        <div className="w-px bg-gray-200"></div>
                        <button
                            onClick={setURL}
                            className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('link') ? 'bg-gray-200' : ''}`}
                        >
                            <LinkIcon size={16} />
                        </button>
                        <button
                            onClick={addImage}
                            disabled={isImageUploading}
                            className={`p-2 hover:bg-gray-100 rounded flex items-center justify-center ${isImageUploading ? 'opacity-50' : ''}`}
                        >
                            {isImageUploading ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            ) : (
                                <ImageIcon size={16} />
                            )}
                        </button>
                    </div>
                    <div className="flex-1 h-full overflow-y-auto max-h-[calc(100vh-11rem)]">
                        <EditorContent editor={editor} className="h-full overflow-y-auto" />
                    </div>
                    <div className="flex gap-2">
                        <Button className="w-full bg-white hover:bg-white/70 border border-gray-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled={!title || savingDraft || saving}
                            onClick={(e: FormEvent<Element>) => handleSave(e, true)}>
                            Save Draft {savingDraft && <Loader />}
                        </Button>
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled={!title || saving || savingDraft}
                            onClick={(e: FormEvent<Element>) => handleSave(e, false)}
                        >
                            Save {saving && <Loader />}
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    </div >
}
