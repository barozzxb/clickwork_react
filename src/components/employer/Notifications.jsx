import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaRegBell } from 'react-icons/fa';
import axios from 'axios';
import EmployerNavbar from './EmployerNavbar';

const API_PREFIX = 'http://localhost:9000/api';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${API_PREFIX}/employer/profile/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status) {
                setNotifications(response.data.body || []);
            } else {
                setError('Không thể tải danh sách thông báo');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Có lỗi xảy ra khi tải danh sách thông báo');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_PREFIX}/employer/profile/notifications/${id}/read`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Update the notification in state
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);

            // Kiểm tra nếu ngày không hợp lệ
            if (isNaN(date.getTime())) {
                return 'Không xác định';
            }

            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Không xác định';
        }
    };

    if (loading && notifications.length === 0) {
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

    return (
        <>
            <EmployerNavbar />
            <div className="container" style={{ marginTop: '80px', padding: '20px' }}>
                <div className="d-flex align-items-center mb-4">
                    <button
                        className="btn btn-outline-secondary me-3"
                        onClick={() => navigate('/employer')}
                    >
                        <FaArrowLeft /> Quay lại
                    </button>
                    <h2 className="mb-0">Thông báo của bạn</h2>
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                <div className="card">
                    <div className="card-body">
                        {notifications.length === 0 ? (
                            <div className="text-center py-5">
                                <FaRegBell size={50} className="text-muted mb-3" />
                                <p className="text-muted">Bạn không có thông báo nào</p>
                            </div>
                        ) : (
                            <div className="list-group">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`list-group-item list-group-item-action ${!notification.read ? 'bg-light' : ''}`}
                                    >
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <h5 className="mb-1">{notification.title}</h5>
                                            <small className="text-muted">{formatDate(notification.createdAt)}</small>
                                        </div>
                                        <p className="mb-1">{notification.content}</p>
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <small className="text-muted">
                                                {notification.read ? 'Đã đọc' : 'Chưa đọc'}
                                            </small>
                                            {!notification.read && (
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <FaCheck className="me-1" /> Đánh dấu đã đọc
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notifications;
