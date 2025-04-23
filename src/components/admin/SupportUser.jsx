import { useState } from 'react';
import { EyeIcon, FilterIcon, SearchIcon } from 'lucide-react';
import '../styles/admin-dashboard.css';

export default function SupportUser() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);

    const supportTickets = [
        { id: '#12345', user: { name: 'John Smith', email: 'john.smith@example.com' }, issue: 'Cannot access account after password reset', description: '', status: 'pending', date: 'Today, 10:30 AM' },
        { id: '#12344', user: { name: 'Sara Wilson', email: 'sara.wilson@example.com' }, issue: 'Job application submission error', description: '', status: 'urgent', date: 'Today, 9:15 AM' },
        { id: '#12343', user: { name: 'Emily Johnson', email: 'emily.johnson@example.com' }, issue: 'Cannot update profile information', description: '', status: 'in_progress', date: 'Yesterday, 5:20 PM' },
        { id: '#12342', user: { name: 'Mark Johnson', email: 'mark.johnson@example.com' }, issue: 'Payment issue for premium listing', description: '', status: 'resolved', date: 'Yesterday, 3:45 PM' },
        { id: '#12341', user: { name: 'Jennifer Lee', email: 'jennifer.lee@example.com' }, issue: 'Not receiving email notifications', description: '', status: 'closed', date: 'Aug 15, 2023' },
    ];

    const filteredTickets = supportTickets.filter(ticket =>
        (searchTerm === '' || ticket.issue.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === null || ticket.status === statusFilter)
    );

    return (
        <div className="grid">
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Support Tickets</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View and manage user support tickets</p>
                </div>
                <div className="card-content">
                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                        <div style={{ position: 'relative', width: '100%', maxWidth: '384px' }}>
                            <SearchIcon className="h-4 w-4" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                            <input className="input" style={{ paddingLeft: '40px' }} placeholder="Search by ID, user, or issue..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            <button className="button"><FilterIcon className="h-4 w-4" /> Filter</button>
                            <button className="button">Create Ticket</button>
                        </div>
                    </div>
                    <div className="tabs-list">
                        <button className={`tab-trigger ${statusFilter === null ? 'tab-trigger-active' : ''}`} onClick={() => setStatusFilter(null)}>All</button>
                        <button className={`tab-trigger ${statusFilter === 'pending' ? 'tab-trigger-active' : ''}`} onClick={() => setStatusFilter('pending')}>Pending</button>
                        <button className={`tab-trigger ${statusFilter === 'in_progress' ? 'tab-trigger-active' : ''}`} onClick={() => setStatusFilter('in_progress')}>In Progress</button>
                        <button className={`tab-trigger ${statusFilter === 'resolved' ? 'tab-trigger-active' : ''}`} onClick={() => setStatusFilter('resolved')}>Resolved</button>
                        <button className={`tab-trigger ${statusFilter === 'urgent' ? 'tab-trigger-active' : ''}`} onClick={() => setStatusFilter('urgent')}>Urgent</button>
                    </div>
                    <table className="table">
                        <thead className="table-header">
                            <tr className="table-row">
                                <th className="table-cell">ID</th>
                                <th className="table-cell">User</th>
                                <th className="table-cell">Issue</th>
                                <th className="table-cell">Status</th>
                                <th className="table-cell">Date</th>
                                <th className="table-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="table-row">
                                    <td className="table-cell">{ticket.id}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <img className="h-7 w-7 rounded-full" src="https://via.placeholder.com/28" alt={ticket.user.name} />
                                            <div>
                                                <div className="font-medium">{ticket.user.name}</div>
                                                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ticket.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">{ticket.issue}</td>
                                    <td className="table-cell"><span className={`badge badge-${ticket.status}`}>{ticket.status}</span></td>
                                    <td className="table-cell">{ticket.date}</td>
                                    <td className="table-cell">
                                        <button className="button"><EyeIcon className="h-4 w-4" /></button>
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