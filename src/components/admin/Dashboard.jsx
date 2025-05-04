import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['/api/admin/dashboard'],
        staleTime: 1000 * 60 * 5,
    });

    const adminUser = { name: "Admin User", role: "Super Admin" };
    const supportTickets = [
        { id: "#12345", user: { name: "John Smith" }, issue: "Cannot access account after password reset", status: "pending", date: "Today, 10:30 AM" },
        { id: "#12344", user: { name: "Sara Wilson" }, issue: "Job application submission error", status: "urgent", date: "Today, 9:15 AM" },
        { id: "#12342", user: { name: "Mark Johnson" }, issue: "Payment issue for premium listing", status: "resolved", date: "Yesterday, 3:45 PM" },
    ];
    const activities = [
        { icon: <i className="bi bi-person-fill" />, color: "bg-primary", title: "New user registered", time: "30 minutes ago" },
        { icon: <i className="bi bi-briefcase-fill" />, color: "bg-success", title: "15 new jobs were posted", time: "1 hour ago" },
        { icon: <i className="bi bi-file-text-fill" />, color: "bg-danger", title: "System alert: Backup completed", time: "2 hours ago" },
    ];
    const userStats = { newUsers: "+1,240", activeUsers: "8,192", conversion: "24.3%" };

    return (
        <div className="container-fluid p-0">
            {/* Welcome Banner */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card bg-light">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="card-title fw-bold">Welcome back, {adminUser.name}!</h2>
                                    <p className="text-muted">Here's an overview of your admin dashboard.</p>
                                </div>
                                <a href="#" className="btn btn-primary">View Site</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="row mb-4">
                <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="text-muted mb-1">Active Users</h6>
                                    <h3 className="fw-bold mb-0">12,489</h3>
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
                                    <h3 className="fw-bold mb-0">3,427</h3>
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
                                    <h3 className="fw-bold mb-0">8,372</h3>
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
                                    <h3 className="fw-bold mb-0">24</h3>
                                    <span className="badge bg-danger">+5</span>
                                </div>
                                <div className="bg-light rounded p-3">
                                    <i className="bi bi-headset text-danger fs-3"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Tickets and Quick Actions */}
            <div className="row mb-4">
                <div className="col-lg-8 mb-4 mb-lg-0">
                    <div className="card h-100">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">Recent Support Tickets</h5>
                        </div>
                        <div className="card-body">
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
                                        {supportTickets.map((ticket) => (
                                            <tr key={ticket.id}>
                                                <td>{ticket.id}</td>
                                                <td>{ticket.user.name}</td>
                                                <td className="text-truncate" style={{ maxWidth: '200px' }}>{ticket.issue}</td>
                                                <td>
                                                    <span className={`badge ${ticket.status === 'pending' ? 'bg-warning' :
                                                        ticket.status === 'urgent' ? 'bg-danger' :
                                                            ticket.status === 'resolved' ? 'bg-success' : 'bg-secondary'
                                                        }`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td>{ticket.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-end pt-3">
                                <a href="#" className="btn btn-sm btn-primary">View All Tickets</a>
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
                                        <a href="#" className="btn btn-primary w-100">
                                            <i className="bi bi-person-plus me-2"></i>Add User
                                        </a>
                                    </div>
                                    <div className="col-6">
                                        <a href="#" className="btn btn-primary w-100">
                                            <i className="bi bi-briefcase-plus me-2"></i>New Job
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <h6 className="fw-bold mb-3">Recent Activity</h6>
                            <ul className="list-group list-group-flush">
                                {activities.map((activity, index) => (
                                    <li key={index} className="list-group-item px-0 py-2 border-0">
                                        <div className="d-flex align-items-center">
                                            <div className={`${activity.color} me-3 p-2 rounded-circle text-white`}>
                                                {activity.icon}
                                            </div>
                                            <div>
                                                <p className="mb-0 fw-medium">{activity.title}</p>
                                                <small className="text-muted">{activity.time}</small>
                                            </div>
                                        </div>
                                    </li>
                                ))}
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
                            <div className="row mb-4 g-3">
                                <div className="col-4 text-center">
                                    <h6 className="text-muted mb-1">New Users</h6>
                                    <h5 className="fw-bold">{userStats.newUsers}</h5>
                                </div>
                                <div className="col-4 text-center">
                                    <h6 className="text-muted mb-1">Active Users</h6>
                                    <h5 className="fw-bold">{userStats.activeUsers}</h5>
                                </div>
                                <div className="col-4 text-center">
                                    <h6 className="text-muted mb-1">Conversion Rate</h6>
                                    <h5 className="fw-bold">{userStats.conversion}</h5>
                                </div>
                            </div>
                            <div className="text-center p-4">
                                <div className="bg-light p-5 rounded-3">
                                    <p className="mb-0">Chart placeholder (requires chart library)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">Job Categories</h5>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <h6 className="text-muted mb-1">Total Jobs</h6>
                                <h4 className="fw-bold">3,427</h4>
                            </div>
                            <div className="text-center p-4">
                                <div className="bg-light p-5 rounded-3">
                                    <p className="mb-0">Chart placeholder (requires chart library)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}