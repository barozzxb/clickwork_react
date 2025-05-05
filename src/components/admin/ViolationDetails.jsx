import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'investigating': return 'bg-info';
            case 'resolved': return 'bg-success';
            case 'dismissed': return 'bg-secondary';
            default: return 'bg-light text-dark';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Bạn cần đăng nhập để thực hiện hành động này');
            }

            const apiStatus = status.toUpperCase();
            const payload = {
                status: apiStatus,
                violationConfirmed: isSuspendUser
            };

            const response = await axios.post(
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
                toast.success('Xử lý báo cáo thành công!');
                setIsLoading(false);
                onClose();
            } else {
                throw new Error(response.data.message || 'Không thể xử lý báo cáo');
            }
        } catch (err) {
            const errorMessage = err.response?.status === 401
                ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                : err.response?.status === 403
                    ? 'Bạn không có quyền thực hiện hành động này.'
                    : err.message || 'Đã xảy ra lỗi khi xử lý báo cáo';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Violation Report Details</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Report Information</h6>
                        <div className="mb-2">
                            <span className="text-muted">Report ID:</span>
                            <span className="ms-2 fw-medium">{report.id}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-muted">Date Submitted:</span>
                            <span className="ms-2">{report.date}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-muted">Current Status:</span>
                            <span className={`ms-2 badge ${getStatusBadgeClass(report.status)}`}>
                                {report.status}
                            </span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Users Involved</h6>
                        <div className="mb-2">
                            <span className="text-muted">Sender:</span>
                            <span className="ms-2 fw-medium">{report.sender}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-muted">Reported User:</span>
                            <span className="ms-2 fw-medium">{report.reported}</span>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header">
                        <h6 className="fw-bold mb-0">Issue Details</h6>
                    </div>
                    <div className="card-body">
                        <h6 className="fw-medium">{report.issue}</h6>
                        <p className="mb-0">
                            {report.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label fw-medium">Update Status</label>
                        <select
                            id="status"
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="pending">Pending</option>
                            <option value="responded">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                        </select>
                    </div>

                    {(status === 'responded') && (
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="suspendUser"
                                checked={isSuspendUser}
                                onChange={(e) => setIsSuspendUser(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="suspendUser">
                                <span className="text-danger fw-medium">Suspend reported user account</span>
                            </label>
                        </div>
                    )}

                    <div className="modal-footer px-0 pb-0">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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