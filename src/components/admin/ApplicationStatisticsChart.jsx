import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../../styles/admin-charts.css';

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label}</p>
                <p className="data">{`${payload[0].value} Applications`}</p>
            </div>
        );
    }
    return null;
};

export default function ApplicationStatisticsChart({ height = 350, data = [] }) {
    return (
        <div className="chart-container">
            <h5 className="admin-title mb-4">Application Trends</h5>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data}>
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
                    <defs>
                        <linearGradient id="applicationGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-color-1)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--chart-color-1)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="count"
                        name="Applications"
                        stroke="var(--chart-color-1)"
                        fill="url(#applicationGradient)"
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
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}