import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner, FaExclamationTriangle, FaUser, FaCalendar, FaFlag } from 'react-icons/fa';

import { API_ROOT } from '../../config';
import '../../styles/admin.css';

export default function ViolationDetails({ report, onClose, onStatusUpdate }) {
    const [status, setStatus] = useState(report.status);
    const [isSuspendUser, setIsSuspendUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setStatus(report.status);
        setIsSuspendUser(false);
        setError(null);
    }, [report]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required to perform this action');
            }

            const apiStatus = status.toUpperCase();
            const payload = {
                status: apiStatus,
                violationConfirmed: isSuspendUser
            };

            const response = await axios.post(
                // `${API_ROOT}/admin/accounts/reports/${report.id}/resolve`,
                `http://localhost:9000/api/admin/accounts/reports/${report.id}/resolve`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status) {
                onStatusUpdate(report.id, status, isSuspendUser);
                toast.success('Report processed successfully!');
                setIsLoading(false);
                onClose();
            } else {
                throw new Error(response.data.message || 'Could not process report');
            }
        } catch (err) {
            const errorMessage = err.response?.status === 401
                ? 'Session expired. Please login again.'
                : err.response?.status === 403
                    ? 'You do not have permission to perform this action.'
                    : err.message || 'An error occurred while processing the report';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-modal-content">
            <div className="admin-modal-header">
                <h5 className="admin-title">Violation Report Details</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="admin-modal-body">
                {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <FaExclamationTriangle className="me-2" />
                        <div>{error}</div>
                    </div>
                )}

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="admin-card p-3">
                            <h6 className="admin-title mb-3">
                                <FaFlag className="me-2" />
                                Report Information
                            </h6>
                            <div className="mb-2">
                                <span className="admin-subtitle">Report ID:</span>
                                <span className="ms-2 fw-medium">#{report.id}</span>
                            </div>
                            <div className="mb-2">
                                <span className="admin-subtitle">
                                    <FaCalendar className="me-2" />
                                    Date Submitted:
                                </span>
                                <span className="ms-2">{report.date}</span>
                            </div>
                            <div className="mb-2">
                                <span className="admin-subtitle">Current Status:</span>
                                <span className={`admin-badge ms-2 ${report.status === 'pending'
                                    ? 'admin-badge-warning'
                                    : report.status === 'resolved'
                                        ? 'admin-badge-success'
                                        : 'admin-badge-secondary'
                                    }`}>
                                    {report.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="admin-card p-3">
                            <h6 className="admin-title mb-3">
                                <FaUser className="me-2" />
                                Users Involved
                            </h6>
                            <div className="mb-2">
                                <span className="admin-subtitle">Sender:</span>
                                <span className="ms-2 fw-medium">{report.sender}</span>
                            </div>
                            <div className="mb-2">
                                <span className="admin-subtitle">Reported User:</span>
                                <span className="ms-2 fw-medium">{report.reported}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-card p-3 mb-4">
                    <h6 className="admin-title mb-3">Issue Details</h6>
                    <h6 className="fw-medium mb-2">{report.issue}</h6>
                    <p className="mb-0 admin-subtitle">
                        {report.description || "No additional details provided."}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="status" className="admin-subtitle mb-2">Update Status</label>
                        <select
                            id="status"
                            className="admin-form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="pending">Pending</option>
                            <option value="responded">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                        </select>
                    </div>

                    {status === 'responded' && (
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="suspendUser"
                                checked={isSuspendUser}
                                onChange={(e) => setIsSuspendUser(e.target.checked)}
                            />
                            <label className="form-check-label text-danger fw-medium" htmlFor="suspendUser">
                                Suspend reported user account
                            </label>
                        </div>
                    )}

                    <div className="admin-modal-footer px-0 pb-0">
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="admin-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="spinner-border spinner-border-sm me-2" />
                                    Processing...
                                </>
                            ) : 'Submit Resolution'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}