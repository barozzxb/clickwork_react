import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import ViolationDetails from './ViolationDetails';
import AccountDetails from './AccountDetails';
import AdminForm from './AdminForm';

import { API_ROOT } from '../../config';

export default function ManageAccounts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);
    const [activeTab, setActiveTab] = useState('accounts');
    const [selectedViolationStatus, setSelectedViolationStatus] = useState(null);
    const [showViolationDetails, setShowViolationDetails] = useState(false);
    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [accountPage, setAccountPage] = useState(0);
    const [reportPage, setReportPage] = useState(0);
    const pageSize = 10;

    const queryClient = useQueryClient();

    // Lấy danh sách tài khoản
    const { data: accountsData, isLoading: accountsLoading, error: accountsError } = useQuery({
        queryKey: ['accounts', searchTerm, selectedRole, accountPage],
        queryFn: () =>
            // axios.get(`${API_ROOT}/admin/accounts`, {
            axios.get('http://localhost:9000/api/admin/accounts', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: {
                    page: accountPage,
                    size: pageSize,
                    search: searchTerm,
                    role: selectedRole,
                    status: ''
                }
            }).then(res => res.data),
        enabled: activeTab === 'accounts',
        select: (data) => ({
            accounts: data.body.accounts.map(acc => ({
                id: acc.username,
                name: acc.fullName || acc.username,
                email: acc.email,
                role: acc.role.toLowerCase(),
                status: acc.status.toLowerCase(),
                joinDate: new Date(acc.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                })
            })),
            totalPages: data.body.totalPages,
            currentPage: data.body.currentPage,
            totalItems: data.body.totalItems
        })
    });

    // Lấy danh sách báo cáo vi phạm
    const { data: reportsData, isLoading: reportsLoading, error: reportsError } = useQuery({
        queryKey: ['reports', searchTerm, selectedViolationStatus, reportPage],
        queryFn: () =>
            // axios.get(`${API_ROOT}/admin/accounts/reports`, {
            axios.get('http://localhost:9000/api/admin/accounts/reports', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: {
                    page: reportPage,
                    size: pageSize,
                    search: searchTerm,
                    status: selectedViolationStatus ? selectedViolationStatus.toUpperCase() : ''
                }
            }).then(res => res.data),
        enabled: activeTab === 'violations',
        select: (data) => ({
            reports: data.body.reports.map(rep => ({
                id: rep.id,
                issue: rep.title,
                sender: rep.senderName,
                reported: rep.reportedName,
                status: rep.status.toLowerCase(),
                date: new Date(rep.sendat).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                }),
                description: rep.content
            })),
            totalPages: data.body.totalPages,
            currentPage: data.body.currentPage,
            totalItems: data.body.totalItems
        })
    });

    // Lấy chi tiết tài khoản
    const fetchAccountDetails = async (username) => {
        try {
            // const response = await axios.get(`${API_ROOT}/admin/accounts/${username}`, {
            const response = await axios.get(`http://localhost:9000/api/admin/accounts/${username}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.status) {
                setSelectedAccount(response.data.body);
                setShowAccountDetails(true);
            } else {
                toast.error(response.data.message || 'Failed to fetch account details');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while fetching account details');
        }
    };

    const handleAccountUpdate = (updatedAccount) => {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        setSelectedAccount(updatedAccount);
    };

    const handleAdminCreated = () => {
        // Refresh the accounts list after creating a new admin
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case 'active': return 'bg-success';
            case 'inactive': return 'bg-secondary';
            case 'pending': return 'bg-warning';
            case 'suspended': return 'bg-danger';
            default: return 'bg-info';
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'bg-danger';
            case 'employer': return 'bg-primary';
            case 'jobseeker':
            case 'applicant': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    const getViolationStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'investigating': return 'bg-info';
            case 'resolved': return 'bg-success';
            case 'dismissed': return 'bg-secondary';
            default: return 'bg-light text-dark';
        }
    };

    const handleViewViolationDetails = (reportId) => {
        const report = reportsData?.reports.find(r => r.id === reportId);
        if (report) {
            setSelectedReport(report);
            setShowViolationDetails(true);
        }
    };

    const handleViolationStatusUpdate = (reportId, newStatus, resolution, shouldSuspendUser) => {
        queryClient.invalidateQueries({ queryKey: ['reports'] });
        if (shouldSuspendUser) {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        }
        setShowViolationDetails(false);
    };

    const renderPagination = (currentPage, totalPages, setPage) => (
        <nav>
            <ul className="pagination justify-content-center mt-3">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(currentPage - 1)}>
                        Previous
                    </button>
                </li>
                {[...Array(totalPages).keys()].map(i => (
                    <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(i)}>
                            {i + 1}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(currentPage + 1)}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );

    return (
        <div className="container-fluid p-0">
            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                            <h2 className="card-title h5 fw-bold mb-1">Manage Accounts</h2>
                            <p className="text-muted small mb-0">View and manage all user accounts</p>
                        </div>
                        <div className="col-12 col-md-6 text-md-end">
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowAdminForm(true)}
                            >
                                <i className="bi bi-person-plus me-2"></i>
                                Add New Admin
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <ul className="nav nav-pills mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'accounts' ? 'active' : ''}`}
                                onClick={() => setActiveTab('accounts')}
                            >
                                <i className="bi bi-people me-2"></i>
                                User Accounts
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'violations' ? 'active' : ''}`}
                                onClick={() => setActiveTab('violations')}
                            >
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Account Violation Reports
                            </button>
                        </li>
                    </ul>

                    <div className="row mb-4 align-items-center">
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0"
                                    placeholder={activeTab === 'accounts' ? "Search users..." : "Search reports..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {activeTab === 'accounts' && (
                        <>
                            <div className="nav nav-tabs mb-4">
                                <button
                                    className={`nav-link ${selectedRole === null ? 'active' : ''}`}
                                    onClick={() => setSelectedRole(null)}
                                >
                                    All Users
                                </button>
                                <button
                                    className={`nav-link ${selectedRole === 'applicant' ? 'active' : ''}`}
                                    onClick={() => setSelectedRole('applicant')}
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

                            {accountsLoading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
                            {accountsError && (
                                <div className="alert alert-danger">
                                    Lỗi: {accountsError.message || 'Không thể tải danh sách tài khoản'}
                                </div>
                            )}
                            {accountsData && (
                                <>
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
                                                {accountsData.accounts.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div
                                                                    className="avatar-circle bg-secondary text-white me-3 d-flex align-items-center justify-content-center"
                                                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                                                >
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
                                                                <button
                                                                    className="btn btn-sm btn-secondary"
                                                                    onClick={() => fetchAccountDetails(user.id)}
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {accountsData.totalPages > 1 && renderPagination(
                                        accountsData.currentPage,
                                        accountsData.totalPages,
                                        setAccountPage
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'violations' && (
                        <>
                            <div className="nav nav-tabs mb-4">
                                <button
                                    className={`nav-link ${selectedViolationStatus === null ? 'active' : ''}`}
                                    onClick={() => setSelectedViolationStatus(null)}
                                >
                                    All Reports
                                </button>
                                <button
                                    className={`nav-link ${selectedViolationStatus === 'pending' ? 'active' : ''}`}
                                    onClick={() => setSelectedViolationStatus('pending')}
                                >
                                    Pending
                                </button>
                                <button
                                    className={`nav-link ${selectedViolationStatus === 'responded' ? 'active' : ''}`}
                                    onClick={() => setSelectedViolationStatus('responded')}
                                >
                                    Responded
                                </button>
                                <button
                                    className={`nav-link ${selectedViolationStatus === 'dismissed' ? 'active' : ''}`}
                                    onClick={() => setSelectedViolationStatus('dismissed')}
                                >
                                    Dismissed
                                </button>
                            </div>

                            {reportsLoading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
                            {reportsError && (
                                <div className="alert alert-danger">
                                    Lỗi: {reportsError.message || 'Không thể tải danh sách báo cáo'}
                                </div>
                            )}
                            {reportsData && (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Issue</th>
                                                    <th>Sender</th>
                                                    <th>Reported User</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportsData.reports.map((report) => (
                                                    <tr key={report.id}>
                                                        <td>{report.id}</td>
                                                        <td>{report.issue}</td>
                                                        <td>{report.sender}</td>
                                                        <td>{report.reported}</td>
                                                        <td>
                                                            <span className={`badge ${getViolationStatusBadgeClass(report.status)}`}>
                                                                {report.status}
                                                            </span>
                                                        </td>
                                                        <td>{report.date}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleViewViolationDetails(report.id)}
                                                            >
                                                                <i className="bi bi-eye me-1"></i> View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {reportsData.totalPages > 1 && renderPagination(
                                        reportsData.currentPage,
                                        reportsData.totalPages,
                                        setReportPage
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showViolationDetails && selectedReport && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <ViolationDetails
                            report={selectedReport}
                            onClose={() => setShowViolationDetails(false)}
                            onStatusUpdate={handleViolationStatusUpdate}
                        />
                    </div>
                </div>
            )}

            {showAccountDetails && selectedAccount && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <AccountDetails
                            account={selectedAccount}
                            onClose={() => setShowAccountDetails(false)}
                            onUpdate={handleAccountUpdate}
                        />
                    </div>
                </div>
            )}

            {showAdminForm && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <AdminForm
                            onClose={() => setShowAdminForm(false)}
                            onAdminCreated={handleAdminCreated}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}