import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import { API_ROOT } from '../../config';

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
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Account Details</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
                <div className="d-flex align-items-center mb-4">
                    <div
                        className="avatar-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center"
                        style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '1.5rem' }}
                    >
                        {account.fullName?.charAt(0) || account.username.charAt(0)}
                    </div>
                    <div>
                        <h5 className="mb-0">{account.fullName || account.username}</h5>
                        <p className="text-muted mb-0">{account.email}</p>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-muted small">Username</label>
                            <p className="mb-0 fw-medium">{account.username}</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-muted small">Phone Number</label>
                            <p className="mb-0 fw-medium">{account.phoneNum || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-muted small">Role</label>
                            <p className="mb-0 fw-medium">
                                <span className={`badge bg-${account.role === 'ADMIN' ? 'danger' : account.role === 'EMPLOYER' ? 'primary' : 'info'}`}>
                                    {account.role}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-muted small">Status</label>
                            {isEditing ? (
                                <select
                                    className="form-select"
                                    value={editedStatus}
                                    onChange={(e) => setEditedStatus(e.target.value)}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="SUSPENDED">Suspended</option>
                                </select>
                            ) : (
                                <p className="mb-0 fw-medium">
                                    <span className={`badge bg-${account.status === 'ACTIVE' ? 'success' :
                                        account.status === 'INACTIVE' ? 'secondary' :
                                            account.status === 'SUSPENDED' ? 'danger' : 'warning'
                                        }`}>
                                        {account.status.charAt(0) + account.status.slice(1).toLowerCase()}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-muted small">Registration Date</label>
                            <p className="mb-0 fw-medium">{formatDate(account.createdAt)}</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-muted small">Violation Count</label>
                            <p className="mb-0 fw-medium">{account.violationCount}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                {isEditing ? (
                    <>
                        <button
                            type="button"
                            className="btn btn-secondary"
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
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </>
                ) : (
                    <>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                            <i className="bi bi-pencil me-1"></i> Edit Status
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}