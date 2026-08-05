import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import FilterBar from '../Components/FilterBar';
import TableSkeleton from '../../components/loader/SkeletonLoader/TableSkeleton';
import Pagination from '../../components/common/Pagination';
import WarningModal from '../../components/modal/WarningModal';
import { 
  FaUserPlus, FaShieldAlt, FaUser, FaTimes, FaSpinner, 
  FaEye, FaEyeSlash, FaTrash 
} from 'react-icons/fa';
import { userService } from '../../services/user/userService';
import { activityService } from '../../services/activity/activityService';
import { toast } from 'react-toastify';

/**
 * UserDetailTable Component
 * Displays client and administrator accounts inside the admin panel.
 * Includes password-enabled admin creation, static role badges, account deletion, search, skeleton loading, and pagination.
 */
function UserDetailTable({ mode, user = [], loading = false, onRefresh, formatDate }) {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Delete modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [adminForm, setAdminForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'ADMIN',
    });

    // Filter logic
    const filteredUsers = user.filter(u => {
        const searchLower = search.toLowerCase();
        const matchesSearch = !search ||
            u.name?.toLowerCase().includes(searchLower) ||
            u.email?.toLowerCase().includes(searchLower) ||
            u.uid?.toLowerCase().includes(searchLower);

        const matchesRole = roleFilter === 'ALL' || (u.role || 'USER').toUpperCase() === roleFilter;

        return matchesSearch && matchesRole;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredUsers.length]);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        if (!adminForm.name.trim() || !adminForm.email.trim() || !adminForm.password.trim()) {
            toast.error("Name, Email, and Password are required to create an Admin account");
            return;
        }

        if (adminForm.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setSubmitting(true);
        try {
            await userService.createUser({
                name: adminForm.name.trim(),
                email: adminForm.email.trim().toLowerCase(),
                password: adminForm.password.trim(),
                phone: adminForm.phone.trim(),
                role: adminForm.role,
            });

            // Log activity audit entry
            await activityService.logActivity({
                type: adminForm.role === 'ADMIN' ? 'ADMIN_ADDED' : 'USER_ROLE_UPDATED',
                title: `New ${adminForm.role} Created: ${adminForm.name.trim()}`,
                description: `Created ${adminForm.role} profile for ${adminForm.email.trim()}`,
                userEmail: JSON.parse(localStorage.getItem('user') || '{}')?.user?.email || 'Admin',
            }).catch(() => {});

            toast.success(`New ${adminForm.role} "${adminForm.name}" created successfully! They can now log in at /login with their email & password.`);
            setIsAddModalOpen(false);
            setAdminForm({ name: '', email: '', password: '', phone: '', role: 'ADMIN' });
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error("Error creating admin:", err);
            toast.error(err.message || "Failed to create account profile");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (u) => {
        setSelectedUserToDelete(u);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUserToDelete) return;
        const targetUid = selectedUserToDelete.uid || selectedUserToDelete.docId || selectedUserToDelete.id;
        if (!targetUid) return;

        setDeleting(true);
        try {
            await userService.deleteUser(targetUid);

            // Log activity audit entry
            await activityService.logActivity({
                type: 'ACCOUNT_DELETED',
                title: `Account Removed: ${selectedUserToDelete.name || selectedUserToDelete.email}`,
                description: `Deleted ${selectedUserToDelete.role || 'USER'} profile (${targetUid})`,
                userEmail: JSON.parse(localStorage.getItem('user') || '{}')?.user?.email || 'Admin',
            }).catch(() => {});

            toast.success(`Account "${selectedUserToDelete.name || selectedUserToDelete.email}" removed successfully.`);
            setIsDeleteModalOpen(false);
            setSelectedUserToDelete(null);
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error("Failed to delete user account");
        } finally {
            setDeleting(false);
        }
    };

    const filterConfig = [
        {
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
                { value: "ALL", label: "All Roles" },
                { value: "ADMIN", label: "Admins Only" },
                { value: "USER", label: "Customers Only" },
            ],
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <Header 
                    title="User & Admin Details" 
                    description="Monitor registered customer accounts, manage system permissions, and add new administrator profiles." 
                    icon={<FaUserPlus size={14} />}
                    buttonText="Add New Admin"
                    clickhandler={() => setIsAddModalOpen(true)}
                />
                <TableSkeleton rows={pageSize} columns={6} />
            </div>
        );
    }

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

    return (
        <div className="space-y-6">
            <Header 
                title="User & Admin Details" 
                description="Monitor registered customer accounts, manage system permissions, and add new administrator profiles with credentials." 
                icon={<FaUserPlus size={14} />}
                buttonText="Add New Admin"
                clickhandler={() => setIsAddModalOpen(true)}
            />

            {/* Reusable Filter Bar */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search users by name, email, or UID..."
                filters={filterConfig}
            />

            {/* Mobile Cards (Visible only on mobile) */}
            <div className="block md:hidden space-y-4">
                {paginatedUsers.map((item, index) => {
                    const { name, uid, email, time, role } = item;
                    const isRoleAdmin = (role || 'USER').toUpperCase() === 'ADMIN';

                    return (
                        <div key={index} className="bg-white dark:bg-bg-surface p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-muted font-bold">User #{startIndex + index + 1}</span>
                                
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1.5 whitespace-nowrap ${
                                            isRoleAdmin
                                                ? "bg-purple-100 text-purple-800 border-purple-300 "
                                                : "bg-blue-50 text-blue-700 border-blue-200 "
                                        }`}
                                    >
                                        {isRoleAdmin ? <FaShieldAlt size={10} /> : <FaUser size={10} />}
                                        <span>{isRoleAdmin ? "ADMIN" : "USER"}</span>
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick(item)}
                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                        title={isRoleAdmin ? "Remove Admin Profile" : "Delete User"}
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <h3 className="font-bold text-base text-text-base">{name || "Customer Account"}</h3>
                                <p className="text-sm text-text-muted">{email}</p>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 text-xs text-text-muted pl-1">
                                <span className="font-bold text-text-base uppercase tracking-wider text-[10px]">User UID:</span>
                                <span className="bg-gray-50 dark:bg-bg-base px-3 py-1.5 rounded-xl border border-border-base font-mono select-all w-fit break-all text-xs font-semibold">
                                    {uid || "N/A"}
                                </span>
                            </div>

                            <div className="text-[11px] text-text-muted border-t border-border-base pt-2 flex justify-between items-center">
                                <span>Registered: <strong className="font-semibold text-text-base">{formatDate(time)}</strong></span>
                            </div>
                        </div>
                    );
                })}
                {filteredUsers.length === 0 && (
                    <div className="bg-white dark:bg-bg-surface p-8 text-center text-text-muted rounded-2xl border border-border-base shadow-xs">
                        No registered users found.
                    </div>
                )}
            </div>

            {/* Desktop Table (Hidden on mobile) */}
            <div className="hidden md:block bg-white dark:bg-bg-surface rounded-2xl border border-border-base shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-base bg-gray-50/50 dark:bg-bg-base/50 text-text-muted text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4 w-16 text-center hidden lg:table-cell">S.No</th>
                                <th className="px-6 py-4">Account Name</th>
                                <th className="px-6 py-4">Email Address</th>
                                <th className="px-6 py-4 w-32 text-center">Role</th>
                                <th className="px-6 py-4 w-60">User UID</th>
                                <th className="px-6 py-4 w-44 hidden xl:table-cell">Registration Date</th>
                                <th className="px-6 py-4 w-24 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base text-sm text-text-base">
                            {paginatedUsers.map((item, index) => {
                                const { name, uid, email, time, role } = item;
                                const isRoleAdmin = (role || 'USER').toUpperCase() === 'ADMIN';

                                return (
                                    <tr key={index} className="hover:bg-gray-50/20 dark:hover:bg-bg-base/20 transition-colors">
                                        <td className="px-6 py-4 text-text-muted text-center hidden lg:table-cell">{startIndex + index + 1}</td>
                                        <td className="px-6 py-4 font-bold">{name || "Customer"}</td>
                                        <td className="px-6 py-4">
                                            <div>{email}</div>
                                            <div className="text-xs text-text-muted mt-1 xl:hidden">Registered: {formatDate(time)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-black border inline-flex items-center gap-1.5 whitespace-nowrap ${
                                                    isRoleAdmin
                                                        ? "bg-purple-100 text-purple-800 border-purple-300 "
                                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                                }`}
                                            >
                                                {isRoleAdmin ? <FaShieldAlt size={10} /> : <FaUser size={10} />}
                                                <span>{isRoleAdmin ? "ADMIN" : "USER"}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-text-muted select-all">
                                            <span className="bg-gray-50 dark:bg-bg-base px-2.5 py-1 rounded-xl border border-border-base text-xs font-semibold">
                                                {uid || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-muted hidden xl:table-cell">{formatDate(time)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(item)}
                                                className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all cursor-pointer"
                                                title={isRoleAdmin ? "Remove Admin Profile" : "Delete Account"}
                                            >
                                                <FaTrash size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-text-muted">
                                        No registered users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Universal Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={filteredUsers.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                }}
            />

            {/* Add New Admin Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-bg-surface w-full max-w-md rounded-2xl border border-border-base shadow-xl p-6 space-y-5 relative animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-border-base/60 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                                    <FaShieldAlt size={16} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-base text-text-base">Add Administrator</h3>
                                    <p className="text-[11px] text-text-muted">Create a new admin with Firebase Auth credentials</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 rounded-xl text-text-muted hover:bg-bg-base transition cursor-pointer"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
                            <div className="space-y-1">
                                <label className="font-bold text-text-base">Full Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Admin User"
                                    value={adminForm.name}
                                    onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-base bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-text-base">Email Address <span className="text-rose-500">*</span></label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. admin@needmate.com"
                                    value={adminForm.email}
                                    onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-base bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-text-base">Login Password <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        placeholder="Enter secure password (min 6 characters)"
                                        value={adminForm.password}
                                        onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-border-base bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-base transition cursor-pointer"
                                    >
                                        {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-text-muted mt-0.5">
                                    🔑 Credentials to log in at <code className="bg-bg-base px-1 py-0.5 rounded font-mono">/login</code>
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-text-base">Phone Number (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. +91 9876543210"
                                    value={adminForm.phone}
                                    onChange={(e) => setAdminForm(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-base bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-text-base">Role Access Permission</label>
                                <select
                                    value={adminForm.role}
                                    onChange={(e) => setAdminForm(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-base bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-extrabold cursor-pointer"
                                >
                                    <option value="ADMIN">ADMIN (Full Panel & Management Access)</option>
                                    <option value="USER">USER (Standard Customer Account)</option>
                                </select>
                            </div>

                            <div className="pt-3 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-border-base font-bold text-text-base hover:bg-bg-base transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-compli font-extrabold transition cursor-pointer shadow-xs flex items-center gap-2"
                                >
                                    {submitting && <FaSpinner size={12} className="animate-spin" />}
                                    <span>Create Admin Account</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Warning / Confirmation Delete Modal */}
            <WarningModal
                isOpen={isDeleteModalOpen}
                message={`Are you sure you want to remove account "${selectedUserToDelete?.name || selectedUserToDelete?.email}" (${(selectedUserToDelete?.role || 'USER').toUpperCase()})? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUserToDelete(null);
                }}
                confirmText={deleting ? "Deleting..." : "Delete Account"}
                mode={mode}
            />
        </div>
    );
}

export default UserDetailTable;
