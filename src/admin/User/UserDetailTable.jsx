import React, { useState } from 'react';
import Header from '../Components/Header';
import FilterBar from '../Components/FilterBar';

/**
 * UserDetailTable Component
 * Displays client registrations list inside the admin panel.
 * Designed with search filters, modern responsive cards, and tables.
 */
function UserDetailTable({ mode, user = [], formatDate }) {
    const [search, setSearch] = useState('');

    // Filter logic
    const filteredUsers = user.filter(u => {
        const searchLower = search.toLowerCase();
        return !search ||
            u.name?.toLowerCase().includes(searchLower) ||
            u.email?.toLowerCase().includes(searchLower) ||
            u.uid?.toLowerCase().includes(searchLower);
    });

    return (
        <div className="space-y-6">
            <Header title="User Details" description="Monitor active accounts, user registrations, and creation timestamps." />

            {/* Reusable Filter Bar */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search users by name, email, or UID..."
            />

            {/* Mobile Cards (Visible only on mobile) */}
            <div className="block md:hidden space-y-4">
                {filteredUsers.map((item, index) => {
                    const { name, uid, email, time } = item;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-muted font-bold">User #{index + 1}</span>
                                <span className="text-text-muted font-semibold">{formatDate(time)}</span>
                            </div>
                            
                            <div className="space-y-1.5">
                                <h3 className="font-bold text-base text-text-base">{name}</h3>
                                <p className="text-sm text-text-muted">{email}</p>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 text-xs text-text-muted pl-1">
                                <span className="font-bold text-text-base uppercase tracking-wider text-[10px]">User UID:</span>
                                <span className="bg-gray-50 px-3 py-1.5 rounded-xl border border-border-base font-mono select-all w-fit break-all text-xs font-semibold">
                                    {uid}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {filteredUsers.length === 0 && (
                    <div className="bg-white p-8 text-center text-text-muted rounded-2xl border border-border-base shadow-xs">
                        No registered users found.
                    </div>
                )}
            </div>

            {/* Desktop Table (Hidden on mobile) */}
            <div className="hidden md:block bg-white rounded-2xl border border-border-base shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-base bg-gray-50/50 text-text-muted text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4 w-16 text-center hidden lg:table-cell">S.No</th>
                                <th className="px-6 py-4">Account Name</th>
                                <th className="px-6 py-4">Email Address</th>
                                <th className="px-6 py-4 w-72">User UID</th>
                                <th className="px-6 py-4 w-52 hidden xl:table-cell">Registration Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base text-sm text-text-base">
                            {filteredUsers.map((item, index) => {
                                const { name, uid, email, time } = item;
                                return (
                                    <tr key={index} className="hover:bg-gray-50/20 transition-colors">
                                        <td className="px-6 py-4 text-text-muted text-center hidden lg:table-cell">{index + 1}</td>
                                        <td className="px-6 py-4 font-bold">{name}</td>
                                        <td className="px-6 py-4">
                                            <div>{email}</div>
                                            <div className="text-xs text-text-muted mt-1 xl:hidden">Registered: {formatDate(time)}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-text-muted select-all">
                                            <span className="bg-gray-50 px-2.5 py-1 rounded-xl border border-border-base text-xs font-semibold">
                                                {uid}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-muted hidden xl:table-cell">{formatDate(time)}</td>
                                    </tr>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-text-muted">
                                        No registered users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserDetailTable;
