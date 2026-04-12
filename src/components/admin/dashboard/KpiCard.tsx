import React from 'react';

interface IKpiCardSecondary {
    label: string;
    value: number | string;
    primaryLabel?: string;  // sub-label for the primary value in horizontal layout
}

interface IKpiCardProps {
    label: string;
    value: number | string;
    delta?: string;
    icon?: React.ReactNode;
    sub?: string;
    variant?: 'default' | 'danger';
    valueColor?: 'lime' | 'teal' | 'violet';
    secondary?: IKpiCardSecondary;
    secondaryLayout?: 'vertical' | 'horizontal';
}

const COLOR_MAP: Record<string, { value: string; icon: string }> = {
    lime:   { value: 'text-lime-600',   icon: 'bg-lime-600/15 text-lime-600'   },
    teal:   { value: 'text-teal-600',   icon: 'bg-teal-600/15 text-teal-600'   },
    violet: { value: 'text-violet-600', icon: 'bg-violet-500/15 text-violet-500' },
};

export default function KpiCard({ label, value, delta, icon, sub, variant = 'default', valueColor = 'lime', secondary, secondaryLayout = 'vertical' }: IKpiCardProps) {
    const isDanger = variant === 'danger';

    const iconContainerClass = isDanger
        ? 'bg-red-500/15 text-red-500'
        : COLOR_MAP[valueColor]?.icon ?? 'bg-lime-600/15 text-lime-600';

    const valueColorClass = isDanger
        ? 'text-red-500'
        : COLOR_MAP[valueColor]?.value ?? 'text-lime-600';

    // danger variant always red; otherwise red for '-', green for the rest
    const deltaColorClass = isDanger
        ? 'text-red-500'
        : delta?.startsWith('-')
            ? 'text-red-500'
            : 'text-green-600';

    const isHorizontal = secondary && secondaryLayout === 'horizontal';

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex items-start gap-4">
            {icon && <div className={`p-3 rounded-full shrink-0 ${iconContainerClass}`}>{icon}</div>}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-0.5">{label}</p>

                {/* Horizontal layout: value + secondary side by side */}
                {isHorizontal ? (
                    <div className="flex items-start gap-3 mt-1">
                        <div className="flex-1 min-w-0">
                            <p className={`text-3xl font-bold ${valueColorClass}`}>
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </p>
                            {secondary.primaryLabel && (
                                <p className="text-[10px] text-gray-400 mt-0.5">{secondary.primaryLabel}</p>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-3xl font-bold ${valueColorClass}`}>
                                {typeof secondary.value === 'number' ? secondary.value.toLocaleString() : secondary.value}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{secondary.label}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className={`text-3xl font-bold ${valueColorClass}`}>
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </p>
                        {delta && (
                            <p className={`text-xs mt-1 font-medium ${deltaColorClass}`}>
                                {delta}
                            </p>
                        )}
                        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                        {secondary && secondaryLayout === 'vertical' && (
                            <div className="mt-3 pt-3 border-t border-stone-100">
                                <p className="text-xs text-gray-400 mb-0.5">{secondary.label}</p>
                                <p className={`text-xl font-bold ${valueColorClass}`}>
                                    {typeof secondary.value === 'number' ? secondary.value.toLocaleString() : secondary.value}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
