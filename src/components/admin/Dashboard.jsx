import { useQuery } from '@tanstack/react-query';
import { UserIcon, BriefcaseIcon, FileTextIcon, HeadphonesIcon } from 'lucide-react';
import '../styles/admin-dashboard.css';

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
        { icon: <UserIcon className="h-4 w-4" />, color: "bg-blue-100", title: <><span className="font-medium">New user</span> registered</>, time: "30 minutes ago" },
        { icon: <BriefcaseIcon className="h-4 w-4" />, color: "bg-green-100", title: <><span className="font-medium">15 new jobs</span> were posted</>, time: "1 hour ago" },
        { icon: <FileTextIcon className="h-4 w-4" />, color: "bg-red-100", title: <><span className="font-medium">System alert:</span> Backup completed</>, time: "2 hours ago" },
    ];
    const userStatsData = [
        { month: "Jan", users: 1200 }, { month: "Feb", users: 1900 }, { month: "Mar", users: 1500 },
        { month: "Apr", users: 2100 }, { month: "May", users: 2500 }, { month: "Jun", users: 2200 },
        { month: "Jul", users: 2800 }, { month: "Aug", users: 2600 }, { month: "Sep", users: 2400 },
        { month: "Oct", users: 2200 }, { month: "Nov", users: 1800 }, { month: "Dec", users: 2100 },
    ];
    const userStats = { newUsers: "+1,240", activeUsers: "8,192", conversion: "24.3%" };
    const jobCategoryData = [
        { name: "Technology", value: 0.25, color: "#3B82F6" }, { name: "Marketing", value: 0.20, color: "#10B981" },
        { name: "Finance", value: 0.15, color: "#6366F1" }, { name: "Healthcare", value: 0.15, color: "#F59E0B" },
        { name: "Education", value: 0.10, color: "#EF4444" }, { name: "Others", value: 0.15, color: "#8B5CF6" },
    ];

    return (
        <div className="grid">
            {/* Welcome Banner */}
            <div className="card">
                <div className="card-content">
                    <h2 className="card-title">Welcome back, {adminUser.name}!</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Here’s an overview of your admin dashboard.</p>
                    <button className="button">View Site</button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-md-4">
                <div className="card">
                    <div className="card-content">
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active Users</div>
                        <div className="text-2xl font-semibold">12,489</div>
                        <div className="text-sm text-green-500">+12%</div>
                        <UserIcon className="h-6 w-6" style={{ color: 'var(--primary)' }} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Job Listings</div>
                        <div className="text-2xl font-semibold">3,427</div>
                        <div className="text-sm text-green-500">+8%</div>
                        <BriefcaseIcon className="h-6 w-6" style={{ color: 'var(--secondary)' }} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Applications</div>
                        <div className="text-2xl font-semibold">8,372</div>
                        <div className="text-sm text-green-500">+17%</div>
                        <FileTextIcon className="h-6 w-6" style={{ color: 'var(--warning)' }} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Support Tickets</div>
                        <div className="text-2xl font-semibold">24</div>
                        <div className="text-sm text-red-500">+5</div>
                        <HeadphonesIcon className="h-6 w-6" style={{ color: 'var(--danger)' }} />
                    </div>
                </div>
            </div>

            {/* Support Tickets and Quick Actions */}
            <div className="grid grid-md-3">
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Support Tickets</h2>
                    </div>
                    <div className="card-content">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-cell">ID</th>
                                    <th className="table-cell">User</th>
                                    <th className="table-cell">Issue</th>
                                    <th className="table-cell">Status</th>
                                    <th className="table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supportTickets.map((ticket) => (
                                    <tr key={ticket.id} className="table-row">
                                        <td className="table-cell">{ticket.id}</td>
                                        <td className="table-cell">{ticket.user.name}</td>
                                        <td className="table-cell">{ticket.issue}</td>
                                        <td className="table-cell">
                                            <span className={`badge badge - ${ticket.status} `}>{ticket.status}</span>
                                        </td>
                                        <td className="table-cell">{ticket.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Quick Actions</h2>
                    </div>
                    <div className="card-content">
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                            <a href="#" className="button">Add User</a>
                            <a href="#" className="button">New Job</a>
                        </div>
                        <h3 className="text-sm font-semibold mt-4">Recent Activity</h3>
                        <ul className="mt-2">
                            {activities.map((activity, index) => (
                                <li key={index} className="flex items-center gap-2 mb-2">
                                    <div className={`h - 8 w - 8 rounded - full ${activity.color} flex items - center justify - center`}>
                                        {activity.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm">{activity.title}</div>
                                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{activity.time}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* User Stats and Job Category Stats */}
            <div className="grid grid-md-2">
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">User Statistics</h2>
                    </div>
                    <div className="card-content">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>New Users</div>
                                <div className="text-lg font-semibold">{userStats.newUsers}</div>
                            </div>
                            <div>
                                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active Users</div>
                                <div className="text-lg font-semibold">{userStats.activeUsers}</div>
                            </div>
                            <div>
                                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Conversion Rate</div>
                                <div className="text-lg font-semibold">{userStats.conversion}</div>
                            </div>
                        </div>
                        <div style={{ height: '320px' }}>
                            {/* Placeholder for chart */}
                            <p>Chart placeholder (requires chart library)</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Job Categories</h2>
                    </div>
                    <div className="card-content">
                        <div className="text-center mb-4">
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Jobs</div>
                            <div className="text-lg font-semibold">3,427</div>
                        </div>
                        <div style={{ height: '320px' }}>
                            {/* Placeholder for chart */}
                            <p>Chart placeholder (requires chart library)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
