/* eslint-disable @next/next/no-img-element */
'use client';
import Button from "@/components/button";
import { useState } from "react";
import { api } from "@/trpc/react";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import { Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";


export default function BuildPage() {
    return (
        <div className="space-y-6 h-full">
            <UserAssets />
        </div>
    );
}

const ADD_OPTIONS = [
    { label: 'Project', value: 'project' },
    { label: 'Lab', value: 'lab' },
    { label: 'Assignment/Coursework', value: 'assignment' },
    { label: 'Article/Blog', value: 'article' },
    { label: 'Certification', value: 'certification' }
];

function UserAssets() {
    const router = useRouter();
    const ctx = api.useUtils();
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);
    const [showArchived, setShowArchived] = useState(false);

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
        (showArchived ? asset.status === 'ARCHIVED' : asset.status !== 'ARCHIVED') &&
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

    return (
        <div className="h-full ">
            <div className="flex gap-4 items-center w-full mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assets"
                    className="flex-1 p-2 border border-gray-200 rounded-lg outline-none"
                />
                <div className="relative">
                    <Button className={`bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-4 py-2 ${isAddPending ? 'opacity-50' : ''}`}
                        disabled={isAddPending}
                        onClick={() => {
                            setShowAddOptions(!showAddOptions)
                            setSelectedOption('')
                        }}>
                        {isAddPending ? "Adding..." : "Add asset"}
                    </Button>
                    {showAddOptions && (
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                            {ADD_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    className={`w-full text-left px-4 py-2  rounded-lg ${selectedOption === option.value ? 'bg-blue-100 hover:bg-blue-200/50' : 'hover:bg-gray-100'}`}
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
                <Button
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowArchived(!showArchived)}
                >
                    {showArchived ? "Show Active" : "Show Archived"}
                </Button>
            </div>
            {isLoading && <Loader />}
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
                                        className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex gap-4 items-center cursor-pointer"
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
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${asset.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                                    asset.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-500">{asset.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {asset.status === 'DRAFT' && (
                                                <Button
                                                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 text-sm rounded-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateAssetStatus({ id: asset.id, status: 'PUBLISHED' });
                                                    }}
                                                >
                                                    Publish
                                                </Button>
                                            )}
                                            {asset.status === 'ARCHIVED' &&
                                                (
                                                    <Button
                                                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded-md"
                                                        onClick={(e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<Element>) => {
                                                            if ('stopPropagation' in e) e.stopPropagation();
                                                            updateAssetStatus({ id: asset.id, status: 'DRAFT' });
                                                        }}
                                                    >
                                                        Unarchive
                                                    </Button>
                                                )}
                                            {asset.status === 'PUBLISHED' && (
                                                <Button
                                                    className="text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 text-sm rounded-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateAssetStatus({ id: asset.id, status: 'ARCHIVED' });
                                                    }}
                                                >
                                                    Archive
                                                </Button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteAssetId(asset.id);
                                                }}
                                                className="text-red-500 p-2 bg-red-100 rounded-md hover:bg-red-200 h-full"
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
                        <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center flex-col">
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
                        <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center flex-col">
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
                <div className="h-96">
                    <div className="bg-gray-100 rounded-lg flex items-center justify-center flex-col h-full">
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
                        confirmText={isDeletePending ? "Deleting..." : "Delete"}
                        confirmButtonClass="bg-red-500 text-white hover:bg-red-600"
                    />
                )
            }
        </div >
    );
}