import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import EmployerNavbar from '../../components/employer/EmployerNavbar';
import { FaEdit, FaArrowLeft, FaUserFriends, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaBriefcase, FaTag } from 'react-icons/fa';
import axios from 'axios';

const API_PREFIX = 'http://localhost:9000/api';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [debug, setDebug] = useState(null);

    useEffect(() => {
        fetchJobDetail();
    }, [id]);

    const fetchJobDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập lại - không tìm thấy token');
                setLoading(false);
                return;
            }

            console.log(`Fetching job details for ID: ${id}`);

            // Sử dụng API common để lấy chi tiết job theo ID
            const response = await axios.get(
                `${API_PREFIX}/jobs/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("API response:", response.data);

            if (response.data.status) {
                setJob(response.data.body);
                setError('');
                setDebug(null);
            } else {
                console.error("API error:", response.data.message);
                setError(`Không thể tải thông tin công việc: ${response.data.message}`);
                setDebug(response.data);
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
            let errorMessage = 'Có lỗi xảy ra khi tải dữ liệu';

            if (error.response) {
                console.error("Response error data:", error.response.data);
                errorMessage = `Lỗi ${error.response.status}: ${error.response.data.message || error.message}`;
                setDebug({
                    status: error.response.status,
                    message: error.response.data.message,
                    data: error.response.data
                });
            } else if (error.request) {
                console.error("Request was made but no response:", error.request);
                errorMessage = 'Không nhận được phản hồi từ máy chủ';
                setDebug({
                    message: 'No response received',
                    request: 'Request sent but no response'
                });
            } else {
                console.error("Error message:", error.message);
                errorMessage = `Lỗi: ${error.message}`;
                setDebug({
                    message: error.message
                });
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <>
                <EmployerNavbar />
                <div className="container" style={{ marginTop: '80px', padding: '20px' }}>
                    <div className="text-center my-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error || !job) {
        return (
            <>
                <EmployerNavbar />
                <div className="container" style={{ marginTop: '80px', padding: '20px' }}>
                    <div className="alert alert-danger">
                        {error || 'Không tìm thấy công việc'}
                        {debug && (
                            <div className="mt-2">
                                <details>
                                    <summary>Chi tiết lỗi (debug)</summary>
                                    <pre>{JSON.stringify(debug, null, 2)}</pre>
                                </details>
                            </div>
                        )}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/employer')}
                    >
                        <FaArrowLeft className="me-2" />Quay lại
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <EmployerNavbar />
            <div className="container" style={{ marginTop: '80px', padding: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/employer')}
                    >
                        <FaArrowLeft className="me-2" />Quay lại
                    </button>
                    <div>
                        <Link to={`/employer/jobs/edit/${id}`} className="btn btn-warning me-2">
                            <FaEdit className="me-2" />Chỉnh sửa
                        </Link>
                        <Link to={`/employer/jobs/${id}/applicants`} className="btn btn-info">
                            <FaUserFriends className="me-2" />Danh sách ứng viên
                        </Link>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">{job.name}</h2>
                            <span className={`badge ${job.active ? 'bg-success' : 'bg-secondary'}`}>
                                {job.active ? 'Đang hiển thị' : 'Đã ẩn'}
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center mb-2">
                                    <FaBriefcase className="me-2 text-primary" style={{ minWidth: '20px' }} />
                                    <span><strong>Loại công việc:</strong> {job.jobtype}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <FaDollarSign className="me-2 text-success" style={{ minWidth: '20px' }} />
                                    <span><strong>Mức lương:</strong> {job.salary}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <FaUserFriends className="me-2 text-info" style={{ minWidth: '20px' }} />
                                    <span><strong>Số lượng cần tuyển:</strong> {job.quantity || 'Không xác định'}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <FaTag className="me-2 text-secondary" style={{ minWidth: '20px' }} />
                                    <span><strong>Lĩnh vực:</strong> {job.field}</span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center mb-2">
                                    <FaCalendarAlt className="me-2 text-info" style={{ minWidth: '20px' }} />
                                    <span><strong>Ngày tạo:</strong> {formatDate(job.createdat)}</span>
                                </div>
                                {job.address && (
                                    <div className="d-flex align-items-start mb-2">
                                        <FaMapMarkerAlt className="me-2 text-danger" style={{ minWidth: '20px', marginTop: '4px' }} />
                                        <div>
                                            <strong>Địa chỉ:</strong> {job.address}
                                        </div>
                                    </div>
                                )}
                                <div className="d-flex align-items-start mb-2">
                                    <FaTag className="me-2 text-warning" style={{ minWidth: '20px', marginTop: '4px' }} />
                                    <div>
                                        <strong>Tags:</strong>{' '}
                                        <div className="mt-1">
                                            {Array.isArray(job.tags) && job.tags.length > 0 ? (
                                                job.tags.map((tag, index) => (
                                                    <span key={index} className="badge bg-light text-dark me-1 mb-1">
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-muted">Không có tags</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h5>Mô tả công việc</h5>
                            <div className="card">
                                <div className="card-body">
                                    <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h5>Kỹ năng yêu cầu</h5>
                            <div className="card">
                                <div className="card-body">
                                    <p style={{ whiteSpace: 'pre-line' }}>{job.requiredskill}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h5>Quyền lợi</h5>
                            <div className="card">
                                <div className="card-body">
                                    <p style={{ whiteSpace: 'pre-line' }}>{job.benefit}</p>
                                </div>
                            </div>
                        </div>

                        {job.employer && (
                            <div className="mb-4">
                                <h5>Thông tin nhà tuyển dụng</h5>
                                <div className="card">
                                    <div className="card-body">
                                        <p><strong>Công ty:</strong> {job.employer.fullname}</p>
                                        <p><strong>Email:</strong> {job.employer.email}</p>
                                        {job.employer.website && (
                                            <p><strong>Website:</strong> <a href={job.employer.website} target="_blank" rel="noopener noreferrer">{job.employer.website}</a></p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobDetail;
