/* eslint-disable @next/next/no-img-element */
'use client';
import Button from "@/components/button";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import { Loader2Icon, LoaderPinwheel, Trash2Icon, CheckCircle2Icon, EditIcon, ArchiveIcon } from "lucide-react";
import toast from "react-hot-toast";
import Toggle from "@/components/toogle";
import Breadcrumb from '@/components/breadcrumb';

const STATUS_COLORS = {
    PUBLISHED: {
        bg: 'bg-emerald-100',
        border: 'border-emerald-500',
        hover: 'hover:scale-[1.01] hover:border-emerald-600',
        text: 'text-emerald-700',
        label: 'Published',
        icon: <CheckCircle2Icon size={14} className="text-emerald-600" />
    },
    DRAFT: {
        bg: 'bg-red-100',
        border: 'border-red-500',
        hover: 'hover:scale-[1.01] hover:border-red-600',
        text: 'text-red-700',
        label: 'Draft',
        icon: <EditIcon size={14} className="text-red-600" />
    },
    ARCHIVED: {
        bg: 'bg-neutral-200',
        border: 'border-neutral-500 hover:border-neutral-600',
        hover: 'hover:scale-[1.01]',
        text: 'text-neutral-700',
        label: 'Archived',
        icon: <ArchiveIcon size={14} className="text-neutral-600" />
    }
} as const;

function StatusLegend() {
    return (
        <div className="flex gap-4 items-center text-sm justify-end w-full">
            {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                <div key={status} className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 rounded-md`}>
                        {colors.icon}
                        <span className={colors.text}>{colors.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function BuildPage() {
    return (
        <div className="space-y-6 h-full">
            <UserAssets />
        </div>
    );
}

const ADD_OPTIONS = [
    { label: 'Project', value: 'Project' },
    { label: 'Lab', value: 'Lab' },
    { label: 'Assignment/Coursework', value: 'Assignment' },
    { label: 'Article/Blog', value: 'Article' },
    { label: 'Certification', value: 'Certification' }
];

function UserAssets() {
    const router = useRouter();
    const ctx = api.useUtils();
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);
    const [showArchived, setShowArchived] = useState(false);

    // Load showArchived state from localStorage on mount
    useEffect(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('showArchived') : null;
        if (saved !== null) {
            setShowArchived(JSON.parse(saved));
        }
    }, []);

    // Persist showArchived state
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('showArchived', JSON.stringify(showArchived));
        }
    }, [showArchived]);

    const { data: assets, isLoading } = api.asset.getAssets.useQuery();
    const { mutate: addAsset, isPending: isAddPending } = api.asset.addAsset.useMutation({
        onMutate: () => {
            toast.loading('Adding asset...');
        },
        onSuccess: (data) => {
            toast.dismiss();
            toast.success('Asset added successfully');
            void ctx.asset.getAssets.invalidate();
            router.push(`/asset/${data.id}`);
        },
    });

    const { mutate: deleteAsset, isPending: isDeletePending } = api.asset.deleteAsset.useMutation({
        onMutate: () => {
            toast.loading('Deleting asset...');
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success('Asset deleted successfully');
            void ctx.asset.getAssets.invalidate();
            setDeleteAssetId(null);
        },
    });

    const { mutate: updateAssetStatus } = api.asset.updateAsset.useMutation({
        onMutate: () => {
            toast.loading('Updating asset status...');
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success('Asset status updated successfully');
            void ctx.asset.getAssets.invalidate();
        },
    });

    const filteredAssets = assets?.filter(asset =>
        (!showArchived && asset.status === 'ARCHIVED' ? false : true) &&
        (asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset?.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const groupedAssets = filteredAssets?.reduce((acc, asset) => {
        const type = asset.type.charAt(0).toUpperCase() + asset.type.slice(1);
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(asset);
        return acc;
    }, {} as Record<string, typeof filteredAssets>);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center w-full gap-x-2 flex-col">
                <span>Loading assets...</span>
            </div>
        );
    }

    return (
        <div className="h-full w-full pb-4 pt-6">
            <div className="flex gap-4 justify-between items-center mb-4">
                <div className="flex items-center gap-4 w-full">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search assets"
                        className="w-full"
                    />
                </div>

                <div className="relative">
                    <div className="flex items-center gap-4 text-nowrap">
                        Show archived
                        <Toggle onToggle={() => setShowArchived(!showArchived)} initialValue={showArchived} />

                        <Button className={`bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-4 py-2 ${isAddPending ? 'opacity-50' : ''}`}
                            disabled={isAddPending}
                            onClick={() => {
                                setShowAddOptions(!showAddOptions)
                                setSelectedOption('')
                            }}>
                            {isAddPending ? "Adding..." : "Add asset"}
                        </Button>
                    </div>
                    {showAddOptions && (
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                            {ADD_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === option.value ? 'bg-blue-100 hover:bg-blue-200/50' : 'hover:bg-gray-100'}`}
                                    onClick={() => {
                                        setSelectedOption(option.value);
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                            <Button
                                className="w-full mt-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-center disabled:opacity-50"
                                disabled={!selectedOption}
                                onClick={() => {
                                    addAsset({
                                        type: selectedOption,
                                        title: 'New Asset',
                                        description: 'Description',
                                    });
                                    setShowAddOptions(false);
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 mb-4">
                <StatusLegend />
            </div>
            {assets ? (
                <div className="pb-4 space-y-6">
                    {groupedAssets && Object.entries(groupedAssets).map(([type, assets]) => (
                        <div key={type} className="space-y-2">
                            <h3 className="font-bold text-gray-700">{type}s</h3>
                            <div className="flex flex-col gap-2">
                                {assets.map((asset) => (
                                    <div
                                        key={asset.id}
                                        onClick={() => router.push(`/asset/${asset.id}`)}
                                        className={`rounded-lg transition duration-300 shadow-sm p-4 border ${STATUS_COLORS[asset.status].bg} ${STATUS_COLORS[asset.status].border} ${STATUS_COLORS[asset.status].hover} flex gap-4 items-center cursor-pointer`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={asset.icon ?? '/placeholder.webp'}
                                                alt={asset.title}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 " >
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{asset.title}</h3>
                                                {/* <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1.5 ${asset.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                        asset.status === 'DRAFT' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                            'bg-neutral-100 text-neutral-700 border border-neutral-200'
                                                    }`}>
                                                    {STATUS_COLORS[asset.status].icon}
                                                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                                                </span> */}
                                            </div>
                                            <p className="text-gray-500">{asset.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {asset.status === 'DRAFT' && (
                                                <Button
                                                    className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-sm rounded-md flex items-center gap-1.5"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateAssetStatus({ id: asset.id, status: 'PUBLISHED' });
                                                    }}
                                                >
                                                    <CheckCircle2Icon size={16} />
                                                    Publish
                                                </Button>
                                            )}
                                            {asset.status === 'ARCHIVED' &&
                                                (
                                                    <Button
                                                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded-md flex items-center gap-1.5"
                                                        onClick={(e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<Element>) => {
                                                            if ('stopPropagation' in e) e.stopPropagation();
                                                            updateAssetStatus({ id: asset.id, status: 'DRAFT' });
                                                        }}
                                                    >
                                                        <EditIcon size={16} />
                                                        Unarchive
                                                    </Button>
                                                )}
                                            {asset.status === 'PUBLISHED' && (
                                                <Button
                                                    className="text-white bg-neutral-600 hover:bg-neutral-700 px-3 py-1 text-sm rounded-md flex items-center gap-1.5"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateAssetStatus({ id: asset.id, status: 'ARCHIVED' });
                                                    }}
                                                >
                                                    <ArchiveIcon size={16} />
                                                    Archive
                                                </Button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteAssetId(asset.id);
                                                }}
                                                className="text-red-500 p-2 border border-red-500 bg-red-100 rounded-md hover:bg-red-200 h-full"
                                            >
                                                <Trash2Icon className="h-full" size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {assets.length > 0 && filteredAssets?.length === 0 && (
                        <div className="w-full flex items-center justify-center flex-col h-96">
                            <p className="text-2xl">😓</p>
                            {searchQuery ? (
                                <p className="text-center text-gray-500">
                                    No assets found matching your search query.
                                </p>
                            ) : (
                                <p className="text-center text-gray-500">
                                    No {showArchived ? 'archived' : 'active'} assets found.
                                </p>
                            )}
                        </div>
                    )}
                    {assets.length === 0 && (
                        <div className="h-96 flex items-center justify-center flex-col">
                            <p className="text-2xl">😓</p>
                            <p className="text-center">
                                You have not added any assets.
                            </p>
                            <p className="text-center text-gray-500">
                                Click on the &quot;Add&quot; button to create a new asset.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="">
                    <div className="flex items-center justify-center flex-col h-96">
                        <p className="text-2xl ">
                            😓
                        </p>
                        <p className="text-center">
                            You have not added any assets.
                        </p>
                        <p className="text-center text-gray-500">
                            Click on the &quot;Add&quot; button to create a new asset.
                        </p>

                    </div>
                </div>
            )
            }
            {
                deleteAssetId && (
                    <Modal
                        isOpen={!!deleteAssetId}
                        onClose={() => setDeleteAssetId(null)}
                        title="Delete Asset"
                        description="Are you sure you want to delete this asset? This action cannot be undone."
                        onConfirm={() => {
                            if (deleteAssetId) {
                                deleteAsset({ id: deleteAssetId });
                            }
                        }}
                        confirmText={isDeletePending ? "Deleting..." : "Delete"
                        }
                        confirmButtonClass="bg-red-500 text-white hover:bg-red-600"
                    />
                )
            }
        </div >
    );
}