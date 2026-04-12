'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { LegendProps, TooltipProps } from 'recharts';
import { IUserGrowthPoint } from '@/shared/interfaces/entities/adminStats.interface';
import { formatMonth } from '@/shared/utils/formatMonth';

interface IUserGrowthChartProps {
    data: IUserGrowthPoint[];
}

export default function UserGrowthChart({ data }: IUserGrowthChartProps) {
    // Accumulate incremental data into running totals
    let totalAcc = 0;
    let premiumAcc = 0;
    const formatted = data.map(d => {
        totalAcc += d.newUsers;
        premiumAcc += d.newPremium;
        return {
            month: formatMonth(d.month),
            totalUsers: totalAcc,
            totalPremium: premiumAcc,
        };
    });

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
            <h3 className="text-sm font-semibold text-teal-700 mb-4">Crecimiento de usuarios</h3>
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={formatted}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip content={renderTooltip} />
                    <Legend content={renderLegend} />
                    <Area type="monotone" dataKey="totalUsers" name="Total usuarios" stroke="#0d9488" fill="url(#colorTotal)" strokeWidth={2} />
                    <Area type="monotone" dataKey="totalPremium" name="Total premium" stroke="#84cc16" fill="url(#colorPremium)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

