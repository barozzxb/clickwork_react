import React from 'react';
import {
    PieChart, Pie, Cell,
    Tooltip, ResponsiveContainer
} from 'recharts';
import '../../styles/admin-charts.css';

// Updated colors using the new theme
export const COLORS = [
    'var(--chart-color-1)',
    'var(--chart-color-2)',
    'var(--chart-color-3)',
    'var(--chart-color-4)',
    'var(--chart-success)',
    'var(--chart-info)'
];

// Custom tooltip cho biểu đồ
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{payload[0].name}</p>
                <p className="data">{`${payload[0].value}%`}</p>
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
            {showLegend && (
                <div className="col-md-6">
                    <div className="chart-legend">
                        {data.map((entry, index) => (
                            <div key={index} className="legend-item">
                                <div
                                    className="legend-color"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <div className="legend-text">
                                    {entry.name}: <strong>{entry.value}%</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}