import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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

    // Helper function để hiển thị badge với màu sắc phù hợp
    const getBadgeClass = (status) => {
        switch (status) {
            case 'active': return 'bg-success';
            case 'inactive': return 'bg-secondary';
            case 'pending': return 'bg-warning';
            default: return 'bg-info';
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'bg-danger';
            case 'employer': return 'bg-primary';
            case 'jobseeker': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                            <h2 className="card-title h5 fw-bold mb-1">Manage User Accounts</h2>
                            <p className="text-muted small mb-0">View and manage all user accounts</p>
                        </div>
                        <div className="col-12 col-md-6 text-md-end">
                            <button className="btn btn-primary">
                                <i className="bi bi-person-plus me-2"></i>
                                Add New User
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="row mb-4 align-items-center">
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="nav nav-tabs mb-4">
                        <button
                            className={`nav-link ${selectedRole === null ? 'active' : ''}`}
                            onClick={() => setSelectedRole(null)}
                        >
                            All Users
                        </button>
                        <button
                            className={`nav-link ${selectedRole === 'jobseeker' ? 'active' : ''}`}
                            onClick={() => setSelectedRole('jobseeker')}
                        >
                            Job Seekers
                        </button>
                        <button
                            className={`nav-link ${selectedRole === 'employer' ? 'active' : ''}`}
                            onClick={() => setSelectedRole('employer')}
                        >
                            Employers
                        </button>
                        <button
                            className={`nav-link ${selectedRole === 'admin' ? 'active' : ''}`}
                            onClick={() => setSelectedRole('admin')}
                        >
                            Admins
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Join Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-circle bg-secondary text-white me-3 d-flex align-items-center justify-content-center"
                                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="fw-medium">{user.name}</div>
                                                    <div className="text-muted small">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getBadgeClass(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>{user.joinDate}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button className="btn btn-sm btn-secondary">
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                <button className="btn btn-sm btn-secondary">
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}