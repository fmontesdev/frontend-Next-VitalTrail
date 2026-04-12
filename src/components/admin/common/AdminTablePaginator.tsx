'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface IAdminTablePaginatorProps {
    /** First record number shown (e.g. 1, 11, 21…) */
    displayFrom: number;
    /** Last record number shown (e.g. 10, 20…) */
    displayTo: number;
    /** Total number of records matching the current filter */
    total: number;
    /** Label for the entity type, e.g. "rutas", "usuarios", "suscripciones" */
    entityLabel: string;
    /** Whether the "Anterior" button should be disabled */
    prevDisabled: boolean;
    /** Whether the "Siguiente" button should be disabled */
    nextDisabled: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export default function AdminTablePaginator({
    displayFrom,
    displayTo,
    total,
    entityLabel,
    prevDisabled,
    nextDisabled,
    onPrev,
    onNext,
}: IAdminTablePaginatorProps) {
    return (
        <div className="flex items-center justify-between mt-4 text-sm text-stone-500">
            <span>
                {total > 0
                    ? `${displayFrom} - ${displayTo} de ${total} ${entityLabel}`
                    : `0 ${entityLabel}`
                }
            </span>
            <div className="flex gap-1">
                {prevDisabled ? (
                    <div className="px-1.5 py-1.5 rounded-full bg-stone-200 text-stone-400 cursor-not-allowed">
                        <ChevronLeftIcon strokeWidth={3} className="w-5 h-5" />
                    </div>
                ) : (
                    <button
                        onClick={onPrev}
                        className="px-1.5 py-1.5 rounded-full bg-lime-600 text-white hover:bg-lime-700 transition-colors"
                    >
                        <ChevronLeftIcon strokeWidth={3} className="w-5 h-5" />
                    </button>
                )}
                {nextDisabled ? (
                    <div className="px-1.5 py-1.5 rounded-full bg-stone-200 text-stone-400 cursor-not-allowed">
                        <ChevronRightIcon strokeWidth={3} className="w-5 h-5" />
                    </div>
                ) : (
                    <button
                        onClick={onNext}
                        className="px-1.5 py-1.5 rounded-full bg-lime-600 text-white hover:bg-lime-700 transition-colors"
                    >
                        <ChevronRightIcon strokeWidth={3} className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
