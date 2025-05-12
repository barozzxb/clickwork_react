import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../../styles/admin-charts.css';

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label}</p>
                <p className="data">{`${payload[0].value} Listings`}</p>
            </div>
        );
    }
    return null;
};

export default function JobStatisticsChart({ height = 350, data = [] }) {
    return (
        <div className="chart-container">
            <h5 className="admin-title mb-4">Job Listings Over Time</h5>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data}>
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
    );
}