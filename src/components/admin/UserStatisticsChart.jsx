import React from 'react';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Custom tooltip cho biểu đồ
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

export default function UserStatisticsChart({ chartType = 'bar', height = 300, data = [] }) {
    const renderChart = () => {
        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="count"
                            name="Users"
                            stroke="#0d6efd"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                        />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="count"
                            name="Users"
                            stroke="#0d6efd"
                            fill="#0d6efd"
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                );
            case 'bar':
            default:
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="count" name="Users" fill="#0d6efd" />
                    </BarChart>
                );
        }
    };

    return (
        <ResponsiveContainer width="100%" height={height}>
            {data.length > 0 ? renderChart() : <p>Không có dữ liệu</p>}
        </ResponsiveContainer>
    );
}