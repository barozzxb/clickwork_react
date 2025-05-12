import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaSpinner } from 'react-icons/fa';

import { API_ROOT } from '../../config';
import '../../styles/admin.css';

export default function AccountDetails({ account, onClose, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedStatus, setEditedStatus] = useState(account.status);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.patch(
                // `${API_ROOT}/admin/accounts/${account.username}`,
                `http://localhost:9000/api/admin/accounts/${account.username}`,
                {
                    status: editedStatus.toUpperCase()
                },
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                }
            );

            if (response.data.status) {
                toast.success('Account status updated successfully');
                onUpdate({
                    ...account,
                    status: editedStatus
                });
                setIsEditing(false);
            } else {
                toast.error(response.data.message || 'Failed to update account status');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message.includes('CORS') ? 'CORS error: Unable to communicate with the server' :
                'An error occurred while updating account status';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-modal-content">
            <div className="admin-modal-header">
                <h5 className="admin-title">Account Details</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="admin-modal-body">
                <div className="d-flex align-items-center mb-4">
                    <div className="admin-avatar me-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                        <FaUser />
                    </div>
                    <div>
                        <h5 className="admin-title mb-1">{account.fullName || account.username}</h5>
                        <p className="admin-subtitle mb-0">{account.email}</p>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="admin-subtitle mb-2">Username</label>
                            <p className="fw-medium mb-0">{account.username}</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="admin-subtitle mb-2">Phone Number</label>
                            <p className="fw-medium mb-0">{account.phoneNum || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="admin-subtitle mb-2">Role</label>
                            <p className="mb-0">
                                <span className="admin-badge admin-badge-primary">
                                    {account.role}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="admin-subtitle mb-2">Status</label>
                            {isEditing ? (
                                <select
                                    className="admin-form-control"
                                    value={editedStatus}
                                    onChange={(e) => setEditedStatus(e.target.value)}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="SUSPENDED">Suspended</option>
                                </select>
                            ) : (
                                <p className="mb-0">
                                    <span className={`admin-badge ${account.status === 'ACTIVE' ? 'admin-badge-success' :
                                        account.status === 'INACTIVE' ? 'admin-badge-warning' :
                                            'admin-badge-danger'
                                        }`}>
                                        {account.status.charAt(0) + account.status.slice(1).toLowerCase()}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="admin-subtitle mb-2">Registration Date</label>
                            <p className="fw-medium mb-0">{formatDate(account.createdAt)}</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="admin-subtitle mb-2">Violation Count</label>
                            <p className="fw-medium mb-0">{account.violationCount}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="admin-modal-footer">
                {isEditing ? (
                    <>
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() => {
                                setEditedStatus(account.status);
                                setIsEditing(false);
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="admin-btn"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="spinner-border spinner-border-sm me-2" />
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </>
                ) : (
                    <>
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
                            Close
                        </button>
                        <button type="button" className="admin-btn" onClick={() => setIsEditing(true)}>
                            Edit Status
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}