'use client';

import Link from 'next/link';
import { ClockIcon, MapPinIcon, TagIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { IRouteSessionSummary } from '@/shared/interfaces/entities/routeSession.interface';
import { parseSessionDate, formatElapsed } from '@/shared/utils/sessionDate';
import { formatDistance } from '@/shared/utils/distance';

interface ISessionCardProps {
    session: IRouteSessionSummary;
}

// --- cálculo de duración ---

function calcDurationSeconds(startAt: string, endAt: string): number {
    const start = parseSessionDate(startAt);
    const end = parseSessionDate(endAt);
    if (!start || !end) return 0;
    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
}

// --- formateo de fecha legible ---

function formatDate(dateStr: string): string {
    const parsed = parseSessionDate(dateStr);
    if (!parsed) return dateStr;
    return parsed.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

// --- colores semánticos para arco ---

interface ArcColors { stroke: string; text: string }

function energyArcColors(value: 1 | 2 | 3 | 4 | 5): ArcColors {
    if (value <= 2) return { stroke: '#ef4444', text: 'text-red-500' };
    if (value === 3) return { stroke: '#f59e0b', text: 'text-amber-500' };
    return                  { stroke: '#65a30d', text: 'text-lime-600' };
}

function stressArcColors(value: 1 | 2 | 3 | 4 | 5): ArcColors {
    if (value >= 4) return { stroke: '#ef4444', text: 'text-red-500' };
    if (value === 3) return { stroke: '#f59e0b', text: 'text-amber-500' };
    return                  { stroke: '#65a30d', text: 'text-lime-600' };
}

// --- semicírculo SVG con progreso ---

interface ArcGaugeProps {
    value: 1 | 2 | 3 | 4 | 5;
    label: string;
    colors: ArcColors;
    inverted?: boolean;
}

function ArcGauge({ value, label, colors, inverted = false }: ArcGaugeProps) {
    const SIZE = 64;
    const STROKE = 5;
    const R = (SIZE - STROKE) / 2;
    const CX = SIZE / 2;
    const CY = SIZE / 2 + 4;

    const arcLength = Math.PI * R;
    const progress = ((value - 1) / 4) * arcLength;
    const displayProgress = inverted ? arcLength - progress + (arcLength / 4) : progress;
    const displayRemaining = arcLength - displayProgress;

    const arcPath = `M ${CX - R},${CY} A ${R},${R} 0 0,1 ${CX + R},${CY}`;

    return (
        <div className="flex flex-col items-center gap-0.5" style={{ width: SIZE }}>
            <div className="relative" style={{ width: SIZE, height: SIZE / 2 + 8 }}>
                <svg
                    width={SIZE}
                    height={SIZE / 2 + 8}
                    viewBox={`0 0 ${SIZE} ${SIZE / 2 + 10}`}
                    overflow="visible"
                >
                    <path
                        d={arcPath}
                        fill="none"
                        stroke="#e7e5e4"
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                    />
                    <path
                        d={arcPath}
                        fill="none"
                        stroke={colors.stroke}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        strokeDasharray={`${displayProgress} ${displayRemaining + 999}`}
                    />
                </svg>
                <div className="absolute inset-0 flex items-end justify-center pb-0.5">
                    <span className={`text-base font-black leading-none ${colors.text}`}>{value}</span>
                </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 leading-none">
                {label}
            </span>
        </div>
    );
}

// --- cara de ánimo ---

type MoodLevel = 'good' | 'neutral' | 'bad';

function moodLevel(value: 1 | 2 | 3 | 4 | 5): MoodLevel {
    if (value >= 4) return 'good';
    if (value === 3) return 'neutral';
    return 'bad';
}

function MoodFace({ value }: { value: 1 | 2 | 3 | 4 | 5 }) {
    const level = moodLevel(value);

    const config: Record<MoodLevel, { bg: string; color: string; mouthD: string }> = {
        good:    { bg: '#f0fdf4', color: '#16a34a', mouthD: 'M 9,14 Q 12,18 15,14' },
        neutral: { bg: '#fffbeb', color: '#d97706', mouthD: 'M 9,15 Q 12,15 15,15' },
        bad:     { bg: '#fef2f2', color: '#dc2626', mouthD: 'M 9,16 Q 12,12 15,16' },
    };

    const { bg, color, mouthD } = config[level];

    return (
        <div className="flex flex-col items-center gap-0.5" style={{ width: 64 }}>
            <div style={{ width: 40, height: 40, marginBottom: 2 }}>
                <svg viewBox="0 0 24 24" width={40} height={40}>
                    <circle cx="12" cy="12" r="11" fill={bg} stroke={color} strokeWidth="1" />
                    <circle cx="8.5" cy="10" r="1.3" fill={color} />
                    <circle cx="15.5" cy="10" r="1.3" fill={color} />
                    <path d={mouthD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 leading-none">
                Ánimo
            </span>
        </div>
    );
}

// --- bloque vacío cuando no hay checkin ---

function NoCheckin() {
    return (
        <div className="flex items-center justify-center gap-3 w-[208px] h-[48px]">
            <ChatBubbleBottomCenterTextIcon className="w-12 h-12 flex-shrink-0 text-stone-300" />
            <span className="text-base font-semibold text-stone-300 leading-tight">
                Sin valoración
            </span>
        </div>
    );
}

// --- componente principal ---

export default function SessionCard({ session }: ISessionCardProps) {
    const duration = session.endAt
        ? formatElapsed(calcDurationSeconds(session.startAt, session.endAt))
        : null;

    const distanceLabel =
        session.distance !== null ? formatDistance(session.distance) : null;

    const { checkin } = session;

    return (
        <div className="flex items-center bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow transition-shadow duration-300 px-5 py-4 gap-6">

            {/* Bloque izquierdo: indicadores de estado */}
            <div className="flex flex-col items-center justify-center flex-shrink-0">
                {checkin ? (
                    <>
                        <div className="flex items-end gap-2">
                            <ArcGauge
                                value={checkin.energy}
                                label="Energía"
                                colors={energyArcColors(checkin.energy)}
                            />
                            <MoodFace value={checkin.mood} />
                            <ArcGauge
                                value={checkin.stress}
                                label="Estrés"
                                colors={stressArcColors(checkin.stress)}
                                inverted
                            />
                        </div>
                        {checkin.notes && (
                            <p className="text-[11px] italic text-stone-400 text-center mt-2 max-w-[200px] leading-tight line-clamp-2">
                                &ldquo;{checkin.notes}&rdquo;
                            </p>
                        )}
                    </>
                ) : (
                    <NoCheckin />
                )}
            </div>

            {/* Separador vertical */}
            <div className="self-stretch w-px bg-stone-200 flex-shrink-0" />

            {/* Bloque derecho: info de la ruta */}
            <div className="flex flex-col min-w-0">
                <p className="text-xs text-stone-500 tracking-wide">{formatDate(session.startAt)}</p>

                <div className="truncate mt-0.5">
                    <Link
                        href={`/route/${session.slug}`}
                        className="font-bold text-base text-teal-700 hover:underline decoration-teal-700 transition-all duration-150"
                    >
                        {session.title}
                    </Link>
                </div>

                {(duration || distanceLabel || session.category) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {session.category && (
                            <span className="flex items-center gap-1 bg-lime-50 text-lime-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-lime-100 capitalize">
                                <TagIcon className="w-3 h-3 shrink-0" />
                                {session.category}
                            </span>
                        )}
                        {duration && (
                            <span className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-100">
                                <ClockIcon className="w-3 h-3 shrink-0" />
                                {duration}
                            </span>
                        )}
                        {distanceLabel && (
                            <span className="flex items-center gap-1 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-1 rounded-full border border-sky-100">
                                <MapPinIcon className="w-3 h-3 shrink-0" />
                                {distanceLabel}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
