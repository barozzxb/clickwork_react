import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import '../../styles/admin-charts.css';

// Updated colors using the new theme
const COLORS = [
    'var(--chart-color-1)',
    'var(--chart-color-2)',
    'var(--chart-color-3)',
    'var(--chart-color-4)',
    'var(--chart-success)',
    'var(--chart-info)'
];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label || payload[0].name}</p>
                <p className="data">
                    {`${payload[0].value} ${payload[0].dataKey === 'count' ? 'Listings' : ''}`}
                </p>
            </div>
        );
    }
    return null;
};

// Format month name (e.g., "2025-04" to "Apr 2025")
const formatMonthName = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export default function JobStatisticsChart({ height = 350, monthlyData = [], jobTypeData = [] }) {
    // Format monthly data with proper month names
    const formattedMonthlyData = monthlyData.map(item => ({
        ...item,
        name: formatMonthName(item.name)
    }));

    return (
        <div className="chart-container">
            {/* Charts Row */}
            <div className="row">
                {/* Monthly Trends */}
                <div className="col-md-8">
                    <div className="chart-section">
                        <h5 className="admin-title mb-4">Job Listings Over Time</h5>
                        <ResponsiveContainer width="100%" height={height}>
                            <LineChart data={formattedMonthlyData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(23, 37, 42, 0.1)"
                                />
                                <XAxis
                                    dataKey="name"
                                    stroke="#17252a"
                                    tick={{ fill: '#17252a' }}
                                />
                                <YAxis
                                    stroke="#17252a"
                                    tick={{ fill: '#17252a' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{
                                        paddingTop: '20px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Job Listings"
                                    stroke="var(--chart-color-1)"
                                    strokeWidth={3}
                                    dot={{
                                        fill: 'var(--chart-color-1)',
                                        stroke: 'white',
                                        strokeWidth: 2,
                                        r: 6
                                    }}
                                    activeDot={{
                                        r: 8,
                                        stroke: 'var(--chart-color-1)',
                                        strokeWidth: 2,
                                        fill: 'white'
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Job Type Distribution */}
                <div className="col-md-4">
                    <div className="chart-section">
                        <h5 className="admin-title mb-4">Job Types Distribution</h5>
                        <ResponsiveContainer width="100%" height={height}>
                            <PieChart>
                                <Pie
                                    data={jobTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    innerRadius={40}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="name"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {jobTypeData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            style={{ filter: 'drop-shadow(0px 2px 4px rgba(23, 37, 42, 0.2))' }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    layout="vertical"
                                    align="center"
                                    verticalAlign="bottom"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}