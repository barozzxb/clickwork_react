import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilter, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const ApplicantList = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        skill: '',
        status: '',
        dateRange: 'all'
    });

    useEffect(() => {
        fetchApplicants();
        // eslint-disable-next-line
    }, [jobId, filters]);

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let params = [];
            if (filters.skill) params.push(`skill=${encodeURIComponent(filters.skill)}`);
            if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
            // Xử lý dateRange nếu cần
            const query = params.length ? `?${params.join('&')}` : '';
            const response = await axios.get(
                `http://localhost:9000/api/employer/applicants/by-job/${jobId}${query}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.status) {
                setApplicants(response.data.body || []);
            }
        } catch (err) {
            setApplicants([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            {/* Nút trở về ở đầu trang */}
            <button
                onClick={() => navigate('/employer/jobs')}
                className="btn btn-outline-secondary mb-3"
            >
                <FaArrowLeft /> Quay lại danh sách công việc
            </button>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Danh sách ứng viên</h2>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Kỹ năng</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm theo kỹ năng"
                                value={filters.skill}
                                onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Trạng thái</label>
                            <select
                                className="form-select"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="">Tất cả</option>
                                <option value="PENDING">Đang chờ</option>
                                <option value="ACCEPTED">Đã được chấp nhận</option>
                                <option value="REJECTED">Đã bị từ chối</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Thời gian</label>
                            <select
                                className="form-select"
                                value={filters.dateRange}
                                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                            >
                                <option value="all">Tất cả</option>
                                <option value="today">Hôm nay</option>
                                <option value="week">Tuần này</option>
                                <option value="month">Tháng này</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Applicants List */}
            <div className="row g-4">
                {loading ? (
                    <div>Đang tải...</div>
                ) : applicants.length === 0 ? (
                    <div>Không có ứng viên</div>
                ) : applicants.map((app) => (
                    <div key={app.id} className="col-md-6 col-lg-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{app.applicant?.fullname}</h5>
                                <p className="card-text">
                                    <small className="text-muted">
                                        Ngày ứng tuyển: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}
                                    </small>
                                </p>
                                <div className="mb-3">
                                    <strong>Email:</strong> {app.applicant?.email}
                                </div>
                                <button
                                    onClick={() => navigate(`/employer/jobs/${jobId}/applicants/${app.id}`)}
                                    className="btn btn-primary btn-sm"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApplicantList;
