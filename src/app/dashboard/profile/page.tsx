'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/trpc/react';
import Breadcrumb from '@/components/breadcrumb';

export default function ProfilePage() {
    const fields = ['Image', 'Display Name', 'Username', 'Bio', 'Location', 'LinkedIn', 'GitHub'];
    const inputFields = ['Display Name', 'Username', 'Bio', 'Location', 'LinkedIn', 'GitHub'];
    const imageField = ['Image'];
    const textAreaFields = ['Bio'];
    const { data: session } = useSession();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        location: '',
        linkedin: '',
        github: '',
    });
    const [links, setLinks] = useState<{ id?: string, label: string; url: string }[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialData, setInitialData] = useState({
        formData: {
            name: '',
            username: '',
            bio: '',
            location: '',
            linkedin: '',
            github: '',
        },
        links: [] as { id?: string; label: string; url: string; }[]
    });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data: userData, isLoading } = api.asset.getProfile.useQuery();
    const utils = api.useUtils();

    const updateProfile = api.asset.updateProfile.useMutation({
        onSuccess: () => {
            toast.success('Profile updated successfully');
            setIsSaving(false);
        },
        onError: (error) => {
            toast.error(error.message);
            setIsSaving(false);
        },
        onMutate: async (newData) => {
            await utils.asset.getProfile.cancel();
            const previousData = utils.asset.getProfile.getData();
            utils.asset.getProfile.setData(undefined, old => {
                if (!old?.user) return old;
                const links = (newData.links || old.links).map(link => ({
                    id: link.id || crypto.randomUUID(),
                    label: link.label,
                    url: link.url
                }));
                return {
                    user: {
                        ...old.user,
                        ...newData,
                        id: old.user.id
                    },
                    links
                };
            });
            return { previousData };
        },
        onSettled: () => {
            void utils.asset.getProfile.invalidate();
        },
    });

    useEffect(() => {
        if (userData?.user) {
            const newFormData = {
                name: userData.user.name ?? '',
                username: userData.user.username ?? '',
                bio: userData.user.bio ?? '',
                location: userData.user.location ?? '',
                linkedin: userData.user.linkedin ?? '',
                github: userData.user.github ?? '',
            };
            setFormData(newFormData);
            setLinks(userData.links ?? []);
            setInitialData({
                formData: newFormData,
                links: userData.links ?? []
            });
            setImagePreview(userData.user.image ?? null);
        }
    }, [userData]);

    useEffect(() => {
        const formDataChanged = JSON.stringify(formData) !== JSON.stringify(initialData.formData);
        const linksChanged = JSON.stringify(links) !== JSON.stringify(initialData.links);
        const imageChanged = selectedImage !== null;
        setHasChanges(formDataChanged || linksChanged || imageChanged);
    }, [formData, links, initialData, selectedImage]);

    const handleInputChange = (field: string, value: string) => {
        const mapping: Record<string, keyof typeof formData> = {
            'Display Name': 'name',
            'Username': 'username',
            'Bio': 'bio',
            'Location': 'location',
            'LinkedIn': 'linkedin',
            'GitHub': 'github'
        };
        const key = mapping[field];
        if (key) {
            setFormData(prev => ({
                ...prev,
                [key]: value
            }));
        }
    };

    const getFormValue = (field: string) => {
        const mapping: Record<string, keyof typeof formData> = {
            'Display Name': 'name',
            'Username': 'username',
            'Bio': 'bio',
            'Location': 'location',
            'LinkedIn': 'linkedin',
            'GitHub': 'github'
        };
        const key = mapping[field];
        return key ? formData[key] : '';
    };

    const isValidLink = (link: { label: string; url: string }) => {
        return link.label.trim() !== '' && link.url.trim() !== '';
    };

    const uploadImage = async (file: File): Promise<string> => {
        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/image/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload image');
            const data = await response.json();
            return data.url;
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const imageUrl = selectedImage ? await uploadImage(selectedImage) : undefined;

            const updateData = {
                ...(formData.name !== initialData.formData.name && { name: formData.name }),
                ...(formData.username !== initialData.formData.username && { username: formData.username }),
                ...(formData.bio !== initialData.formData.bio && { bio: formData.bio }),
                ...(formData.location !== initialData.formData.location && { location: formData.location }),
                ...(formData.linkedin !== initialData.formData.linkedin && { linkedin: formData.linkedin }),
                ...(formData.github !== initialData.formData.github && { github: formData.github }),
                ...(imageUrl && { image: imageUrl }),
                links: links.filter(isValidLink)
            };

            updateProfile.mutate(updateData, {
                onSuccess: () => {
                    setSelectedImage(null);
                    setHasChanges(false);
                    setInitialData({
                        formData,
                        links: updateData.links
                    });
                }
            });
        } catch (error) {
            toast.error('Failed to update profile');
            setIsSaving(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const updateLink = (index: number, field: 'label' | 'url', value: string) => {
        const newLinks = [...links];
        if (newLinks[index]) {
            newLinks[index][field] = value;
            setLinks(newLinks);
        }
    };

    const removeLink = (index: number) => {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        setLinks(newLinks);
    };

    const removeEmptyLinks = () => {
        const validLinks = links.filter(isValidLink);
        if (validLinks.length !== links.length) {
            setLinks(validLinks);
        }
    };

    const addLink = (e: React.MouseEvent) => {
        e.preventDefault();
        removeEmptyLinks();
        setLinks([...links, { label: '', url: '' }]);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full w-full">
            Loading...
        </div>;
    }

    return (
        <div className="w-full h-full py-6 px-4">
            <h1 className="text-2xl font-semibold mb-10">Profile Settings</h1>
            <form onSubmit={handleSubmit} className='max-w-3xl'>
                <div className="grid grid-cols-1 gap-y-6">
                    {fields.map((field) => (
                        <div key={field} className='flex gap-y-6 w-full items-start'>
                            <label htmlFor={field} className="block text-sm font-medium text-gray-700 w-1/3">
                                {field}
                            </label>
                            <div className="w-2/3">
                                {inputFields.includes(field) && !textAreaFields.includes(field) ? (
                                    <input
                                        type="text"
                                        placeholder={field}
                                        autoComplete="off"
                                        name={field}
                                        id={field}
                                        value={getFormValue(field)}
                                        onChange={(e) => handleInputChange(field, e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                ) : imageField.includes(field) ? (
                                    <div className="mt-1 flex items-center">
                                        <div className="relative flex-shrink-0 h-12 w-12 group">
                                            <img
                                                className="h-12 w-12 rounded-full object-cover"
                                                src={imagePreview ?? session?.user.image ?? '/logo2.png'}
                                                alt=""
                                            />
                                            {selectedImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedImage(null);
                                                        setImagePreview(userData?.user?.image ?? null);
                                                    }}
                                                    className="absolute -top-1 -right-1 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm text-gray-500">
                                                <label
                                                    htmlFor="image"
                                                    className="cursor-pointer font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                    Change
                                                </label>
                                                <input
                                                    type="file"
                                                    id="image"
                                                    name="image"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : textAreaFields.includes(field) ? (
                                    <textarea
                                        id={field}
                                        name={field}
                                        placeholder={field}
                                        rows={3}
                                        value={getFormValue(field)}
                                        onChange={(e) => handleInputChange(field, e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Other Links</h3>
                        <button
                            onClick={addLink}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                            <Plus size={16} />
                            Add Link
                        </button>
                    </div>

                    {links.map((link, index) => (
                        <div key={index} className="flex gap-4 items-center mt-4">
                            <input
                                type="text"
                                placeholder="Label (e.g. HackerRank)"
                                value={link.label}
                                onChange={(e) => updateLink(index, 'label', e.target.value)}
                                className="flex-1 p-2 border rounded-md w-1/4"
                            />
                            <input
                                type="url"
                                placeholder="URL"
                                value={link.url}
                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                                className="flex-2 p-2 border rounded-md w-1/2"
                            />
                            <button
                                onClick={() => removeLink(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end items-center gap-4">
                    {hasChanges && (
                        <span className="text-sm text-amber-600">
                            You have unsaved changes
                        </span>
                    )}
                    <button
                        type="submit"
                        disabled={isSaving || !hasChanges}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
