/* eslint-disable @next/next/no-img-element */
'use client';
import Loader from '@/components/loader';
import Toggle from '@/components/toogle';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/trpc/react';

function ProfileContent() {
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
            // Cancel outgoing fetches
            await utils.asset.getProfile.cancel();
            // Save old data
            const previousData = utils.asset.getProfile.getData();
            // Optimistically update the cache
            utils.asset.getProfile.setData(undefined, old => {
                if (!old?.user) return old;
                // Ensure all links have an id
                const links = (newData.links || old.links).map(link => ({
                    id: link.id || crypto.randomUUID(),
                    label: link.label,
                    url: link.url
                }));
                return {
                    user: {
                        ...old.user,
                        ...newData,
                        id: old.user.id // Preserve the required id field
                    },
                    links
                };
            });
            return { previousData };
        },
        onSettled: () => {
            // Sync with server
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

        // Compare full link objects including id
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
            // Only handle image if one is selected
            const imageUrl = selectedImage ? await uploadImage(selectedImage) : undefined;

            // Only include changed fields in the update
            const updateData = {
                ...(formData.name !== initialData.formData.name && { name: formData.name }),
                ...(formData.username !== initialData.formData.username && { username: formData.username }),
                ...(formData.bio !== initialData.formData.bio && { bio: formData.bio }),
                ...(formData.location !== initialData.formData.location && { location: formData.location }),
                ...(formData.linkedin !== initialData.formData.linkedin && { linkedin: formData.linkedin }),
                ...(formData.github !== initialData.formData.github && { github: formData.github }),
                ...(imageUrl && { image: imageUrl }), // Only include image if new one is uploaded
                links: links.filter(link => link.label.trim() !== '' && link.url.trim() !== '')
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
            toast.error('Failed to upload image');
            console.error(error);
            setIsSaving(false);
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
        // Remove any existing empty links before adding a new one
        removeEmptyLinks();
        // Only add new link if there are no empty links
        setLinks([...links, { label: '', url: '' }])
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full w-full">
            Loading...
        </div>;
    }

    return (
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
    );
}

function AccountContent() {
    return (
        <div className="grid grid-cols-1 gap-y-6 max-w-3xl">
            <div className="border rounded-lg p-6 border-gray-300 bg-white shadow-sm">
                <h3 className="text-lg font-medium">Subscription</h3>
                <p className="text-gray-500 mt-1">Currently on Free Plan</p>
                <button className="mt-4 px-4 py-2 border rounded-md text-blue-600 hover:bg-blue-100 border-blue-600">
                    Upgrade to Pro
                </button>
            </div>

            <div className="border rounded-lg p-6 border-gray-300 bg-white shadow-sm">
                <h3 className="text-lg font-medium">Email Address</h3>
                <p className="text-gray-500 mt-1">Change your email or request a password reset</p>
                <div className="mt-4 space-y-4 max-w-sm">
                    <input
                        type="email"
                        placeholder="New email address"
                        className="w-full px-4 py-2 border rounded-md"
                    />
                    <button className="mt-4 px-4 py-2 border rounded-md text-blue-600 hover:bg-blue-100 border-blue-600">
                        Update Email
                    </button>
                    <button className="block text-blue-600 hover:underline">
                        Send password reset email
                    </button>
                </div>
            </div>

            <div className="border rounded-lg p-6 border-gray-300 bg-white shadow-sm">
                <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                <p className="text-gray-500 mt-1">Permanently delete your account and all data</p>
                <button className="mt-4 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50">
                    Delete Account
                </button>
            </div>
        </div>
    );
}

function NotificationsContent() {
    return (
        <div className="grid grid-cols-1 gap-y-6 w-full">
            <div className="flex items-start">
                <div className="w-3/4">
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive marketing updates and newsletters</p>
                </div>
                <div className="flex items-center">
                    <Toggle initialValue={true} onToggle={
                        (value) => {
                            console.log(value);
                        }
                    } />
                </div>
            </div>
            <div className="flex items-start">
                <div className="w-3/4">
                    <h3 className="text-sm font-medium text-gray-900">Mobile Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified about page views, reactions, and other in-app activities</p>
                </div>
                <div className="flex items-center">
                    <Toggle initialValue={true} onToggle={
                        (value) => {
                            console.log(value);
                        }
                    } />
                </div>
            </div>
        </div>
    );
}

function BillingContent() {
    const mockInvoices = [
        { id: 1, date: '2024-01-01', amount: '$50.00', period: 'Jan 2024', href: 'https://mail.yahoo.com/d/folders/1?.intl=au&.lang=en-AU' },
        { id: 2, date: '2023-12-01', amount: '$50.00', period: 'Dec 2023', href: '#' },
        { id: 3, date: '2025-02-01', amount: '$50.00', period: 'Feb 2025', href: '#' },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const filteredInvoices = mockInvoices.filter(invoice => {
        const matchesSearch = invoice.period.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMonth = !selectedMonth || invoice.date.startsWith(selectedMonth);
        return matchesSearch && matchesMonth;
    });

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search invoices..."
                    className="px-4 py-2 border rounded-md w-full border-gray-400/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <input
                    type="month"
                    className="px-4 py-2 border rounded-md w-44"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                />
            </div>

            {filteredInvoices.length > 0 ? (
                <div className="border rounded-lg divide-y border-gray-300 divide-gray-300 ">
                    {filteredInvoices
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((invoice) => (
                            <a href={invoice.href} key={invoice.id} target="_blank" className="p-4 flex items-center justify-between hover:bg-blue-200/70 cursor-pointer group">
                                <div>
                                    <p className="font-medium">Invoice for {invoice.period}</p>
                                    <p className="text-sm text-gray-500">{invoice.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>{invoice.amount}</span>
                                    <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity ml-10">
                                        Click to download →
                                    </span>
                                </div>
                            </a>
                        ))}
                </div>
            ) : (
                <div className='border rounded-lg p-24 flex items-center justify-center border-gray-300'>
                    No invoices found
                </div>
            )}
        </div>
    );
}

export default function SettingsPage() {
    const [currentTab, setCurrentTab] = useState('Profile');

    useEffect(() => {
        const savedTab = localStorage.getItem('settingsTab');
        if (savedTab) {
            setCurrentTab(savedTab);
        }
    }, []);

    const handleTabChange = (tabName: string) => {
        setCurrentTab(tabName);
        localStorage.setItem('settingsTab', tabName);
    };

    const TABS = [
        {
            id: 1,
            name: "Profile",
            current: currentTab === "Profile",
        },
        {
            id: 2,
            name: "Account",
            current: currentTab === "Account",
        },
        {
            id: 3,
            name: "Notifications",
            current: currentTab === "Notifications",
        },
        {
            id: 4,
            name: "Billing",
            current: currentTab === "Billing",
        },
    ];

    const renderTabContent = () => {
        switch (currentTab) {
            case 'Profile':
                return <ProfileContent />;
            case 'Account':
                return <AccountContent />;
            case 'Notifications':
                return <NotificationsContent />;
            case 'Billing':
                return <BillingContent />;
            default:
                return <ProfileContent />;
        }
    };

    return (
        <main className="w-full h-full py-4">
            <div className="border-b border-gray-300 sticky top-0 z-10">
                <nav className="flex space-x-8 backdrop-blur-sm " aria-label="Tabs">
                    {TABS.map((tab) => (
                        <a
                            key={tab.name}
                            onClick={() => handleTabChange(tab.name)}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm cursor-pointer transition-all duration-300 ease-in-out ${tab.current
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            aria-current={tab.current ? "page" : undefined}
                        >
                            {tab.name}
                        </a>
                    ))}
                </nav>
            </div>
            <div className="pt-6 px-1 pb-14 h-full overflow-y-auto">
                {renderTabContent()}
                <div className="h-20">
                </div>
            </div>
        </main>
    );
}


