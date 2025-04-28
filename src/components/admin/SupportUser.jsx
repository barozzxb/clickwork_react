import { useState } from 'react';

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
        (searchTerm === '' || ticket.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === null || ticket.status === statusFilter)
    );

    // Helper function để hiển thị badge với màu sắc phù hợp
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning text-dark';
            case 'in_progress': return 'bg-info text-white';
            case 'resolved': return 'bg-success';
            case 'urgent': return 'bg-danger';
            case 'closed': return 'bg-secondary';
            default: return 'bg-light text-dark';
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <h2 className="card-title h5 fw-bold mb-1">Support Tickets</h2>
                    <p className="text-muted small mb-0">View and manage user support tickets</p>
                </div>

                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0"
                                    placeholder="Search by ID, user, or issue..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <button className="btn btn-secondary me-2">
                                <i className="bi bi-funnel me-1"></i> Filter
                            </button>
                            <button className="btn btn-primary">
                                <i className="bi bi-plus-circle me-1"></i> Create Ticket
                            </button>
                        </div>
                    </div>

                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${statusFilter === null ? 'active' : ''}`}
                                onClick={() => setStatusFilter(null)}
                            >
                                All
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${statusFilter === 'pending' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('pending')}
                            >
                                Pending
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${statusFilter === 'in_progress' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('in_progress')}
                            >
                                In Progress
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${statusFilter === 'resolved' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('resolved')}
                            >
                                Resolved
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${statusFilter === 'urgent' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('urgent')}
                            >
                                <span className="text-danger">Urgent</span>
                            </button>
                        </li>
                    </ul>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Issue</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td><strong>{ticket.id}</strong></td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
                                                    {ticket.user.name[0]}
                                                </div>
                                                <div>
                                                    <div className="fw-medium">{ticket.user.name}</div>
                                                    <div className="text-muted small">{ticket.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                                {ticket.issue}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>{ticket.date}</td>
                                        <td>
                                            <button className="btn btn-sm btn-primary">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <nav aria-label="Ticket navigation" className="mt-4">
                        <ul className="pagination justify-content-center">
                            <li className="page-item disabled">
                                <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                            </li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item">
                                <a className="page-link" href="#">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}