import { useQuery } from '@tanstack/react-query';
import JobCategoryChart from './JobCategoryChart';
import UserStatisticsChart from './UserStatisticsChart';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from 'react-bootstrap';

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

            const response = await fetch('http://localhost:9000/api/admin/dashboard', {
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
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                >
                    Đăng nhập
                </button>
            </div>
        );
    }

    // Loading indicator component for individual sections
    const LoadingIndicator = ({ height = '100px' }) => (
        <div className="d-flex justify-content-center align-items-center" style={{ height }}>
            <Spinner animation="border" size="sm" className="me-2" />
            <span>Đang tải...</span>
        </div>
    );

    // Skeleton for metric cards
    const MetricSkeleton = () => (
        <div className="card h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 className="text-muted mb-1">Loading...</h6>
                        <div className="bg-light rounded" style={{ height: '30px', width: '80px' }}></div>
                        <div className="bg-light rounded mt-2" style={{ height: '20px', width: '40px' }}></div>
                    </div>
                    <div className="bg-light rounded p-3">
                        <div style={{ height: '24px', width: '24px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-0">
            {error && (
                <div className="alert alert-danger" role="alert">
                    <h5>Lỗi khi tải dữ liệu dashboard:</h5>
                    <p>{error.message}</p>
                    <div className="mt-3">
                        <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => window.location.reload()}
                        >
                            Tải lại trang
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/login');
                            }}
                        >
                            Đăng nhập lại
                        </button>
                    </div>
                </div>
            )}

            {/* Welcome Banner - Always show */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card bg-light">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="card-title fw-bold">Welcome back, {adminUser.name}!</h2>
                                    <p className="text-muted">Here's an overview of your admin dashboard.</p>
                                </div>
                                {/* <div>
                                    <a href="#" className="btn btn-primary me-2">View Site</a>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            navigate('/login');
                                        }}
                                    >
                                        Đăng xuất
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="row mb-4">
                {isLoading ? (
                    // Show skeletons while loading
                    <>
                        <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                            <MetricSkeleton />
                        </div>
                        <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                            <MetricSkeleton />
                        </div>
                        <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                            <MetricSkeleton />
                        </div>
                        <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                            <MetricSkeleton />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="text-muted mb-1">Active Users</h6>
                                            <h3 className="fw-bold mb-0">{activeUsers.toLocaleString()}</h3>
                                            <span className="badge bg-success">+12%</span>
                                        </div>
                                        <div className="bg-light rounded p-3">
                                            <i className="bi bi-people-fill text-primary fs-3"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="text-muted mb-1">Job Listings</h6>
                                            <h3 className="fw-bold mb-0">{jobListings.toLocaleString()}</h3>
                                            <span className="badge bg-success">+8%</span>
                                        </div>
                                        <div className="bg-light rounded p-3">
                                            <i className="bi bi-briefcase-fill text-success fs-3"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="text-muted mb-1">Applications</h6>
                                            <h3 className="fw-bold mb-0">{applications.toLocaleString()}</h3>
                                            <span className="badge bg-success">+17%</span>
                                        </div>
                                        <div className="bg-light rounded p-3">
                                            <i className="bi bi-file-earmark-text-fill text-warning fs-3"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="text-muted mb-1">Support Tickets</h6>
                                            <h3 className="fw-bold mb-0">{supportTickets.toLocaleString()}</h3>
                                            <span className="badge bg-danger">+5</span>
                                        </div>
                                        <div className="bg-light rounded p-3">
                                            <i className="bi bi-headset text-danger fs-3"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Support Tickets and Quick Actions */}
            <div className="row mb-4">
                <div className="col-lg-8 mb-4 mb-lg-0">
                    <div className="card h-100">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">Recent Support Tickets</h5>
                        </div>
                        <div className="card-body">
                            {isLoading ? (
                                <LoadingIndicator height="200px" />
                            ) : recentTickets.length === 0 ? (
                                <p>Không có phiếu hỗ trợ nào.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>User</th>
                                                <th>Issue</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentTickets.map((ticket) => (
                                                <tr key={ticket.id}>
                                                    <td>#{ticket.id}</td>
                                                    <td>{ticket.applicantEmail || ticket.employerEmail || 'Unknown'}</td>
                                                    <td className="text-truncate" style={{ maxWidth: '200px' }}>
                                                        {ticket.content}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`badge ${ticket.status === 'NO_RESPOND'
                                                                ? 'bg-warning'
                                                                : ticket.status === 'RESPONDED'
                                                                    ? 'bg-success'
                                                                    : 'bg-secondary'
                                                                }`}
                                                        >
                                                            {ticket.status}
                                                        </span>
                                                    </td>
                                                    <td>{moment(ticket.sendat).format('YYYY-MM-DD HH:mm')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="text-end pt-3">
                                <a href="/admin/support-user" className="btn btn-sm btn-primary">
                                    View All Tickets
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2 mb-4">
                                <div className="row g-2">
                                    <div className="col-6">
                                        <a href="/users/add" className="btn btn-primary w-100">
                                            <i className="bi bi-person-plus me-2"></i>Add User
                                        </a>
                                    </div>
                                    <div className="col-6">
                                        <a href="/jobs/add" className="btn btn-primary w-100">
                                            <i className="bi bi-briefcase-plus me-2"></i>New Job
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <h6 className="fw-bold mb-3">Recent Activity</h6>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item px-0 py-2 border-0">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary me-3 p-2 rounded-circle text-white">
                                            <i className="bi bi-person-fill" />
                                        </div>
                                        <div>
                                            <p className="mb-0 fw-medium">New user registered</p>
                                            <small className="text-muted">30 minutes ago</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="list-group-item px-0 py-2 border-0">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-success me-3 p-2 rounded-circle text-white">
                                            <i className="bi bi-briefcase-fill" />
                                        </div>
                                        <div>
                                            <p className="mb-0 fw-medium">15 new jobs were posted</p>
                                            <small className="text-muted">1 hour ago</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="list-group-item px-0 py-2 border-0">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-danger me-3 p-2 rounded-circle text-white">
                                            <i className="bi bi-file-text-fill" />
                                        </div>
                                        <div>
                                            <p className="mb-0 fw-medium">System alert: Backup completed</p>
                                            <small className="text-muted">2 hours ago</small>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Stats and Job Category Stats */}
            <div className="row">
                <div className="col-lg-6 mb-4 mb-lg-0">
                    <div className="card h-100">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">User Statistics</h5>
                        </div>
                        <div className="card-body">
                            {isLoading ? (
                                <LoadingIndicator height="350px" />
                            ) : (
                                <>
                                    <div className="row mb-4 g-3">
                                        <div className="col-4 text-center">
                                            <h6 className="text-muted mb-1">New Users</h6>
                                            <h5 className="fw-bold">{userRegistrations.reduce((sum, month) => sum + month.count, 0)}</h5>
                                        </div>
                                        <div className="col-4 text-center">
                                            <h6 className="text-muted mb-1">Active Users</h6>
                                            <h5 className="fw-bold">{activeUsers.toLocaleString()}</h5>
                                        </div>
                                        <div className="col-4 text-center">
                                            <h6 className="text-muted mb-1">Conversion Rate</h6>
                                            <h5 className="fw-bold">24.3%</h5>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <UserStatisticsChart chartType="bar" height={300} data={userRegistrations} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">Job Categories</h5>
                        </div>
                        <div className="card-body">
                            {isLoading ? (
                                <LoadingIndicator height="350px" />
                            ) : (
                                <>
                                    <div className="text-center mb-4">
                                        <h6 className="text-muted mb-1">Total Jobs</h6>
                                        <h4 className="fw-bold">{jobListings.toLocaleString()}</h4>
                                    </div>
                                    <div className="p-4">
                                        <JobCategoryChart height={250} showLegend={true} data={jobCategories} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}