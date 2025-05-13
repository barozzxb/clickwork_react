import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarPlus, FaCheck, FaTimes, FaFlag } from 'react-icons/fa';
import axios from 'axios';
import CreateAppointment from './CreateAppointment';

const ApplicantDetail = () => {
    const { jobId, applicantId } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    useEffect(() => {
        fetchApplicantDetails();
        // eslint-disable-next-line
    }, [applicantId]);

    const fetchApplicantDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:9000/api/employer/applicants/${applicantId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.status) {
                setApplication(response.data.body);
            }
        } catch (error) {
            setApplication(null);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status) => {
        const confirmMessage = status === 'ACCEPTED'
            ? "Bạn có chắc chắn muốn duyệt ứng viên này?"
            : "Bạn có chắc chắn muốn từ chối ứng viên này?";
        if (window.confirm(confirmMessage)) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.patch(
                    `http://localhost:9000/api/employer/applicants/${applicantId}/status?status=${status}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.status) {
                    fetchApplicantDetails();
                }
            } catch (error) { }
        }
    };

    if (loading) {
        return (
            <div className="container py-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    const applicant = application?.applicant;

    return (
        <div className="container py-4">
            {/* Nút trở về ở đầu trang */}
            <button
                onClick={() => navigate(`/employer/jobs/${jobId}/applicants`)}
                className="btn btn-outline-secondary mb-3"
            >
                <FaArrowLeft /> Quay lại danh sách ứng viên
            </button>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Thông tin ứng viên</h2>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title">{applicant?.fullname}</h3>
                            <p className="text-muted">
                                {applicant?.email} • {applicant?.phone}
                            </p>
                            <hr />
                            {/* Thêm các thông tin khác nếu có */}
                            {applicant?.defaultCV && (
                                <div>
                                    <a href={applicant.defaultCV.file} target="_blank" rel="noopener noreferrer">
                                        Xem CV
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Trạng thái ứng tuyển</h5>
                            <p className={`badge ${application?.status === 'ACCEPTED' ? 'bg-success' :
                                application?.status === 'REJECTED' ? 'bg-danger' :
                                    'bg-warning'
                                }`}>
                                {application?.status === 'ACCEPTED' ? 'Đã được chấp nhận' :
                                    application?.status === 'REJECTED' ? 'Đã bị từ chối' :
                                        'Đang chờ'}
                            </p>
                            {application?.status === 'PENDING' && (
                                <div className="d-grid gap-2 mt-3">
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleStatusUpdate('ACCEPTED')}
                                    >
                                        <FaCheck className="me-2" />
                                        Duyệt ứng viên
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleStatusUpdate('REJECTED')}
                                    >
                                        <FaTimes className="me-2" />
                                        Từ chối
                                    </button>
                                </div>
                            )}
                            {application?.status === 'ACCEPTED' && (
                                <div className="d-grid mt-3">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowAppointmentModal(true)}
                                    >
                                        <FaCalendarPlus className="me-2" />
                                        Đặt lịch hẹn
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showAppointmentModal && (
                <CreateAppointment
                    applicationId={applicantId}
                    onClose={() => setShowAppointmentModal(false)}
                    onSuccess={() => {
                        setShowAppointmentModal(false);
                        fetchApplicantDetails();
                    }}
                />
            )}
            {applicant && applicant.user && (
                <Link
                    to={`/employer/report/${applicant.user.username}`}
                    className="btn btn-outline-warning ms-2"
                >
                    <FaFlag className="me-1" /> Báo cáo người dùng
                </Link>
            )}
        </div>
    );
};

export default ApplicantDetail;
