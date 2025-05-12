import React from 'react';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../../styles/admin-charts.css';

// Custom tooltip cho biểu đồ
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label}</p>
                <p className="data">{`${payload[0].value} Users`}</p>
            </div>
        );
    }
    return null;
};

export default function UserStatisticsChart({ chartType = 'bar', height = 300, data = [] }) {
    const renderChart = () => {
        const commonProps = {
            stroke: "rgba(23, 37, 42, 0.1)",
            strokeDasharray: "3 3"
        };

        const axisProps = {
            stroke: "#17252a",
            tick: { fill: '#17252a' }
        };

        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid {...commonProps} />
                        <XAxis dataKey="name" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            name="Users"
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
                );
            case 'area':
                return (
                    <AreaChart data={data}>
                        <CartesianGrid {...commonProps} />
                        <XAxis dataKey="name" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            name="Users"
                            stroke="var(--chart-color-1)"
                            fill="var(--chart-color-1)"
                            fillOpacity={0.2}
                            strokeWidth={3}
                        />
                    </AreaChart>
                );
            case 'bar':
            default:
                return (
                    <BarChart data={data}>
                        <CartesianGrid {...commonProps} />
                        <XAxis dataKey="name" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                            dataKey="count"
                            name="Users"
                            fill="var(--chart-color-1)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                );
        }
    };

    return (
        <div className="chart-container">
            <h5 className="admin-title mb-4">User Registration Trends</h5>
            <ResponsiveContainer width="100%" height={height}>
                {data.length > 0 ? renderChart() : (
                    <div className="text-center text-muted">
                        <p>No data available</p>
                    </div>
                )}
            </ResponsiveContainer>
        </div>
    );
}