/* eslint-disable @next/next/no-img-element */
'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import { AlertCircleIcon, Plus, Router, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Loader from '@/components/loader';
import useDebounce from '@/lib/hooks/use-debounce';

const ProfileContent = () => {
    const fields = ['Image', 'Display Name', 'Username', 'Bio', 'Location', 'LinkedIn', 'GitHub'];
    const inputFields = ['Display Name', 'Username', 'Bio', 'Location', 'LinkedIn', 'GitHub'];
    const imageField = ['Image'];
    const textAreaFields = ['Bio'];
    const { data: session, update: updateSession } = useSession();
    const ctx = api.useUtils();
    const router = useRouter();
    const params = useSearchParams();
    const [onboarding, setOnboarding] = useState(false);

    const [formData, setFormData] = useState({
        image: '',
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
            image: '',
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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [linkChanged, setLinkChanged] = useState(false);
    const requiredFields = ['name', 'username'];

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
                image: userData.user.image ?? '',
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
        const formDataChanged = Object.entries(formData).some(([key, value]) => {
            if (requiredFields.includes(key) && value === '') return false;
            return value !== initialData.formData[key as keyof typeof formData];
        });

        // Improved link comparison
        const linksChanged = links.some((currentLink) => {
            const originalLink = initialData.links.find(l => l.id === currentLink.id);
            if (!originalLink) return true;
            return currentLink.label !== originalLink.label ||
                currentLink.url !== originalLink.url;
        });

        const imageChanged = selectedImage !== null;
        setHasChanges(formDataChanged || linksChanged || imageChanged);
    }, [formData, links, initialData, selectedImage, requiredFields]);

    useEffect(() => {
        if (params.has('onboarding')) {
            setOnboarding(true);
        }
    }, [params, router]);

    const debouncedUsername = useDebounce(formData.username, 500);

    const { data: isUsernameAvailable, isFetching } = api.asset.isUsernameAvailable.useQuery(
        { username: debouncedUsername },
        {
            enabled: !!debouncedUsername && debouncedUsername !== initialData.formData.username
        }
    );

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
            // Sanitize username input: remove spaces and convert to lowercase
            const finalValue = key === 'username' ? value.replace(/\s+/g, '').toLowerCase() : value;
            setFormData(prev => ({
                ...prev,
                [key]: finalValue
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
        const newErrors: Record<string, string> = {};

        requiredFields.forEach(field => {
            if (!formData[field as keyof typeof formData]) {
                newErrors[field] = `${field} is required`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fill in all required fields');
            return;
        }

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
                    setOnboarding(false);
                    setSelectedImage(null);
                    setHasChanges(false);
                    setInitialData({
                        formData,
                        links: updateData.links
                    });
                    if (formData.username !== initialData.formData.username) {
                        void updateSession();
                    }
                    void ctx.asset.getProfile.invalidate();
                    router.push('/dashboard/design');
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

    const getIncompleteFields = () => {
        const incomplete = [];
        if (!formData.name) incomplete.push('Display Name');
        if (!formData.username) incomplete.push('Username');
        return incomplete;
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full w-full">
            <Loader />
        </div>;
    }

    const incompleteFields = getIncompleteFields();

    return (
        <div className="w-full h-full py-6 px-4">
            {onboarding && !formData.username ? (
                <div className="mb-6 py-4  rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800">🎉 Welcome!</h3>
                    <p className="text-sm text-red-700 mt-2 flex items-center gap-1">
                        <AlertCircleIcon size={14} /> To get started, please update your username
                    </p>
                </div>
            ) : <h1 className="text-sm font-semibold mb-10">Profile Settings</h1>}
            <form onSubmit={handleSubmit} className='flex flex-col h-full w-full r'>
                <div className="grid grid-cols-1 gap-y-6 ">
                    {fields.map((field) => (
                        <div key={field} className='flex gap-y-6 w-full items-center'>
                            <label htmlFor={field} className={`block text-sm font-medium  w-1/3 text-gray-700`}>
                                {field}
                                {(field === 'Display Name' || field === 'Username') && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </label>
                            <div className="w-2/3">
                                {inputFields.includes(field) && !textAreaFields.includes(field) && (
                                    <div className='relative'>
                                        <input
                                            type="text"
                                            placeholder={field}
                                            autoFocus
                                            autoComplete="off"
                                            name={field}
                                            id={field}
                                            value={getFormValue(field)}
                                            onChange={(e) => {
                                                handleInputChange(field, e.target.value);
                                                if (errors[field.toLowerCase()]) {
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        [field.toLowerCase()]: ''
                                                    }));
                                                }
                                            }}
                                            className={`w-full px-3 py-2 border rounded-md ${errors[field.toLowerCase()] ? 'border-red-500' : ''
                                                }`}
                                        />
                                        {errors[field.toLowerCase()] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors[field.toLowerCase()]}
                                            </p>
                                        )}
                                        {field === 'Username' && (
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                {formData.username !== initialData.formData.username && formData.username && (
                                                    isFetching ? (
                                                        <Loader />
                                                    ) : isUsernameAvailable ? (
                                                        <span className="text-green-500">Available</span>
                                                    ) : (
                                                        <span className="text-red-500">Not available</span>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {imageField.includes(field) ? (
                                    <div className="mt-1 flex items-center">
                                        <div className="relative flex-shrink-0 h-12 w-12 group">
                                            <img
                                                className="h-12 w-12 rounded-full object-cover"
                                                src={imagePreview ?? session?.user.image ?? '/logo2.png'}
                                                alt=""
                                            />
                                            {uploadingImage && (
                                                <div className="absolute inset-0 bg-black bg-opacity-25 rounded-full flex items-center justify-center">
                                                    <Loader />
                                                </div>
                                            )}
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
                                    <div className='w-full'>
                                        <textarea
                                            id={field}
                                            name={field}
                                            placeholder={field}
                                            rows={3}
                                            maxLength={200}
                                            value={getFormValue(field)}
                                            onChange={(e) => handleInputChange(field, e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md resize-none"
                                        />
                                        <div className="text-xs text-right w-full text-gray-500">Max 200 characters</div>
                                    </div>
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
                                onChange={(e) => {
                                    setLinkChanged(true);

                                    updateLink(index, 'label', e.target.value)
                                }}
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
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md border border-red-200"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end items-center gap-4 pb-20">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full w-full">
            <Loader />
        </div>}>
            <ProfileContent />
        </Suspense>
    );
}
