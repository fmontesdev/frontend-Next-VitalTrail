'use client';

import { useState, useEffect, type ComponentType } from 'react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ArrowsRightLeftIcon,
    ClockIcon,
    SunIcon,
    BoltIcon,
    FireIcon,
    ArrowLongRightIcon,
    TagIcon,
    MapPinIcon,
    PencilSquareIcon,
    DocumentTextIcon,
    MapIcon,
} from '@heroicons/react/24/outline';
import { ICreateRoute } from '@/shared/interfaces/entities/route.interface';
import { formatDistance } from '@/shared/utils/distance';

interface IStep6ReviewProps {
    values: ICreateRoute;
    onSubmit: () => void;
    onBack: () => void;
    isSubmitting: boolean;
    submitError: string | null;
}

function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// Configuraciones visuales de dificultad y tipo
interface IDifficultyConfig {
    label: string;
    Icon: ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
    valueColor: string;
}

const DIFFICULTY_CONFIG: Record<ICreateRoute['difficulty'], IDifficultyConfig> = {
    'fácil': {
        label: 'Fácil',
        Icon: SunIcon,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        valueColor: 'text-green-700',
    },
    'moderada': {
        label: 'Moderada',
        Icon: BoltIcon,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        valueColor: 'text-yellow-700',
    },
    'difícil': {
        label: 'Difícil',
        Icon: FireIcon,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        valueColor: 'text-orange-700',
    },
    'experto': {
        label: 'Experto',
        Icon: ExclamationTriangleIcon,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        valueColor: 'text-red-700',
    },
};

// Subcomponente SummaryCard
interface ISummaryCardProps {
    Icon: ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string;
    valueColor?: string;
    valueClassName?: string;
}

function SummaryCard({ Icon, iconBg, iconColor, label, value, valueColor = 'text-gray-800', valueClassName = '' }: ISummaryCardProps) {
    return (
        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-3xl p-4 shadow-sm">
            <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className={`text-base font-bold ${valueColor} truncate ${valueClassName}`}>{value}</p>
            </div>
        </div>
    );
}

// Componente principal
export default function Step6Review({
    values,
    onSubmit,
    onBack,
    isSubmitting,
    submitError,
}: IStep6ReviewProps) {
    const hasCoords = values.coordinates.length >= 2;
    const diffConfig = DIFFICULTY_CONFIG[values.difficulty];

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const urls = values.images.map((file) => URL.createObjectURL(file));
        setImageUrls(urls);
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [values.images]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-teal-700 mb-0.5">Resumen de la ruta</h2>
                <p className="text-gray-500 text-sm">
                    Revisa todos los datos antes de crear la ruta.
                </p>
            </div>

            {/* Tarjeta hero — título + localización */}
            <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 p-5 text-white shadow-md">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <PencilSquareIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-teal-200 uppercase tracking-wider mb-1">Título</p>
                        <p className="text-base font-bold text-white leading-snug">
                            {values.title || '—'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-teal-100 border-t border-white/20 pt-3">
                    <MapPinIcon className="w-5 h-5 text-teal-300 shrink-0" />
                    <span className="text-base">{values.location || '—'}</span>
                </div>
            </div>

            {/* Imágenes seleccionadas */}
            {imageUrls.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-400 mb-2">
                        Imágenes ({imageUrls.length})
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                        {imageUrls.map((url, i) => (
                            <div key={i} className="aspect-square rounded-3xl overflow-hidden border border-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element -- blob URL local, next/image no soporta object URLs */}
                                <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grid de tarjetas de datos */}
            <div className="grid grid-cols-2 gap-3">
                <SummaryCard
                    Icon={ArrowsRightLeftIcon}
                    iconBg="bg-teal-100"
                    iconColor="text-teal-600"
                    label="Distancia"
                    value={values.distance > 0 ? formatDistance(values.distance) : '—'}
                    valueColor="text-teal-700"
                />
                <SummaryCard
                    Icon={ClockIcon}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                    label="Duración"
                    value={values.duration > 0 ? formatDuration(values.duration) : '—'}
                    valueColor="text-blue-700"
                />
                <SummaryCard
                    Icon={diffConfig.Icon}
                    iconBg={diffConfig.iconBg}
                    iconColor={diffConfig.iconColor}
                    label="Dificultad"
                    value={diffConfig.label}
                    valueColor={diffConfig.valueColor}
                />
                <SummaryCard
                    Icon={ArrowLongRightIcon}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    label="Tipo de ruta"
                    value={values.typeRoute === 'circular' ? 'Circular' : 'Solo ida'}
                    valueColor="text-purple-700"
                />
                <SummaryCard
                    Icon={TagIcon}
                    iconBg="bg-lime-100"
                    iconColor="text-lime-600"
                    label="Categoría"
                    value={values.categoryTitle || '—'}
                    valueColor="text-lime-700"
                    valueClassName="capitalize"
                />
                <SummaryCard
                    Icon={MapIcon}
                    iconBg="bg-gray-100"
                    iconColor="text-gray-500"
                    label="Puntos en el mapa"
                    value={
                        hasCoords
                            ? `${values.coordinates.length} puntos`
                            : `${values.coordinates.length} punto${values.coordinates.length === 1 ? '' : 's'} (mín. 2)`
                    }
                    valueColor={hasCoords ? 'text-gray-800' : 'text-red-600'}
                />
            </div>

            {/* Descripción — full width */}
            <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-3xl p-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Descripción</p>
                    <p className="text-base font-medium text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {values.description || '—'}
                    </p>
                </div>
            </div>

            {/* Error de envío */}
            {submitError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{submitError}</p>
                </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between mt-2">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 px-6 py-2.5 rounded-full font-medium transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Anterior
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting || !hasCoords}
                    className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
                >
                    {isSubmitting ? (
                        <>
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            Creando...
                        </>
                    ) : (
                        <>
                            <CheckIcon className="w-4 h-4" />
                            Crear Ruta
                            <ArrowRightIcon className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
