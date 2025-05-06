import React from 'react';
import {
    PieChart, Pie, Cell,
    Tooltip, ResponsiveContainer
} from 'recharts';

// Màu sắc cho biểu đồ
export const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6610f2', '#d63384'];

// Custom tooltip cho biểu đồ
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip bg-white p-3 shadow-sm rounded border">
                <p className="label mb-0"><strong>{payload[0].name}</strong></p>
                <p className="data mb-0 text-primary">{`${payload[0].value}%`}</p>
            </div>
        );
    }
    return null;
};

export default function JobCategoryChart({ height = 250, showLegend = true, data = [] }) {
    return (
        <div className="row align-items-center">
            <div className={showLegend ? "col-md-6" : "col-12"}>
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                        <Pie
                            data={data}
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
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {showLegend && (
                <div className="col-md-6">
                    <div className="legend">
                        {data.map((entry, index) => (
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
            )}
        </div>
    );
}