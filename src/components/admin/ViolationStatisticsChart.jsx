import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

// Colors for charts
const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6610f2', '#d63384'];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip bg-white p-3 shadow-sm rounded border">
                <p className="label mb-0"><strong>{label || payload[0].name}</strong></p>
                <p className="data mb-0 text-primary">
                    {`${payload[0].name || 'Count'}: ${payload[0].value}`}
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
        <div>
            <h5 className="text-center mb-4">Account Violations</h5>

            {showStatusDistribution && statusData.length > 0 && (
                <div className="row mb-4">
                    <div className="col-md-6">
                        <h6 className="text-center">Violations by Status</h6>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="col-md-6">
                        <h6 className="text-center mb-3">Status Distribution</h6>
                        <div className="legend">
                            {statusData.map((entry, index) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: COLORS[index % COLORS.length],
                                        marginRight: '8px',
                                        borderRadius: '3px'
                                    }}></div>
                                    <div>{entry.name}: <strong>{entry.count}</strong></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <h6 className="text-center mb-3">Violations by Month</h6>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="count" name="Violations" fill="#dc3545" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}