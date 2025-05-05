import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { Spinner, Form, Button, Alert } from 'react-bootstrap';
import moment from 'moment';

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
            <div className="container-fluid p-5 text-center">
                <div className="alert alert-warning" role="alert">
                    Vui lòng đăng nhập để xem chi tiết ticket hỗ trợ.
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Đăng nhập
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Chi tiết ticket hỗ trợ</h1>
                <Link to="../support-user" className="btn btn-outline-primary">
                    <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách
                </Link>
            </div>

            {isLoading && (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            )}

            {error && (
                <Alert variant="danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error.message}
                </Alert>
            )}

            {ticketDetail && (
                <div className="row">
                    <div className="col-lg-8">
                        {/* Thông tin ticket */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                                <div>
                                    <h5 className="card-title mb-0">#{ticketDetail.id}: {ticketDetail.title}</h5>
                                    <span className={`badge bg-${ticketDetail.statusClass} mt-2`}>
                                        {ticketDetail.statusDisplay}
                                    </span>
                                </div>
                                <div className="text-end text-muted">
                                    <small>{ticketDetail.formattedDate}</small>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="alert alert-light">
                                    <p className="mb-0">{ticketDetail.content}</p>
                                </div>

                                {ticketDetail.response && (
                                    <div className="mt-4">
                                        <h6 className="mb-3 text-primary">
                                            <i className="bi bi-reply me-2"></i>Phản hồi từ Admin
                                        </h6>
                                        <div className="alert alert-success">
                                            <p className="mb-0">{ticketDetail.response}</p>
                                        </div>
                                        <div className="text-end text-muted">
                                            <small>Phản hồi bởi: {ticketDetail.adminUsername}</small>
                                        </div>
                                    </div>
                                )}

                                {!ticketDetail.response && (
                                    <div className="mt-4">
                                        <h6 className="mb-3">
                                            <i className="bi bi-chat-dots me-2"></i>Gửi phản hồi
                                        </h6>

                                        {formError && (
                                            <Alert variant="danger" className="mb-3">
                                                {formError}
                                            </Alert>
                                        )}

                                        {formSuccess && (
                                            <Alert variant="success" className="mb-3">
                                                {formSuccess}
                                            </Alert>
                                        )}

                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    placeholder="Nhập nội dung phản hồi..."
                                                    value={response}
                                                    onChange={(e) => setResponse(e.target.value)}
                                                    disabled={isSubmitting}
                                                    required
                                                />
                                            </Form.Group>
                                            <div className="d-flex justify-content-end">
                                                <Button
                                                    variant="secondary"
                                                    className="me-2"
                                                    onClick={() => setResponse('')}
                                                    disabled={isSubmitting}
                                                >
                                                    Hủy
                                                </Button>

                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                className="me-1"
                                                            />
                                                            Đang gửi...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-send me-1"></i>
                                                            Gửi phản hồi
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
                        {/* Thông tin người gửi */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-white py-3">
                                <h5 className="card-title mb-0">Thông tin người gửi</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div
                                        className="avatar-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center"
                                        style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                                    >
                                        {ticketDetail.userEmail[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <h6 className="mb-1">{ticketDetail.userEmail}</h6>
                                        <span className="badge bg-info">{ticketDetail.userType}</span>
                                    </div>
                                </div>

                                <div className="list-group list-group-flush">
                                    <div className="list-group-item px-0 d-flex justify-content-between">
                                        <span>ID:</span>
                                        <span className="fw-medium">{ticketDetail.userId}</span>
                                    </div>
                                    <div className="list-group-item px-0 d-flex justify-content-between">
                                        <span>Loại người dùng:</span>
                                        <span className="fw-medium">{ticketDetail.userType}</span>
                                    </div>
                                    <div className="list-group-item px-0 d-flex justify-content-between">
                                        <span>Email:</span>
                                        <span className="fw-medium">{ticketDetail.userEmail}</span>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <a
                                        href={`/users/${ticketDetail.userId}`}
                                        className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                                    >
                                        <i className="bi bi-person me-1"></i>
                                        Xem chi tiết người dùng
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin ticket */}
                        <div className="card shadow-sm">
                            <div className="card-header bg-white py-3">
                                <h5 className="card-title mb-0">Thông tin ticket</h5>
                            </div>
                            <div className="card-body">
                                <div className="list-group list-group-flush">
                                    <div className="list-group-item px-0 d-flex justify-content-between">
                                        <span>ID Ticket:</span>
                                        <span className="fw-medium">#{ticketDetail.id}</span>
                                    </div>
                                    <div className="list-group-item px-0 d-flex justify-content-between">
                                        <span>Ngày gửi:</span>
                                        <span className="fw-medium">{ticketDetail.formattedDate}</span>
                                    </div>
                                    <div className="list-group-item px-0 d-flex justify-content-between">
                                        <span>Trạng thái:</span>
                                        <span className={`badge bg-${ticketDetail.statusClass}`}>
                                            {ticketDetail.statusDisplay}
                                        </span>
                                    </div>
                                    {ticketDetail.adminUsername && (
                                        <div className="list-group-item px-0 d-flex justify-content-between">
                                            <span>Người xử lý:</span>
                                            <span className="fw-medium">{ticketDetail.adminUsername}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}