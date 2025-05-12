import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import '../../styles/admin-charts.css';

// Updated colors using the new theme
const COLORS = [
    'var(--chart-danger)',
    'var(--chart-warning)',
    'var(--chart-info)',
    'var(--chart-success)',
    'var(--chart-secondary)'
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label || payload[0].name}</p>
                <p className="data">
                    {`${payload[0].value} ${payload[0].name === 'count' ? 'Violations' : ''}`}
                </p>
            </div>
        );
    }
    return null;
};

export default function ViolationStatisticsChart({
    chartType = 'bar',
    height = 350,
    data = [],
    showStatusDistribution = true,
    statusData = []
}) {
    return (
        <div className="chart-container">
            <h5 className="admin-title mb-4">Account Violations</h5>

            {showStatusDistribution && statusData.length > 0 && (
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="chart-container" style={{ background: 'rgba(43, 122, 120, 0.02)' }}>
                            <h6 className="admin-subtitle text-center mb-3">Status Distribution</h6>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={70}
                                        innerRadius={40}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="name"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                style={{ filter: 'drop-shadow(0px 2px 4px rgba(23, 37, 42, 0.2))' }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="chart-container" style={{ background: 'rgba(43, 122, 120, 0.02)' }}>
                            <h6 className="admin-subtitle text-center mb-3">Status Breakdown</h6>
                            <div className="chart-legend">
                                {statusData.map((entry, index) => (
                                    <div key={index} className="legend-item">
                                        <div
                                            className="legend-color"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <div className="legend-text">
                                            {entry.name}: <strong>{entry.count}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="chart-container" style={{ background: 'rgba(43, 122, 120, 0.02)' }}>
                <h6 className="admin-subtitle text-center mb-3">Monthly Violations</h6>
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={data}>
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
                        <Bar
                            dataKey="count"
                            name="Violations"
                            fill="var(--chart-danger)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}