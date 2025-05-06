import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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

export default function ApplicationStatisticsChart({ height = 350, data = [] }) {
    return (
        <div>
            <h5 className="text-center mb-4">Applications</h5>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data}>
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
}