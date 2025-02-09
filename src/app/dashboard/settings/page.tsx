/* eslint-disable @next/next/no-img-element */
'use client';
import Loader from '@/components/loader';
import Toggle from '@/components/toogle';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';



function ProfileContent() {
    const fields = ['Image', 'Display Name', 'Username', 'Bio', 'Skills', 'LinkedIn', 'GitHub', 'Twitter', 'Website', 'Public'];
    const inputFields = ['Display Name', 'Username', 'Bio', 'Skills', 'LinkedIn', 'GitHub', 'Twitter', 'Website'];
    const toggleFields = ['Public'];
    const imageField = ['Image'];
    const textAreaFields = ['Bio'];
    const { data } = useSession();

    return <div>
        <div className="grid grid-cols-1 gap-y-6 w-full max-w-5xl">
            {fields.map((field) => {
                return (
                    <div key={field} className='flex gap-y-6 w-full items-start'>
                        <label htmlFor={field} className="block text-sm font-medium text-gray-700 w-1/4 ">
                            {field}
                        </label>
                        <div className="w-2/4">
                            {inputFields.includes(field) && !textAreaFields.includes(field) ? (
                                <input
                                    type="text"
                                    placeholder={field}
                                    autoComplete="off"
                                    name={field}
                                    id={field}
                                />
                            ) : toggleFields.includes(field) ? (
                                <div className="mt-1 flex items-center">
                                    <Toggle initialValue={true} onToggle={
                                        (value) => {
                                            console.log(value);
                                        }
                                    } />
                                </div>
                            ) : imageField.includes(field) ? (
                                <div className="mt-1 flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12">
                                        <img className="h-12 w-12 rounded-full" src={data?.user.image ?? '/avatar.png'} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {data?.user.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <label htmlFor="image" className="cursor-pointer font-medium text-blue-600">Change</label>
                                            <input type="file" id="image" name="image" className="hidden" />
                                        </div>
                                    </div>
                                </div>
                            ) : textAreaFields.includes(field) ? (
                                <textarea
                                    id={field}
                                    autoComplete="off"
                                    name={field}
                                    placeholder={field}
                                    rows={3}
                                />
                            ) : null}
                        </div>
                    </div>
                );
            }
            )}
        </div>
    </div>;
}


function AccountContent() {
    return (
        <div className="grid grid-cols-1 gap-y-6 max-w-3xl">
            <div className="border rounded-lg p-6 border-gray-300 ">
                <h3 className="text-lg font-medium">Subscription</h3>
                <p className="text-gray-500 mt-1">Currently on Free Plan</p>
                <button className="mt-4 px-4 py-2 border rounded-md text-blue-600 hover:bg-blue-100 border-blue-600">
                    Upgrade to Pro
                </button>
            </div>

            <div className="border rounded-lg p-6 border-gray-300 ">
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

            <div className="border rounded-lg p-6 border-gray-300 ">
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
        <main className="w-full">
            {/* <h1 className="">Settings</h1> */}
            <div className="">
                <div className="border-b border-gray-300 sticky top-0 shadow-sm">
                    <nav className="flex space-x-8 bg-transparent backdrop-blur-sm" aria-label="Tabs">
                        {TABS.map((tab) => (
                            <a
                                key={tab.name}
                                onClick={() => handleTabChange(tab.name)}
                                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm cursor-pointer transition-all duration-300 ease-in-out ${tab.current
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
                <div className="pt-6 px-1 pb-14 max-h-[calc(100vh-5rem)] overflow-y-auto max-w-5xl">
                    {renderTabContent()}
                </div>
            </div>
        </main>
    );
}


