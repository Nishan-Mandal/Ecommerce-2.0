import React, { useState, useEffect } from 'react';
import UserDetailTable from './UserDetailTable';
import { userService } from '../../services/user/userService';
import { useTheme } from '../../context/ThemeContext';

export default function AdminUsersPage() {
    const { mode } = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers();
            setUsers(data || []);
        } catch (err) {
            console.error("Error loading users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        if (typeof dateValue.toDate === 'function') {
            return dateValue.toDate().toLocaleString();
        }
        return String(dateValue);
    };

    return (
        <div className='px-4 md:px-0 space-y-5'>
            <UserDetailTable
                mode={mode}
                user={users}
                loading={loading}
                onRefresh={fetchUsers}
                formatDate={formatDate}
            />

        </div>
    )
}
