import { useQuery } from '@tanstack/react-query';
import JobCategoryChart from './JobCategoryChart';
import UserStatisticsChart from './UserStatisticsChart';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from 'react-bootstrap';
import { FaUsers, FaBriefcase, FaFileAlt, FaHeadset, FaExternalLinkAlt, FaChartPie, FaChartLine } from 'react-icons/fa';

import { API_ROOT } from '../../config';

export default function Dashboard() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);

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

    const { data: dashboardResponse, isLoading, error } = useQuery({
        queryKey: ['/api/admin/dashboard', token],
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            if (!token) {
                throw new Error('Không tìm thấy JWT token. Vui lòng đăng nhập lại.');
            }

            const response = await fetch(`${API_ROOT}/admin/dashboard`, {
                // const response = await fetch('http://localhost:9000/api/admin/dashboard', {
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
                    errorData.message || `Lỗi ${response.status}: Không thể tải dữ liệu dashboard`
                );
            }

            const data = await response.json();
            console.log('Dashboard API response:', data);
            if (!data.status || !data.body) {
                throw new Error(data.message || 'Dữ liệu dashboard không hợp lệ');
            }

            return data.body;
        },
        onError: (err) => {
            console.error('Lỗi khi lấy dữ liệu dashboard:', err.message);
        },
    });

    const defaultData = {
        activeUsers: 0,
        jobListings: 0,
        applications: 0,
        supportTickets: 0,
        recentTickets: [],
        jobCategories: [],
        userRegistrations: [],
    };

    const {
        activeUsers,
        jobListings,
        applications,
        supportTickets,
        recentTickets,
        jobCategories,
        userRegistrations,
    } = dashboardResponse || defaultData;

    const adminUser = token ? (() => {
        try {
            const decoded = jwtDecode(token);
            return {
                name: decoded.sub || 'Admin User',
                role: decoded.role || 'Admin'
            };
        } catch (e) {
            return { name: 'Admin User', role: 'Admin' };
        }
    })() : { name: 'Admin User', role: 'Admin' };

    if (!token) {
        return (
            <div className="container-fluid p-5 text-center">
                <div className="alert alert-warning" role="alert">
                    Vui lòng đăng nhập để xem dashboard.
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Đăng nhập
                </button>
            </div>
        );
    }

    const MetricCard = ({ title, value, icon, color, bgColor, trend }) => (
        <div className="col-md-6 col-lg-3 mb-4">
            <div className="metric-card card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className={`icon-circle ${bgColor}`}>
                            {icon}
                        </div>
                        {trend && (
                            <span className={`badge ${trend > 0 ? 'bg-success' : 'bg-danger'} bg-opacity-10 
                                ${trend > 0 ? 'text-success' : 'text-danger'} rounded-pill`}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="fw-bold mb-1" style={{ color: '#2b7a78', fontSize: '1.75rem' }}>
                            {value.toLocaleString()}
                        </h3>
                        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>{title}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container p-4">
            {error && (
                <div className="alert alert-danger shadow-sm rounded-3 border-0 mb-4" role="alert">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                        <div>
                            <h5 className="mb-1">Lỗi khi tải dữ liệu dashboard</h5>
                            <p className="mb-3">{error.message}</p>
                            <div className="mt-2">
                                <button className="btn btn-sm btn-outline-light me-2 rounded-pill"
                                    onClick={() => window.location.reload()}>
                                    <i className="bi bi-arrow-clockwise me-1"></i> Tải lại trang
                                </button>
                                <button className="btn btn-sm btn-outline-light rounded-pill"
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        navigate('/login');
                                    }}>
                                    <i className="bi bi-box-arrow-right me-1"></i> Đăng nhập lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="welcome-section mb-4 p-4 bg-white shadow-sm rounded-3 border-0">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <h2 className="display-6 mb-2" style={{ color: '#2b7a78' }}>Welcome back, {adminUser.name}!</h2>
                        <p className="text-muted mb-0 lead">Here's what's happening with your platform today.</p>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <div className="current-date">
                            <h5 className="mb-1 fw-bold" style={{ color: '#2b7a78' }}>{moment().format('dddd')}</h5>
                            <p className="text-muted mb-0">{moment().format('MMMM D, YYYY')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {isLoading ? (
                    Array(4).fill(null).map((_, index) => (
                        <div key={index} className="col-md-6 col-lg-3 mb-4">
                            <div className="metric-card card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="placeholder-glow">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <span className="placeholder rounded-circle" style={{ width: '48px', height: '48px' }}></span>
                                            <span className="placeholder rounded-pill" style={{ width: '60px', height: '24px' }}></span>
                                        </div>
                                        <span className="placeholder col-7 mb-2" style={{ height: '2rem' }}></span>
                                        <span className="placeholder col-5" style={{ height: '1.2rem' }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <MetricCard
                            title="Active Users"
                            value={activeUsers}
                            icon={<FaUsers size={24} color="#fff" />}
                            bgColor="bg-success bg-opacity-10"
                        />
                        <MetricCard
                            title="Job Listings"
                            value={jobListings}
                            icon={<FaBriefcase size={24} color="#fff" />}
                            bgColor="bg-primary bg-opacity-10"
                        />
                        <MetricCard
                            title="Applications"
                            value={applications}
                            icon={<FaFileAlt size={24} color="#fff" />}
                            bgColor="bg-warning bg-opacity-10"
                        />
                        <MetricCard
                            title="Support Tickets"
                            value={supportTickets}
                            icon={<FaHeadset size={24} color="#fff" />}
                            bgColor="bg-danger bg-opacity-10"
                        />
                    </>
                )}
            </div>

            <div className="row mb-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FaHeadset className="text-primary me-2" size={20} />
                                    <h5 className="mb-0">Recent Support Tickets</h5>
                                </div>
                                <button
                                    className="btn btn-sm btn-primary rounded-pill px-3"
                                    onClick={() => navigate('/admin/support-user')}
                                >
                                    View All <FaExternalLinkAlt size={12} className="ms-1" />
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {isLoading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : recentTickets.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="text-muted">
                                        <FaHeadset size={48} className="mb-3 opacity-50" />
                                        <p className="mb-0">No support tickets found.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0">ID</th>
                                                <th className="border-0">User</th>
                                                <th className="border-0">Issue</th>
                                                <th className="border-0">Status</th>
                                                <th className="border-0">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentTickets.map((ticket) => (
                                                <tr key={ticket.id} className="align-middle ticket-row">
                                                    <td className="ps-3">
                                                        <span className="fw-medium">#</span>
                                                        <span className="text-primary">{ticket.id}</span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="avatar-circle bg-primary bg-opacity-10 text-primary me-2">
                                                                {(ticket.applicantEmail || ticket.employerEmail || 'U')[0].toUpperCase()}
                                                            </div>
                                                            <div className="user-info">
                                                                <div className="text-truncate" style={{ maxWidth: '150px' }}>
                                                                    {ticket.applicantEmail || ticket.employerEmail || 'Unknown'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                                            {ticket.content}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${ticket.status === 'NO_RESPOND'
                                                            ? 'bg-warning bg-opacity-10 text-warning'
                                                            : 'bg-success bg-opacity-10 text-success'
                                                            } rounded-pill px-3 py-2`}>
                                                            {ticket.status === 'NO_RESPOND' ? 'Pending' : 'Resolved'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="text-muted">
                                                            {moment(ticket.sendat).format('MMM D, YYYY')}
                                                        </div>
                                                        <div className="small text-muted">
                                                            {moment(ticket.sendat).format('HH:mm')}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <div className="d-flex align-items-center">
                                <FaChartPie className="text-primary me-2" size={20} />
                                <h5 className="mb-0">Job Categories</h5>
                            </div>
                        </div>
                        <div className="card-body">
                            {isLoading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <JobCategoryChart height={300} showLegend={true} data={jobCategories} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3">
                            <div className="d-flex align-items-center">
                                <FaChartLine className="text-primary me-2" size={20} />
                                <h5 className="mb-0">User Registration Trends</h5>
                            </div>
                        </div>
                        <div className="card-body">
                            {isLoading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="stats-summary mb-4">
                                            <div className="stat-item p-3 bg-light rounded-3 mb-3">
                                                <h6 className="text-muted mb-2">Total New Users</h6>
                                                <h3 className="fw-bold mb-0" style={{ color: '#2b7a78' }}>
                                                    {userRegistrations.reduce((sum, month) => sum + month.count, 0)}
                                                </h3>
                                            </div>
                                            <div className="stat-item p-3 bg-light rounded-3">
                                                <h6 className="text-muted mb-2">Active Users</h6>
                                                <h3 className="fw-bold mb-0" style={{ color: '#2b7a78' }}>
                                                    {activeUsers.toLocaleString()}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <UserStatisticsChart chartType="bar" height={300} data={userRegistrations} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .dashboard-container {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                .metric-card {
                    border-radius: 15px;
                    transition: all 0.3s ease;
                }
                .metric-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
                .icon-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .metric-card:hover .icon-circle {
                    transform: scale(1.1);
                }
                .avatar-circle {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                .card {
                    border-radius: 15px;
                    overflow: hidden;
                }
                .table th {
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.5px;
                }
                .ticket-row {
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .ticket-row:hover {
                    background-color: rgba(43, 122, 120, 0.05);
                }
                .stat-item {
                    transition: all 0.3s ease;
                }
                .stat-item:hover {
                    transform: translateY(-3px);
                }
                .alert {
                    background-color: #dc3545;
                    color: white;
                }
                .btn-outline-light:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-color: white;
                    color: white;
                }
            `}</style>
        </div>
    );
}