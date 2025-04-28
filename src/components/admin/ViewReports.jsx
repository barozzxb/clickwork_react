import { useState } from 'react';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ViewReports() {
    const [activeTab, setActiveTab] = useState('users');

    const userRegistrationData = [
        { name: 'Jan', count: 400 }, { name: 'Feb', count: 300 }, { name: 'Mar', count: 550 },
        { name: 'Apr', count: 470 }, { name: 'May', count: 600 }, { name: 'Jun', count: 550 },
        { name: 'Jul', count: 700 }, { name: 'Aug', count: 650 }, { name: 'Sep', count: 550 },
        { name: 'Oct', count: 500 }, { name: 'Nov', count: 450 }, { name: 'Dec', count: 480 },
    ];
    const jobListingData = [
        { name: 'Jan', count: 65 }, { name: 'Feb', count: 80 }, { name: 'Mar', count: 110 },
        { name: 'Apr', count: 100 }, { name: 'May', count: 140 }, { name: 'Jun', count: 120 },
        { name: 'Jul', count: 160 }, { name: 'Aug', count: 190 }, { name: 'Sep', count: 170 },
        { name: 'Oct', count: 150 }, { name: 'Nov', count: 130 }, { name: 'Dec', count: 145 },
    ];
    const applicationData = [
        { name: 'Jan', count: 240 }, { name: 'Feb', count: 300 }, { name: 'Mar', count: 320 },
        { name: 'Apr', count: 280 }, { name: 'May', count: 430 }, { name: 'Jun', count: 380 },
        { name: 'Jul', count: 520 }, { name: 'Aug', count: 540 }, { name: 'Sep', count: 450 },
        { name: 'Oct', count: 400 }, { name: 'Nov', count: 360 }, { name: 'Dec', count: 390 },
    ];
    const categoryData = [
        { name: 'Technology', value: 25 }, { name: 'Marketing', value: 20 }, { name: 'Finance', value: 15 },
        { name: 'Healthcare', value: 15 }, { name: 'Education', value: 10 }, { name: 'Others', value: 15 },
    ];

    // Colors for pie chart segments
    const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6610f2', '#d63384'];

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip bg-white p-3 shadow-sm rounded border">
                    <p className="label mb-0"><strong>{label}</strong></p>
                    <p className="data mb-0 text-primary">{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    // Render appropriate chart based on active tab
    const renderChart = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div>
                        <h5 className="text-center mb-4">User Registrations</h5>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={userRegistrationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="count" name="Users" fill="#0d6efd" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );
            case 'jobs':
                return (
                    <div>
                        <h5 className="text-center mb-4">Job Listings</h5>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={jobListingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Listings"
                                    stroke="#0d6efd"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                );
            case 'applications':
                return (
                    <div>
                        <h5 className="text-center mb-4">Applications</h5>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={applicationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    name="Applications"
                                    stroke="#0d6efd"
                                    fill="#0d6efd"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                );
            case 'categories':
                return (
                    <div>
                        <h5 className="text-center mb-4">Job Categories</h5>
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            innerRadius={40}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value}%`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="col-md-6">
                                <div className="legend">
                                    {categoryData.map((entry, index) => (
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                backgroundColor: COLORS[index % COLORS.length],
                                                marginRight: '8px',
                                                borderRadius: '3px'
                                            }}></div>
                                            <div>{entry.name}: <strong>{entry.value}%</strong></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white py-3">
                    <div className="row align-items-center">
                        <div className="col-md-8 mb-3 mb-md-0">
                            <h4 className="card-title fw-bold mb-1">Analytics Reports</h4>
                            <p className="text-muted small">Platform performance and statistics</p>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label htmlFor="time-period" className="form-label">Time Period</label>
                                <select className="form-select" id="time-period" defaultValue="year">
                                    <option value="month">Last 30 days</option>
                                    <option value="quarter">Last 90 days</option>
                                    <option value="year">Last 12 months</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                                onClick={() => setActiveTab('users')}
                            >
                                <i className="bi bi-people me-2"></i>User Stats
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
                                onClick={() => setActiveTab('jobs')}
                            >
                                <i className="bi bi-briefcase me-2"></i>Job Listings
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('applications')}
                            >
                                <i className="bi bi-file-earmark-text me-2"></i>Applications
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                                onClick={() => setActiveTab('categories')}
                            >
                                <i className="bi bi-pie-chart me-2"></i>Categories
                            </button>
                        </li>
                    </ul>

                    <div className="chart-container bg-light p-4 rounded" style={{ position: 'relative' }}>
                        {renderChart()}
                    </div>
                </div>
            </div>
        </div>
    );
}