import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from 'react-bootstrap';
import moment from 'moment';
import { FaSearch, FaFilter, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';

import { API_ROOT } from '../../config';

export default function SupportUser() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [sortDir, setSortDir] = useState('DESC');
    const ticketsPerPage = 5;

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

    // Add debounce effect for search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchTerm(inputValue);
            setCurrentPage(0);
        }, 500); // Wait for 500ms after the user stops typing

        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/support', token, currentPage, searchTerm, sortBy, sortDir, statusFilter],
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            if (!token) {
                throw new Error('Không tìm thấy JWT token. Vui lòng đăng nhập lại.');
            }

            const params = new URLSearchParams({
                page: currentPage,
                size: ticketsPerPage,
                search: searchTerm,
                sortBy,
                sortDir,
            });
            if (statusFilter) {
                params.append('status', statusFilter === 'pending' ? 'NO_RESPOND' : 'RESPONDED');
            }

            // const response = await fetch(`${API_ROOT}/support?${params}`, {
            const response = await fetch(`http://localhost:9000/api/support?${params}`, {
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

                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Lỗi ${response.status}: Không thể tải danh sách hỗ trợ`
                );
            }

            const data = await response.json();
            console.log('Support API response:', data);
            if (!data.status || !data.body) {
                throw new Error(data.message || 'Dữ liệu hỗ trợ không hợp lệ');
            }

            return {
                tickets: data.body.tickets.map((ticket) => ({
                    ...ticket,
                    status: ticket.status === 'NO_RESPOND' ? 'pending' : 'resolved',
                    user: {
                        name: ticket.applicantEmail || ticket.employerEmail || 'Unknown',
                        email: ticket.applicantEmail || ticket.employerEmail || 'Unknown',
                    },
                    date: moment(ticket.sendat).format('YYYY-MM-DD HH:mm'),
                })),
                totalPages: data.body.totalPages,
                currentPage: data.body.currentPage,
                totalItems: data.body.totalItems,
            };
        },
        onError: (err) => {
            console.error('Lỗi khi lấy dữ liệu hỗ trợ:', err.message);
        },
    });

    const tickets = data?.tickets || [];
    const totalPages = data?.totalPages || 1;
    const totalItems = data?.totalItems || 0;

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-warning text-dark';
            case 'resolved':
                return 'bg-success';
            default:
                return 'bg-light text-dark';
        }
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(newSortBy);
            setSortDir('ASC');
        }
        setCurrentPage(0);
    };

    if (!token) {
        return (
            <div className="support-container p-4">
                <div className="text-center py-5">
                    <div className="card border-0 shadow-sm rounded-3 p-4 mx-auto" style={{ maxWidth: '400px' }}>
                        <div className="text-muted mb-4">
                            <FaExclamationTriangle size={48} className="text-warning mb-3" />
                            <h5 style={{ color: '#17252a' }}>Authentication Required</h5>
                            <p className="mb-4" style={{ color: '#17252a' }}>Please login to view support tickets.</p>
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
        <div className="support-container p-4">
            <div className="card shadow-sm border-0 rounded-3">
                <div className="card-header bg-white py-4 border-0">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h4 className="card-title mb-1" style={{ color: '#17252a' }}>Support Tickets</h4>
                            <p className="text-muted mb-0">
                                Manage and respond to user support requests ({totalItems} tickets)
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <div className="position-relative">
                                <FaSearch className="position-absolute text-muted"
                                    style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }}
                                />
                                <input
                                    type="text"
                                    className="form-control search-input ps-5 rounded-pill"
                                    placeholder="Search tickets..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    style={{ minWidth: '250px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="p-4">
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            <button
                                className="btn btn-custom rounded-pill px-4"
                                onClick={() => {
                                    setStatusFilter(null);
                                    setCurrentPage(0);
                                }}
                            >
                                <FaFilter className="me-2" />
                                All Tickets
                            </button>
                            <button
                                className="btn btn-custom rounded-pill px-4"
                                onClick={() => {
                                    setStatusFilter('pending');
                                    setCurrentPage(0);
                                }}
                            >
                                <FaClock className="me-2" />
                                Pending
                            </button>
                            <button
                                className="btn btn-custom rounded-pill px-4"
                                onClick={() => {
                                    setStatusFilter('resolved');
                                    setCurrentPage(0);
                                }}
                            >
                                <FaCheckCircle className="me-2" />
                                Resolved
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="text-muted mt-3">Loading tickets...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger rounded-3 mb-0">
                                <div className="d-flex align-items-center">
                                    <FaExclamationTriangle size={20} className="me-3" />
                                    <div>
                                        <h6 className="mb-1">Error Loading Tickets</h6>
                                        <p className="mb-0">{error.message}</p>
                                    </div>
                                </div>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="text-muted">
                                    <FaSearch size={48} className="mb-3 opacity-50" />
                                    <h5>No Tickets Found</h5>
                                    <p className="mb-0">Try adjusting your search or filter criteria</p>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 text-uppercase"
                                                style={{ fontSize: '0.75rem', color: '#17252a', cursor: 'pointer' }}
                                                onClick={() => handleSortChange('id')}
                                            >
                                                ID {sortBy === 'id' && (
                                                    <span>{sortDir === 'ASC' ? '↑' : '↓'}</span>
                                                )}
                                            </th>
                                            <th className="border-0 text-uppercase" style={{ fontSize: '0.75rem', color: '#17252a' }}>User</th>
                                            <th className="border-0 text-uppercase" style={{ fontSize: '0.75rem', color: '#17252a' }}>Issue</th>
                                            <th className="border-0 text-uppercase" style={{ fontSize: '0.75rem', color: '#17252a' }}>Status</th>
                                            <th className="border-0 text-uppercase"
                                                style={{ fontSize: '0.75rem', color: '#17252a', cursor: 'pointer' }}
                                                onClick={() => handleSortChange('sendat')}
                                            >
                                                Date {sortBy === 'sendat' && (
                                                    <span>{sortDir === 'ASC' ? '↑' : '↓'}</span>
                                                )}
                                            </th>
                                            <th className="border-0 text-uppercase" style={{ fontSize: '0.75rem', color: '#17252a' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((ticket) => (
                                            <tr key={ticket.id} className="align-middle ticket-row">
                                                <td className="fw-medium ps-4">
                                                    <span className="text-primary">#{ticket.id}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-circle bg-primary bg-opacity-10 text-primary">
                                                            {ticket.user.email[0]?.toUpperCase() || '?'}
                                                        </div>
                                                        <div className="ms-3">
                                                            <div className="fw-medium text-truncate" style={{ maxWidth: '200px' }}>
                                                                {ticket.user.email}
                                                            </div>
                                                            <div className="text-muted small">
                                                                {ticket.user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                                        <span className="fw-medium">{ticket.title}</span>
                                                        <br />
                                                        <span className="text-muted small">{ticket.content}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${ticket.status === 'pending'
                                                        ? 'bg-warning bg-opacity-10 text-warning'
                                                        : 'bg-success bg-opacity-10 text-success'
                                                        } rounded-pill px-3 py-2`}>
                                                        {ticket.status === 'pending' ? (
                                                            <>
                                                                <FaClock className="me-1" />
                                                                Pending
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaCheckCircle className="me-1" />
                                                                Resolved
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="text-muted">
                                                        {moment(ticket.date).format('MMM D, YYYY')}
                                                        <br />
                                                        <small>{moment(ticket.date).format('HH:mm')}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-custom rounded-pill px-3"
                                                        onClick={() => navigate(`support/${ticket.id}`)}
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="card-footer bg-white border-0 py-3">
                            <nav className="d-flex justify-content-center">
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link rounded-start"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                                        <li
                                            key={page}
                                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link rounded-end"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .support-container {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                .card {
                    border-radius: 15px;
                    overflow: hidden;
                }
                .avatar-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 500;
                }
                .ticket-row {
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .ticket-row:hover {
                    background-color: rgba(43, 122, 120, 0.05);
                }
                .card-body .btn {
                    background-color: #2b7a78;
                    border: none;
                    font-weight: bold;
                }   
                .card-body .btn-custom {
                    background-color: #2b7a78;
                    border-color: #2b7a78;
                    color: white;
                    transition: all 0.3s ease;
                }
                .card-body .btn-custom:hover {
                    background-color: #235d5b;
                    border-color: #235d5b;
                    color: white;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px rgba(43, 122, 120, 0.1);
                }
                .card-body .btn-custom.active {
                    background-color: #235d5b;
                    border-color: #235d5b;
                    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
                }
                .search-input {
                    border-color: #e9ecef;
                    transition: all 0.3s ease;
                }
                .search-input:focus {
                    border-color: #2b7a78;
                    box-shadow: 0 0 0 0.25rem rgba(43, 122, 120, 0.25);
                }
                .page-link {
                    color: #2b7a78;
                    border-color: #dee2e6;
                    transition: all 0.3s ease;
                }
                .page-item.active .page-link {
                    background-color: #2b7a78;
                    border-color: #2b7a78;
                }
                .page-link:hover {
                    color: white;
                    background-color: #2b7a78;
                    border-color: #2b7a78;
                    transform: translateY(-1px);
                }
                .page-item.disabled .page-link {
                    color: #6c757d;
                    background-color: #fff;
                    border-color: #dee2e6;
                }
                .badge {
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                }
                .badge:hover {
                    transform: translateY(-1px);
                }
                .table th {
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    transition: all 0.2s ease;
                }
                .table th[style*="cursor: pointer"]:hover {
                    background-color: rgba(43, 122, 120, 0.1);
                }
                .table th span {
                    margin-left: 4px;
                    font-size: 12px;
                }
                .table td {
                    color: #17252a;
                    vertical-align: middle;
                }
                .text-muted {
                    color: rgba(23, 37, 42, 0.6) !important;
                }
                .card-header {
                    border-bottom: 1px solid rgba(23, 37, 42, 0.1);
                }
                .card-footer {
                    border-top: 1px solid rgba(23, 37, 42, 0.1);
                }
            `}</style>
        </div>
    );
}