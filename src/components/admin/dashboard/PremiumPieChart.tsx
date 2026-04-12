'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import type { LegendProps, TooltipProps } from 'recharts';

interface IPremiumPieChartProps {
    premium: number;
    free: number;
    conversionRate: number;
}

const COLORS = ['#84cc16', '#d6d3d1'];

export default function PremiumPieChart({ premium, free, conversionRate }: IPremiumPieChartProps) {
    const chartData = [
        { name: 'Premium', value: premium },
        { name: 'Free', value: free },
    ];

    const renderCenterLabel = (props: PieLabelRenderProps) => {
        const cx = (props.cx as number) ?? 0;
        const cy = (props.cy as number) ?? 0;
        return (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                <tspan x={cx} dy="-0.3em" fontSize={22} fontWeight="bold" fill="#0d9488">
                    {conversionRate}%
                </tspan>
                <tspan x={cx} dy="1.4em" fontSize={11} fill="#9ca3af">
                    conversión
                </tspan>
            </text>
        );
    };

    const renderLegend = (props: LegendProps) => {
        const { payload } = props;
        if (!payload) return null;
        return (
            <div className="flex items-center justify-center gap-4 mt-2">
                {payload.map((entry: { color?: string; value?: string }, index: number) => (
                    <div key={index} className="flex items-center gap-1.5">
                        <span
                            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-gray-500 font-medium">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderTooltip = ({ active, payload }: TooltipProps<number, string>) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm px-3 py-2 text-xs">
                {payload.map((entry: { color?: string; name?: string; value?: number }, i: number) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="text-stone-500">{entry.name}:</span>
                        <span className="font-semibold text-teal-700 ml-1">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200">
            <h3 className="text-sm font-semibold text-teal-700 mb-4">Ratio Premium vs Free</h3>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        labelLine={false}
                        label={renderCenterLabel}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={renderTooltip} />
                    <Legend content={renderLegend} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
