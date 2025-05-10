import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from 'react-bootstrap';
import moment from 'moment';

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

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setCurrentPage(0);
    };

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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (!token) {
        return (
            <div className="container-fluid p-5 text-center">
                <div className="alert alert-warning" role="alert">
                    Vui lòng đăng nhập để xem danh sách hỗ trợ.
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Đăng nhập
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid p-0">
            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <h2 className="card-title h5 fw-bold mb-1">Support Tickets</h2>
                    <p className="text-muted small mb-0">View and manage user support tickets ({totalItems} tickets)</p>
                </div>

                <div className="card-body">
                    {isLoading && (
                        <div className="text-center my-5">
                            <Spinner animation="border" />
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            Lỗi: {error.message}
                        </div>
                    )}
                    {!isLoading && !error && (
                        <>
                            <div className="row mb-4">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="bi bi-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-start-0"
                                            placeholder="Search by ID, user, title, or content..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={handleSearch}
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-6 text-md-end">
                                    <div className="d-inline-block me-2">
                                        <select
                                            className="form-select"
                                            value={`${sortBy}:${sortDir}`}
                                            onChange={(e) => {
                                                const [newSortBy, newSortDir] = e.target.value.split(':');
                                                setSortBy(newSortBy);
                                                setSortDir(newSortDir);
                                                setCurrentPage(0);
                                            }}
                                        >
                                            <option value="id:DESC">ID (Newest)</option>
                                            <option value="id:ASC">ID (Oldest)</option>
                                            <option value="sendat:DESC">Date (Newest)</option>
                                            <option value="sendat:ASC">Date (Oldest)</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            <ul className="nav nav-tabs mb-4">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${statusFilter === null ? 'active' : ''}`}
                                        onClick={() => {
                                            setStatusFilter(null);
                                            setCurrentPage(0);
                                        }}
                                    >
                                        All
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${statusFilter === 'pending' ? 'active' : ''}`}
                                        onClick={() => {
                                            setStatusFilter('pending');
                                            setCurrentPage(0);
                                        }}
                                    >
                                        Pending
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${statusFilter === 'resolved' ? 'active' : ''}`}
                                        onClick={() => {
                                            setStatusFilter('resolved');
                                            setCurrentPage(0);
                                        }}
                                    >
                                        Resolved
                                    </button>
                                </li>
                            </ul>

                            {tickets.length === 0 ? (
                                <p className="text-muted text-center">Không có yêu cầu hỗ trợ nào phù hợp.</p>
                            ) : (
                                <div className="table-responsive" style={{ height: '400px', overflowY: 'auto' }}>
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light sticky-top" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                            <tr>
                                                <th>ID</th>
                                                <th>User</th>
                                                <th>Issue</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.map((ticket) => (
                                                <tr key={ticket.id}>
                                                    <td>
                                                        <strong>#{ticket.id}</strong>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="avatar-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center"
                                                                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                                                            >
                                                                {ticket.user.email[0]?.toUpperCase() || '?'}
                                                            </div>
                                                            <div>
                                                                <div className="fw-medium">{ticket.user.email}</div>
                                                                <div className="text-muted small">{ticket.user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                                            {ticket.title}: {ticket.content}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                                                            {ticket.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td>{ticket.date}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => navigate(`support/${ticket.id}`)}
                                                        >
                                                            <i className="bi bi-eye"></i> View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {totalPages > 1 && (
                                <nav aria-label="Ticket navigation" className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
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
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}