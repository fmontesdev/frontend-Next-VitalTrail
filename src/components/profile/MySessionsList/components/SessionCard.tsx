'use client';

import Link from 'next/link';
import type { FC, SVGProps } from 'react';
import { MapIcon, CheckCircleIcon, ExclamationCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon, MapPinIcon, BoltIcon, FaceSmileIcon, HeartIcon } from '@heroicons/react/24/outline';
import { IRouteSessionSummary, IWellbeingCheckin } from '@/shared/interfaces/entities/routeSession.interface';
import { parseSessionDate, formatElapsed } from '@/shared/utils/sessionDate';
import { formatDistance } from '@/shared/utils/distance';

interface ISessionCardProps {
    session: IRouteSessionSummary;
}

type HeroIcon = FC<SVGProps<SVGSVGElement>>;

// --- media normalizada (energy y mood: 5=bueno; stress: 1=bueno → 6-stress) ---

function checkinAvg(checkin: IWellbeingCheckin): number {
    return (checkin.energy + checkin.mood + (6 - checkin.stress)) / 3;
}

// --- icono y colores del estado general ---

interface StateConfig {
    Icon: HeroIcon;
    iconColor: string;
    iconBg: string;
}

function resolveStateConfig(checkin: IWellbeingCheckin | null): StateConfig {
    if (!checkin) {
        return { Icon: MapIcon, iconColor: 'text-stone-400', iconBg: 'bg-stone-100' };
    }
    const avg = checkinAvg(checkin);
    if (avg <= 2) return { Icon: ExclamationCircleIcon, iconColor: 'text-red-500',   iconBg: 'bg-red-50' };
    if (avg < 4)  return { Icon: MinusCircleIcon,       iconColor: 'text-amber-500', iconBg: 'bg-amber-50' };
    return             { Icon: CheckCircleIcon,          iconColor: 'text-lime-600',  iconBg: 'bg-lime-50' };
}

// --- gradiente del acento izquierdo ---

function accentGradient(checkin: IWellbeingCheckin | null): string {
    if (!checkin) return 'from-stone-300 to-stone-400';
    const avg = checkinAvg(checkin);
    if (avg <= 2) return 'from-red-400 to-red-500';
    if (avg < 4)  return 'from-amber-400 to-amber-500';
    return 'from-lime-400 to-lime-600';
}

// --- colores por valor individual ---

interface ValueColors { text: string; bg: string; border: string }

function energyMoodColors(value: 1 | 2 | 3 | 4 | 5): ValueColors {
    if (value <= 2) return { text: 'text-red-500',   bg: 'bg-red-50',   border: 'border-red-200' };
    if (value === 3) return { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
    return                  { text: 'text-lime-600',  bg: 'bg-lime-50',  border: 'border-lime-200' };
}

// Stress: valor alto = malo (invertido)
function stressColors(value: 1 | 2 | 3 | 4 | 5): ValueColors {
    if (value >= 4) return { text: 'text-red-500',   bg: 'bg-red-50',   border: 'border-red-200' };
    if (value === 3) return { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
    return                  { text: 'text-lime-600',  bg: 'bg-lime-50',  border: 'border-lime-200' };
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

// --- componente de burbuja para cada valor del checkin ---

interface CheckinBubbleProps {
    Icon: HeroIcon;
    value: 1 | 2 | 3 | 4 | 5;
    label: string;
    colors: ValueColors;
}

function CheckinBubble({ Icon, value, label, colors }: CheckinBubbleProps) {
    return (
        <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center gap-0.5 border ${colors.border} ${colors.bg} shadow-sm flex-shrink-0`}>
            {/* Icono a la izquierda del número */}
            <div className="flex items-center gap-1 pb-0.5">
                <Icon className={`w-5 h-5 flex-shrink-0 ${colors.text}`} />
                <span className={`text-2xl font-black leading-none ${colors.text}`}>{value}</span>
            </div>
            {/* Etiqueta inferior */}
            <span className={`text-[9px] font-bold uppercase tracking-wider leading-none ${colors.text} opacity-60`}>
                {label}
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
    const { Icon: StateIcon, iconColor, iconBg } = resolveStateConfig(checkin);
    const accent = accentGradient(checkin);

    return (
        // items-center centra verticalmente el contenido.
        // El acento usa self-stretch para ocupar el alto completo independientemente.
        <div className="flex items-center bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">

            {/* Barra de acento — self-stretch para ocupar el alto completo */}
            <div className={`self-stretch w-1.5 bg-gradient-to-b flex-shrink-0 ${accent}`} />

            {/* Contenido principal: icono estado + info */}
            <div className="flex items-center gap-4 flex-1 min-w-0 px-4 py-4">

                {/* Icono representativo del estado general */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${iconBg}`}>
                    <StateIcon className={`w-9 h-9 ${iconColor}`} />
                </div>

                {/* Título, fecha y chips */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-500 tracking-wide">{formatDate(session.startAt)}</p>

                    {/* div con truncate; Link inline → solo el texto es clicable */}
                    <div className="truncate mt-0.5">
                        <Link
                            href={`/route/${session.slug}`}
                            className="font-bold text-base text-teal-700 hover:underline decoration-teal-700 transition-all duration-150"
                        >
                            {session.title}
                        </Link>
                    </div>

                    {(duration || distanceLabel) && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
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

            {/* Burbujas del checkin — tamaño fijo, alineadas desde el margen derecho */}
            {checkin && (
                <div className="flex items-center gap-4 flex-shrink-0 px-3">
                    <CheckinBubble
                        Icon={BoltIcon}
                        value={checkin.energy}
                        label="Energía"
                        colors={energyMoodColors(checkin.energy)}
                    />
                    <CheckinBubble
                        Icon={FaceSmileIcon}
                        value={checkin.mood}
                        label="Ánimo"
                        colors={energyMoodColors(checkin.mood)}
                    />
                    <CheckinBubble
                        Icon={HeartIcon}
                        value={checkin.stress}
                        label="Estrés"
                        colors={stressColors(checkin.stress)}
                    />
                </div>
            )}
        </div>
    );
}
