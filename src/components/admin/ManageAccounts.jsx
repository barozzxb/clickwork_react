import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EditIcon, EyeIcon, PlusIcon, SearchIcon, TrashIcon, UserPlusIcon } from 'lucide-react';
import '../styles/admin-dashboard.css';

export default function ManageAccounts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);

    const userAccounts = [
        { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'jobseeker', status: 'active', joinDate: 'Aug 12, 2023' },
        { id: 2, name: 'Sara Wilson', email: 'sara.wilson@example.com', role: 'employer', status: 'active', joinDate: 'Jul 28, 2023' },
        { id: 3, name: 'Mark Johnson', email: 'mark.johnson@example.com', role: 'employer', status: 'inactive', joinDate: 'Jun 15, 2023' },
        { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'jobseeker', status: 'active', joinDate: 'Aug 5, 2023' },
        { id: 5, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'admin', status: 'active', joinDate: 'May 10, 2023' },
        { id: 6, name: 'Jennifer Lee', email: 'jennifer.lee@example.com', role: 'jobseeker', status: 'pending', joinDate: 'Aug 18, 2023' },
    ];

    const filteredUsers = userAccounts.filter(user =>
        (searchTerm === '' || user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedRole === null || user.role === selectedRole)
    );

    return (
        <div className="grid">
            <div className="card">
                <div className="card-header">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="card-title">Manage User Accounts</h2>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View and manage all user accounts</p>
                        </div>
                        <button className="button sm:self-end"><UserPlusIcon className="h-4 w-4" /> Add New User</button>
                    </div>
                </div>
                <div className="card-content">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                            <SearchIcon className="h-4 w-4" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                            <input className="input" style={{ paddingLeft: '40px' }} placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="tabs-list">
                        <button className={`tab-trigger ${selectedRole === null ? 'tab-trigger-active' : ''}`} onClick={() => setSelectedRole(null)}>All Users</button>
                        <button className={`tab-trigger ${selectedRole === 'jobseeker' ? 'tab-trigger-active' : ''}`} onClick={() => setSelectedRole('jobseeker')}>Job Seekers</button>
                        <button className={`tab-trigger ${selectedRole === 'employer' ? 'tab-trigger-active' : ''}`} onClick={() => setSelectedRole('employer')}>Employers</button>
                        <button className={`tab-trigger ${selectedRole === 'admin' ? 'tab-trigger-active' : ''}`} onClick={() => setSelectedRole('admin')}>Admins</button>
                    </div>
                    <table className="table">
                        <thead className="table-header">
                            <tr className="table-row">
                                <th className="table-cell">User</th>
                                <th className="table-cell">Role</th>
                                <th className="table-cell">Status</th>
                                <th className="table-cell">Join Date</th>
                                <th className="table-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="table-row">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <img className="h-8 w-8 rounded-full" src={user.avatar || 'https://via.placeholder.com/40'} alt={user.name} />
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell"><span className={`badge badge-${user.status}`}>{user.role}</span></td>
                                    <td className="table-cell"><span className={`badge badge-${user.status}`}>{user.status}</span></td>
                                    <td className="table-cell">{user.joinDate}</td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button className="button"><EyeIcon className="h-4 w-4" /></button>
                                            <button className="button"><EditIcon className="h-4 w-4" /></button>
                                            <button className="button"><TrashIcon className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}