'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { LegendProps, TooltipProps } from 'recharts';
import { IRouteGrowthPoint } from '@/shared/interfaces/entities/adminStats.interface';
import { formatMonth } from '@/shared/utils/formatMonth';

interface IRoutesBarChartProps {
    data: IRouteGrowthPoint[];
}

export default function RoutesBarChart({ data }: IRoutesBarChartProps) {
    const formatted = data.map(d => ({ ...d, month: formatMonth(d.month) }));

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

    const renderTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm px-3 py-2 text-xs">
                <p className="font-semibold text-teal-700 mb-1">{label}</p>
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
            <h3 className="text-sm font-semibold text-teal-700 mb-4">Rutas nuevas por mes</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={formatted}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip content={renderTooltip} />
                    <Legend content={renderLegend} />
                    <Bar dataKey="newRoutes" name="Nuevas rutas" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
