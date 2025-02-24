/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from "next/router";
import { api } from "@/trpc/react";
import { FormEvent, useState, useEffect } from "react";
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
    PlusIcon
} from "lucide-react";
import { Status } from "@prisma/client";
import Loader from "./loader";

export default function AssetPage(
    { id }: { id: string }
) {
    const ctx = api.useUtils();
    const { data: asset, isLoading } = api.asset.getAsset.useQuery({ id });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [status, setStatus] = useState<Status>(Status.DRAFT);
    const [iconFile, setIconFile] = useState<File | null | string>(null);
    const [saving, setSaving] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [existingMedia, setExistingMedia] = useState<string[]>([]);
    const [editMode, setEditMode] = useState(false);

    // Add useEffect to update form values when asset data is loaded
    useEffect(() => {
        if (asset) {
            setTitle(asset.title || "");
            setDescription(asset.description || "");
            setTags(asset.tags || []);
            setExistingMedia(asset.media || []);
            setIconFile(asset.icon || null);
            setStatus(asset.status || Status.DRAFT);
        }
    }, [asset]);


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
        if (!title) return;

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

            saveAsset({
                id,
                title,
                description,
                tags,
                icon: iconFile instanceof File ? await uploadImage(iconFile) : (iconFile === null ? null : asset?.icon),
                media: allMediaUrls,
                status: Status[draft ? 'DRAFT' : 'PUBLISHED'],
                body: null
            }, {
                onError: (error) => {
                    alert(`Failed to save asset: ${error.message}`);
                }
            });

        } catch (error) {
            alert('Failed to upload images or save asset');
            console.error(error);
        }
    };

    const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.endsWith(', ')) {
            const newTag = value.slice(0, -2).trim();
            if (newTag && !tags.includes(newTag) && tags.length < 6) {
                setTags([...tags, newTag]);
                setTagInput("");
            } else if (tags.length >= 6) {
                alert('Maximum 6 tags allowed');
                setTagInput("");
            }
        } else {
            setTagInput(value);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
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

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <Loader />
        </div>;
    }

    if (!asset) {
        return <div className="flex items-center justify-center h-screen">
            <p className="text-gray-800">Asset not found</p>
        </div>;
    }

    if (status === Status.PUBLISHED && !editMode) {
        return <div className="flex items-center justify-center h-screen">
            <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            >
                Edit
            </button>
        </div>;
    }

    return <div>
        <div className="text-gray-800">
            <a href="/dashboard/build" className="hover:underline">All Assets</a> / {asset?.title}
        </div>
        <div>
            <div className="grid grid-cols-2 mt-4 gap-4 h-[calc(100vh-5rem)]">
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
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add tags (comma separated)"
                            value={tagInput}
                            onChange={handleTagInput}
                        />
                    </div>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <div key={index} className="flex items-center bg-white px-3 py-1 rounded border border-gray-200">
                                    <span className="text-sm text-gray-600">{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-2 text-gray-400 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
                                        className="relative group border border-gray-300 rounded-lg p-1 overflow-hidden border-dashed h-52"
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
                                        className="relative group border border-gray-300 rounded-lg p-1 overflow-hidden border-dashed h-52"
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
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <BoldIcon size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <ItalicIcon size={16} />
                        </button>
                        <div className="w-px bg-gray-200"></div>
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <Heading1Icon size={16} />
                        </button>
                        <div className="w-px bg-gray-200"></div>
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <ListIcon size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <ListOrderedIcon size={16} />
                        </button>
                        <div className="w-px bg-gray-200"></div>
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <LinkIcon size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <ImageIcon size={16} />
                        </button>
                    </div>
                    <textarea
                        name="description"
                        id="description"
                        placeholder="Description"
                        className="w-full h-full rounded-t-none"
                        defaultValue={asset?.body || ""}
                        onChange={(e) => {
                            // Add state and handler for body if needed
                        }}
                    ></textarea>
                    <div className="flex gap-2">
                        <Button className="w-full bg-white hover:bg-white/70 border border-gray-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled={!title || savingDraft}
                            onClick={(e: FormEvent<Element>) => handleSave(e, true)}>
                            Save Draft {savingDraft && <Loader />}
                        </Button>
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled={!title || saving}
                            onClick={(e: FormEvent<Element>) => handleSave(e, false)}
                        >
                            Save {saving && <Loader />}
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    </div >;
}