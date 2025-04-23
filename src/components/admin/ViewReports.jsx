import '../styles/admin-dashboard.css';
export default function ViewReports() {
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

    return (
        <div className="grid">
            <div className="card">
                <div className="card-header">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="card-title">Analytics Reports</h2>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Platform performance and statistics</p>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="time-period">Time Period</label>
                            <select className="input" id="time-period" defaultValue="year">
                                <option value="month">Last 30 days</option>
                                <option value="quarter">Last 90 days</option>
                                <option value="year">Last 12 months</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="card-content">
                    <div className="tabs-list">
                        <button className="tab-trigger tab-trigger-active">User Stats</button>
                        <button className="tab-trigger">Job Listings</button>
                        <button className="tab-trigger">Applications</button>
                        <button className="tab-trigger">Categories</button>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">User Registrations</h3>
                        </div>
                        <div className="card-content" style={{ height: '320px' }}>
                            <p>Chart placeholder (requires chart library)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}