'use client';

import { useState } from 'react';
import { useSubscription } from '@/queries/stripeQuery';
import { useCancelAtPeriodEnd, useReactivateSubscription } from '@/mutations/stripeMutation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
    CalendarDaysIcon,
    CreditCardIcon,
    SparklesIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const CARD_BRAND_LABELS: Record<string, string> = {
    visa: 'VISA',
    mastercard: 'MC',
    amex: 'AMEX',
    discover: 'DISC',
    unionpay: 'UP',
};

export default function MySubscription() {
    const { currentUser } = useAuth();
    const customerId = currentUser?.user?.client?.customerId || null;

    const { data: subscription, isLoading, isError } = useSubscription(customerId);
    const cancelAtPeriodEndMutation = useCancelAtPeriodEnd();
    const reactivateMutation = useReactivateSubscription();

    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const formatDate = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleCancelAtPeriodEnd = () => {
        if (!customerId) return;
        cancelAtPeriodEndMutation.mutate(customerId, {
            onSuccess: () => setShowCancelConfirm(false),
        });
    };

    const handleReactivate = () => {
        if (!customerId) return;
        reactivateMutation.mutate(customerId);
    };

    const cardBrandLabel = (brand: string) =>
        CARD_BRAND_LABELS[brand?.toLowerCase()] ?? brand?.toUpperCase() ?? '—';

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div className="w-full py-2 animate-pulse">
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <div className="h-1 bg-stone-200" />
                    <div className="px-8 py-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-3 w-20 bg-stone-100 rounded" />
                                <div className="h-5 w-44 bg-stone-200 rounded" />
                                <div className="h-4 w-24 bg-stone-100 rounded" />
                            </div>
                            <div className="h-6 w-20 bg-stone-100 rounded-full" />
                        </div>
                        <div className="h-px bg-stone-100" />
                        <div className="h-4 w-72 bg-stone-100 rounded" />
                        <div className="h-4 w-56 bg-stone-100 rounded" />
                        <div className="h-px bg-stone-100" />
                        <div className="h-4 w-36 bg-stone-100 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (isError) {
        return (
            <div className="w-full py-2">
                <div className="bg-white rounded-2xl border border-red-100 px-8 py-6 text-sm text-red-400">
                    No se pudo cargar la información de suscripción.
                </div>
            </div>
        );
    }

    /* ── Sin suscripción activa ── */
    if (!subscription || subscription.status !== 'active') {
        return (
            <div className="w-full py-2">
                <div className="bg-white rounded-2xl border border-stone-200 px-8 py-10 flex flex-col items-center text-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-stone-100 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-stone-400" />
                    </div>
                    <div>
                        <p className="text-stone-600 font-medium text-sm">Sin suscripción activa</p>
                        <p className="text-stone-400 text-xs mt-0.5">Descubre los planes Premium disponibles.</p>
                    </div>
                    <Link
                        href="/premium"
                        className="inline-block px-5 py-2 bg-lime-600 text-white text-sm font-semibold rounded-full hover:bg-lime-700 transition mt-1"
                    >
                        Ver planes disponibles
                    </Link>
                </div>
            </div>
        );
    }

    const isCancelling = subscription.cancelAtPeriodEnd;
    const priceAmount = subscription.billingInterval === 'month' ? 199 : 1199;
    const formattedPrice = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(priceAmount / 100);
    const intervalLabel = subscription.billingInterval === 'month' ? 'mes' : 'año';

    return (
        <div className="w-full py-2">
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

                {/* Barra de acento superior — cambia color según estado */}
                <div className={`h-1 ${isCancelling ? 'bg-amber-400' : 'bg-lime-500'}`} />

                <div className="px-8 pt-6 pb-7">

                    {/* Cabecera: nombre del plan + badge de estado */}
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold mb-1">
                                Plan activo
                            </p>
                            <h3 className="text-xl font-bold text-teal-700 leading-tight">
                                {subscription.productName}
                            </h3>
                            <p className="text-sm text-stone-500 font-medium mt-0.5">
                                {formattedPrice}
                                <span className="text-stone-500 font-medium">/{intervalLabel}</span>
                            </p>
                        </div>

                        {isCancelling ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 mt-0.5">
                                <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                                Cancela al final del período
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-lime-50 text-lime-700 border border-lime-200 mt-0.5">
                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                Activo
                            </span>
                        )}
                    </div>

                    <div className="border-t border-stone-100 mb-5" />

                    {/* Filas de datos con ícono + etiqueta + valor */}
                    <div className="space-y-3.5 mb-5">
                        <div className="flex items-center gap-3 text-sm">
                            <CalendarDaysIcon className="w-5 h-5 text-stone-400 flex-shrink-0" />
                            <span className="text-stone-500 w-36 flex-shrink-0">
                                {isCancelling ? 'Acceso hasta' : 'Próxima renovación'}
                            </span>
                            <span className="text-stone-700 font-semibold">
                                {formatDate(subscription.currentPeriodEnd)}
                            </span>
                        </div>

                        {subscription.cardLast4 && (
                            <div className="flex items-center gap-3 text-sm">
                                <CreditCardIcon className="w-5 h-5 text-stone-400 flex-shrink-0" />
                                <span className="text-stone-500 w-36 flex-shrink-0">Método de pago</span>
                                <span className="flex items-center gap-2 text-stone-700 font-semibold">
                                    <span className="inline-block bg-stone-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                                        {cardBrandLabel(subscription.cardBrand)}
                                    </span>
                                    •••• {subscription.cardLast4}
                                    <span className="text-stone-500 font-normal">
                                        exp. {subscription.cardExpMonth}/{subscription.cardExpYear}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-stone-100 mb-5" />

                    {/* Zona de acción: cancelar / reactivar */}
                    {isCancelling ? (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                                Acceso garantizado hasta el{' '}
                                <span className="text-stone-700 font-semibold">
                                    {formatDate(subscription.currentPeriodEnd)}
                                </span>.
                            </p>
                            <button
                                onClick={handleReactivate}
                                disabled={reactivateMutation.isPending}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                                    text-sm font-semibold bg-lime-600 hover:bg-lime-700 text-white
                                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowPathIcon className="w-3.5 h-3.5" />
                                {reactivateMutation.isPending ? 'Procesando...' : 'Reactivar suscripción'}
                            </button>
                        </div>
                    ) : showCancelConfirm ? (
                        <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5">
                            <p className="text-sm text-stone-500 mb-3 leading-relaxed">
                                Seguirás teniendo acceso completo hasta el{' '}
                                <span className="text-stone-700 font-medium">
                                    {formatDate(subscription.currentPeriodEnd)}
                                </span>. ¿Confirmas la cancelación?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowCancelConfirm(false)}
                                    disabled={cancelAtPeriodEndMutation.isPending}
                                    className="px-4 py-2 rounded-full text-sm font-semibold
                                        bg-lime-600 hover:bg-lime-700 text-white transition-colors disabled:opacity-50"
                                >
                                    No, mantener
                                </button>
                                <button
                                    onClick={handleCancelAtPeriodEnd}
                                    disabled={cancelAtPeriodEndMutation.isPending}
                                    className="px-4 py-2 rounded-full text-sm font-semibold
                                        bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                                >
                                    {cancelAtPeriodEndMutation.isPending ? 'Procesando...' : 'Sí, cancelar renovación'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            className="text-sm font-medium text-stone-500 hover:text-red-500 transition-colors
                                underline underline-offset-2 decoration-stone-300 hover:decoration-red-300"
                        >
                            Cancelar renovación automática
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
