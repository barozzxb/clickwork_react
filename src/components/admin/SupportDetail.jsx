import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { FaArrowLeft, FaUser, FaEnvelope, FaIdCard, FaUserTag, FaClock, FaExclamationTriangle, FaPaperPlane, FaCheck } from 'react-icons/fa';

import { API_ROOT } from '../../config';

export default function SupportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [token, setToken] = useState(null);
    const [response, setResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    // Kiểm tra token và xác thực
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            console.error('No token found. Redirecting to login...');
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(storedToken);
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                console.error('Token expired. Redirecting to login...');
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            if (decoded.role !== 'ADMIN') {
                console.error('Unauthorized access. User is not an admin.');
                navigate('/');
                return;
            }

            setToken(storedToken);
        } catch (error) {
            console.error('Invalid token:', error);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    // Lấy chi tiết ticket hỗ trợ
    const { data: ticketDetail, isLoading, error } = useQuery({
        queryKey: [`/api/support/${id}`, token],
        enabled: !!token && !!id,
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            if (!token) {
                throw new Error('Không tìm thấy JWT token. Vui lòng đăng nhập lại.');
            }

            // const response = await fetch(`${API_ROOT}/support/${id}`, {
            const response = await fetch(`http://localhost:9000/api/support/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    throw new Error('Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
                }
                if (response.status === 404) {
                    throw new Error('Không tìm thấy ticket hỗ trợ.');
                }

                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Lỗi ${response.status}: Không thể tải chi tiết ticket`
                );
            }

            const data = await response.json();
            if (!data.status || !data.body) {
                throw new Error(data.message || 'Dữ liệu ticket không hợp lệ');
            }

            // Thiết lập response state nếu đã có phản hồi
            if (data.body.response) {
                setResponse(data.body.response);
            }

            return {
                ...data.body,
                formattedDate: moment(data.body.sendat).format('DD/MM/YYYY HH:mm'),
                statusDisplay: data.body.status === 'NO_RESPOND' ? 'Chưa phản hồi' : 'Đã phản hồi',
                statusClass: data.body.status === 'NO_RESPOND' ? 'warning' : 'success',
                userEmail: data.body.applicantEmail || data.body.employerEmail || 'Unknown',
                userType: data.body.applicantEmail ? 'Ứng viên' : 'Nhà tuyển dụng',
                userId: data.body.applicantId || data.body.employerId
            };
        },
        onError: (err) => {
            console.error('Lỗi khi lấy chi tiết ticket:', err.message);
        },
    });

    // Mutation để gửi phản hồi
    const submitResponseMutation = useMutation({
        mutationFn: async (responseData) => {
            setIsSubmitting(true);
            setFormError(null);
            setFormSuccess(null);

            try {
                // const response = await fetch(`${API_ROOT}/support/${id}/response`, {
                const response = await fetch(`http://localhost:9000/api/support/${id}/response`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ response: responseData }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.message || `Lỗi ${response.status}: Không thể gửi phản hồi`
                    );
                }

                const data = await response.json();
                return data;
            } catch (error) {
                throw error;
            } finally {
                setIsSubmitting(false);
            }
        },
        onSuccess: () => {
            setFormSuccess('Phản hồi đã được gửi thành công!');
            queryClient.invalidateQueries([`/api/support/${id}`, token]);
            queryClient.invalidateQueries(['/api/support', token]);
        },
        onError: (error) => {
            setFormError(`Lỗi: ${error.message}`);
        },
    });

    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!response.trim()) {
            setFormError('Vui lòng nhập nội dung phản hồi');
            return;
        }
        submitResponseMutation.mutate(response);
    };

    if (!token) {
        return (
            <div className="support-detail-container p-4">
                <div className="text-center py-5">
                    <div className="card border-0 shadow-sm rounded-3 p-4 mx-auto" style={{ maxWidth: '400px' }}>
                        <div className="text-muted mb-4">
                            <FaExclamationTriangle size={48} className="text-warning mb-3" />
                            <h5 style={{ color: '#17252a' }}>Authentication Required</h5>
                            <p className="mb-4" style={{ color: '#17252a' }}>Please login to view ticket details.</p>
                        </div>
                        <button
                            className="btn btn-custom rounded-pill px-4 py-2"
                            onClick={() => navigate('/login')}
                        >
                            Login Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="support-detail-container p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-1" style={{ color: '#17252a' }}>Support Ticket Details</h4>
                    <p className="text-muted mb-0">View and manage support ticket information</p>
                </div>
                <Link to="../support-user" className="btn btn-custom-light rounded-pill px-4">
                    <FaArrowLeft className="me-2" />
                    Back to List
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-3">Loading ticket details...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger rounded-3">
                    <div className="d-flex align-items-center">
                        <FaExclamationTriangle size={20} className="me-3" />
                        <div>
                            <h6 className="mb-1">Error Loading Ticket</h6>
                            <p className="mb-0">{error.message}</p>
                        </div>
                    </div>
                </div>
            ) : ticketDetail && (
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-white border-0 py-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="d-flex align-items-center mb-2">
                                            <h5 className="mb-0" style={{ color: '#17252a' }}>
                                                #{ticketDetail.id}: {ticketDetail.title}
                                            </h5>
                                            <span className={`badge ms-3 ${ticketDetail.statusDisplay === 'Chưa phản hồi'
                                                ? 'bg-warning bg-opacity-10 text-warning'
                                                : 'bg-success bg-opacity-10 text-success'
                                                } rounded-pill px-3 py-2`}>
                                                {ticketDetail.statusDisplay === 'Chưa phản hồi' ? (
                                                    <>
                                                        <FaClock className="me-1" />
                                                        Pending
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCheck className="me-1" />
                                                        Resolved
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-muted mb-0">
                                            <FaClock className="me-1" />
                                            {ticketDetail.formattedDate}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="ticket-content p-4 bg-light rounded-3 mb-4">
                                    <h6 className="mb-3" style={{ color: '#17252a' }}>Ticket Content</h6>
                                    <p className="mb-0" style={{ color: '#17252a' }}>{ticketDetail.content}</p>
                                </div>

                                {ticketDetail.response ? (
                                    <div className="admin-response p-4 bg-success bg-opacity-10 rounded-3">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h6 className="text-success mb-0">
                                                <FaCheck className="me-2" />
                                                Admin Response
                                            </h6>
                                            <small className="text-muted">
                                                Responded by: {ticketDetail.adminUsername}
                                            </small>
                                        </div>
                                        <p className="mb-0" style={{ color: '#17252a' }}>{ticketDetail.response}</p>
                                    </div>
                                ) : (
                                    <div className="response-form">
                                        <h6 className="mb-3" style={{ color: '#17252a' }}>
                                            <FaPaperPlane className="me-2" />
                                            Send Response
                                        </h6>

                                        {formError && (
                                            <Alert variant="danger" className="rounded-3">
                                                <div className="d-flex align-items-center">
                                                    <FaExclamationTriangle size={16} className="me-2" />
                                                    {formError}
                                                </div>
                                            </Alert>
                                        )}

                                        {formSuccess && (
                                            <Alert variant="success" className="rounded-3">
                                                <div className="d-flex align-items-center">
                                                    <FaCheck size={16} className="me-2" />
                                                    {formSuccess}
                                                </div>
                                            </Alert>
                                        )}

                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    placeholder="Type your response here..."
                                                    value={response}
                                                    onChange={(e) => setResponse(e.target.value)}
                                                    disabled={isSubmitting}
                                                    className="rounded-3 custom-textarea"
                                                    required
                                                />
                                            </Form.Group>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button
                                                    variant="light"
                                                    className="btn-custom-light rounded-pill px-4"
                                                    onClick={() => setResponse('')}
                                                    disabled={isSubmitting}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    className="btn-custom rounded-pill px-4"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                className="me-2"
                                                            />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaPaperPlane className="me-2" />
                                                            Send Response
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-white border-0 py-4">
                                <h5 className="mb-0">
                                    <FaUser className="me-2" />
                                    User Information
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="avatar-circle bg-primary bg-opacity-10 text-primary me-3">
                                        {ticketDetail.userEmail[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <h6 className="mb-1">{ticketDetail.userEmail}</h6>
                                        <span className="badge bg-info bg-opacity-10 text-info rounded-pill">
                                            {ticketDetail.userType}
                                        </span>
                                    </div>
                                </div>

                                <div className="user-details">
                                    <div className="detail-item d-flex align-items-center p-3 rounded-3 mb-2 bg-light">
                                        <FaIdCard className="text-muted me-3" />
                                        <div>
                                            <small className="text-muted d-block">User ID</small>
                                            <strong>{ticketDetail.userId}</strong>
                                        </div>
                                    </div>
                                    <div className="detail-item d-flex align-items-center p-3 rounded-3 mb-2 bg-light">
                                        <FaUserTag className="text-muted me-3" />
                                        <div>
                                            <small className="text-muted d-block">User Type</small>
                                            <strong>{ticketDetail.userType}</strong>
                                        </div>
                                    </div>
                                    <div className="detail-item d-flex align-items-center p-3 rounded-3 bg-light">
                                        <FaEnvelope className="text-muted me-3" />
                                        <div>
                                            <small className="text-muted d-block">Email</small>
                                            <strong>{ticketDetail.userEmail}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-header bg-white border-0 py-4">
                                <h5 className="mb-0">
                                    <FaIdCard className="me-2" />
                                    Ticket Information
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="ticket-details">
                                    <div className="detail-item d-flex align-items-center p-3 rounded-3 mb-2 bg-light">
                                        <div className="me-3">
                                            <span className="badge bg-primary rounded-pill">#{ticketDetail.id}</span>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Ticket ID</small>
                                            <strong>#{ticketDetail.id}</strong>
                                        </div>
                                    </div>
                                    <div className="detail-item d-flex align-items-center p-3 rounded-3 mb-2 bg-light">
                                        <FaClock className="text-muted me-3" />
                                        <div>
                                            <small className="text-muted d-block">Submission Date</small>
                                            <strong>{ticketDetail.formattedDate}</strong>
                                        </div>
                                    </div>
                                    <div className="detail-item d-flex align-items-center p-3 rounded-3 bg-light">
                                        <div className="me-3">
                                            <span className={`badge ${ticketDetail.statusDisplay === 'Chưa phản hồi'
                                                ? 'bg-warning'
                                                : 'bg-success'
                                                } rounded-pill`}>
                                                {ticketDetail.statusDisplay}
                                            </span>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Status</small>
                                            <strong>{ticketDetail.statusDisplay}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .support-detail-container {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                .card {
                    border-radius: 15px;
                    overflow: hidden;
                }
                .avatar-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 500;
                }
                .detail-item {
                    transition: all 0.3s ease;
                }
                .detail-item:hover {
                    transform: translateY(-2px);
                }
                .btn-custom {
                    background-color: #2b7a78;
                    border-color: #2b7a78;
                    color: white;
                    transition: all 0.3s ease;
                }
                .btn-custom:hover {
                    background-color: #235d5b;
                    border-color: #235d5b;
                    color: white;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px rgba(43, 122, 120, 0.1);
                }
                .btn-custom-light {
                    background-color: #f8f9fa;
                    border-color: #e9ecef;
                    color: #2b7a78;
                    transition: all 0.3s ease;
                }
                .btn-custom-light:hover {
                    background-color: rgba(43, 122, 120, 0.1);
                    border-color: #2b7a78;
                    color: #2b7a78;
                    transform: translateY(-1px);
                }
                .custom-textarea {
                    border-color: #e9ecef;
                    color: #17252a;
                    transition: all 0.3s ease;
                }
                .custom-textarea:focus {
                    border-color: #2b7a78;
                    box-shadow: 0 0 0 0.25rem rgba(43, 122, 120, 0.25);
                }
                .badge {
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                }
                .badge:hover {
                    transform: translateY(-1px);
                }
                .text-muted {
                    color: rgba(23, 37, 42, 0.6) !important;
                }
                .card-header {
                    border-bottom: 1px solid rgba(23, 37, 42, 0.1);
                }
                .ticket-content, .admin-response {
                    transition: all 0.3s ease;
                }
                .ticket-content:hover, .admin-response:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }
                .detail-item {
                    background-color: rgba(43, 122, 120, 0.05);
                    border: 1px solid rgba(43, 122, 120, 0.1);
                }
                .detail-item:hover {
                    background-color: rgba(43, 122, 120, 0.1);
                    border-color: #2b7a78;
                }
                .alert {
                    border: none;
                    border-radius: 12px;
                }
                .alert-danger {
                    background-color: rgba(220, 53, 69, 0.1);
                    color: #dc3545;
                }
                .alert-success {
                    background-color: rgba(43, 122, 120, 0.1);
                    color: #2b7a78;
                }
            `}</style>
        </div>
    );
}