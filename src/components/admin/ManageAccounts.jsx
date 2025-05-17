import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import ViolationDetails from './ViolationDetails';
import AccountDetails from './AccountDetails';
import AdminForm from './AdminForm';
import { FaSearch, FaUserPlus, FaUsers, FaExclamationTriangle } from 'react-icons/fa';

import { API_ROOT } from '../../config';
import '../../styles/admin.css';

export default function ManageAccounts() {
    // const API_ROOT = 'http://localhost:9000/api';

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
            axios.get(`${API_ROOT}/admin/accounts`, {
                // axios.get('http://localhost:9000/api/admin/accounts', {
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
            axios.get(`${API_ROOT}/admin/accounts/reports`, {
                // axios.get('http://localhost:9000/api/admin/accounts/reports', {
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
            const response = await axios.get(`${API_ROOT}/admin/accounts/${username}`, {
                // const response = await axios.get(`http://localhost:9000/api/admin/accounts/${username}`, {
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
        <div className="admin-container">
            <div className="admin-card">
                <div className="admin-card-header">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                            <h2 className="admin-title">Manage Accounts</h2>
                            <p className="admin-subtitle">View and manage all user accounts</p>
                        </div>
                        <div className="col-12 col-md-6 text-md-end">
                            <button
                                className="admin-btn"
                                onClick={() => setShowAdminForm(true)}
                            >
                                <FaUserPlus className="me-2" />
                                Add New Admin
                            </button>
                        </div>
                    </div>
                </div>

                <div className="admin-modal-body">
                    <div className="nav nav-pills mb-4">
                        <button
                            className={`admin-nav-link me-2 ${activeTab === 'accounts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('accounts')}
                        >
                            <FaUsers className="me-2" />
                            User Accounts
                        </button>
                        <button
                            className={`admin-nav-link ${activeTab === 'violations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('violations')}
                        >
                            <FaExclamationTriangle className="me-2" />
                            Account Violation Reports
                        </button>
                    </div>

                    <div className="row mb-4">
                        <div className="col-12 col-md-6">
                            <div className="admin-search">
                                <FaSearch className="admin-search-icon" />
                                <input
                                    type="text"
                                    className="form-control admin-search-input"
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
                                {['All Users', 'Job Seekers', 'Employers', 'Admins'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`admin-nav-link me-2 ${selectedRole === (tab === 'All Users' ? null :
                                            tab === 'Job Seekers' ? 'APPLICANT' :
                                                tab === 'Employers' ? 'EMPLOYER' :
                                                    tab === 'Admins' ? 'ADMIN' : null)
                                            ? 'active'
                                            : ''
                                            }`}
                                        onClick={() =>
                                            setSelectedRole(tab === 'All Users' ? null :
                                                tab === 'Job Seekers' ? 'APPLICANT' :
                                                    tab === 'Employers' ? 'EMPLOYER' :
                                                        tab === 'Admins' ? 'ADMIN' : null)
                                        }
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {accountsLoading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status" />
                                </div>
                            ) : accountsError ? (
                                <div className="alert alert-danger">
                                    {accountsError.message || 'Failed to load accounts'}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
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
                                                            <div className="admin-avatar me-3">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="fw-medium">{user.name}</div>
                                                                <div className="admin-subtitle">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="admin-badge admin-badge-primary">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`admin-badge ${user.status === 'active'
                                                            ? 'admin-badge-success'
                                                            : user.status === 'suspended'
                                                                ? 'admin-badge-danger'
                                                                : 'admin-badge-warning'
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td>{user.joinDate}</td>
                                                    <td>
                                                        <button
                                                            className="admin-btn admin-btn-secondary"
                                                            onClick={() => fetchAccountDetails(user.id)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'violations' && (
                        <>
                            <div className="nav nav-tabs mb-4">
                                {['All Reports', 'Pending', 'Responded', 'Dismissed'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`admin-nav-link me-2 ${selectedViolationStatus === (tab === 'All Reports' ? null : tab.toLowerCase())
                                            ? 'active'
                                            : ''
                                            }`}
                                        onClick={() =>
                                            setSelectedViolationStatus(
                                                tab === 'All Reports' ? null : tab.toLowerCase()
                                            )
                                        }
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {reportsLoading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status" />
                                </div>
                            ) : reportsError ? (
                                <div className="alert alert-danger">
                                    {reportsError.message || 'Failed to load reports'}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
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
                                                    <td>#{report.id}</td>
                                                    <td>{report.issue}</td>
                                                    <td>{report.sender}</td>
                                                    <td>{report.reported}</td>
                                                    <td>
                                                        <span className={`admin-badge ${report.status === 'pending'
                                                            ? 'admin-badge-warning'
                                                            : report.status === 'resolved'
                                                                ? 'admin-badge-success'
                                                                : 'admin-badge-secondary'
                                                            }`}>
                                                            {report.status}
                                                        </span>
                                                    </td>
                                                    <td>{report.date}</td>
                                                    <td>
                                                        <button
                                                            className="admin-btn"
                                                            onClick={() => handleViewViolationDetails(report.id)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination */}
                    {activeTab === 'accounts' && accountsData?.totalPages > 1 && (
                        <div className="admin-pagination">
                            <button
                                className={`admin-pagination-item ${accountsData.currentPage === 0 ? 'disabled' : ''}`}
                                onClick={() => setAccountPage(accountsData.currentPage - 1)}
                                disabled={accountsData.currentPage === 0}
                            >
                                Previous
                            </button>
                            {[...Array(accountsData.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`admin-pagination-item ${accountsData.currentPage === i ? 'active' : ''}`}
                                    onClick={() => setAccountPage(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className={`admin-pagination-item ${accountsData.currentPage === accountsData.totalPages - 1 ? 'disabled' : ''
                                    }`}
                                onClick={() => setAccountPage(accountsData.currentPage + 1)}
                                disabled={accountsData.currentPage === accountsData.totalPages - 1}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {activeTab === 'violations' && reportsData?.totalPages > 1 && (
                        <div className="admin-pagination">
                            <button
                                className={`admin-pagination-item ${reportsData.currentPage === 0 ? 'disabled' : ''}`}
                                onClick={() => setReportPage(reportsData.currentPage - 1)}
                                disabled={reportsData.currentPage === 0}
                            >
                                Previous
                            </button>
                            {[...Array(reportsData.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`admin-pagination-item ${reportsData.currentPage === i ? 'active' : ''}`}
                                    onClick={() => setReportPage(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className={`admin-pagination-item ${reportsData.currentPage === reportsData.totalPages - 1 ? 'disabled' : ''
                                    }`}
                                onClick={() => setReportPage(reportsData.currentPage + 1)}
                                disabled={reportsData.currentPage === reportsData.totalPages - 1}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showViolationDetails && selectedReport && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="admin-modal" onClick={() => setShowViolationDetails(false)}>
                        <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
                            <ViolationDetails
                                report={selectedReport}
                                onClose={() => setShowViolationDetails(false)}
                                onStatusUpdate={handleViolationStatusUpdate}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showAccountDetails && selectedAccount && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="admin-modal" onClick={() => setShowAccountDetails(false)}>
                        <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
                            <AccountDetails
                                account={selectedAccount}
                                onClose={() => setShowAccountDetails(false)}
                                onUpdate={handleAccountUpdate}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showAdminForm && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="admin-modal" onClick={() => setShowAdminForm(false)}>
                        <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                            <AdminForm
                                onClose={() => setShowAdminForm(false)}
                                onAdminCreated={handleAdminCreated}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}