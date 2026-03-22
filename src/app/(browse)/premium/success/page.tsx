'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStripeSession } from '@/queries/stripeQuery';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { getImageUrl } from '@/shared/utils/imageUrl';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
    SparklesIcon,
    CalendarDaysIcon,
    CurrencyEuroIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    const { data: sessionData, isLoading, isError } = useStripeSession(sessionId);

    const status = isLoading
        ? 'loading'
        : isError
            ? 'error'
            : (sessionData?.status === 'complete')
                ? 'success'
                : 'error';

    // Redirige al listado de rutas tras 3.5 segundos en estado success
    useEffect(() => {
        if (status !== 'success') return;
        const timer = setTimeout(() => router.push('/routes'), 3500);
        return () => clearTimeout(timer);
    }, [status, router]);

    const formatDate = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const intervalLabel = sessionData?.billingInterval === 'month' ? 'mes' : 'año';
    const formattedPrice = sessionData?.priceAmount
        ? new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: sessionData.currency || 'EUR',
        }).format(sessionData.priceAmount / 100)
        : null;

    return (
        <main
            className="min-h-[calc(100vh-64px-64px)] w-full flex items-center justify-center"
            style={{
                backgroundImage: `url(${getImageUrl('background', 'subscription_success.webp')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
        >
            <div className="w-full max-w-lg mx-auto px-4 py-14">

                {/* ── Loading ── */}
                {status === 'loading' && (
                    <div className="text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-white text-2xl font-semibold">
                            Procesando tu pago...
                        </p>
                    </div>
                )}

                {/* ── Éxito ── */}
                {status === 'success' && sessionData && (
                    <div className="animate-fade-up bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xl">
                        <div className="px-12 pt-10 pb-11">

                            {/* Cabecera */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-6">
                                    <CheckCircleIcon className="w-8 h-8 text-lime-500 flex-shrink-0" />
                                    <div>
                                        <p className="pl-2 text-[11px] text-stone-500 uppercase tracking-widest font-semibold">
                                            Pago confirmado
                                        </p>
                                        <h1 className="text-3xl font-bold text-teal-700 leading-tight">
                                            ¡Suscripción activada!
                                        </h1>
                                    </div>
                                </div>
                                {/* <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-lime-50 text-lime-700 border border-lime-200 mt-0.5 flex-shrink-0">
                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                    Activo
                                </span> */}
                            </div>

                            <p className="text-base text-center text-stone-500 mb-6 leading-relaxed">
                                Ya eres Premium.
                                <br/>
                                Disfruta de todos los beneficios de VitalTrail.
                            </p>

                            <div className="border-t border-stone-100 mb-6" />

                            {/* Filas de datos */}
                            <div className="space-y-3.5 mb-5">
                                <div className="flex items-center gap-3 text-[15px]">
                                    <SparklesIcon className="w-6 h-6 text-stone-400 flex-shrink-0" />
                                    <span className="text-stone-500 w-32 flex-shrink-0">Plan</span>
                                    <span className="text-stone-700 font-semibold">
                                        {sessionData.productName}
                                    </span>
                                </div>

                                {formattedPrice && (
                                    <div className="flex items-center gap-3 text-[15px]">
                                        <CurrencyEuroIcon className="w-6 h-6 text-stone-400 flex-shrink-0" />
                                        <span className="text-stone-500 w-32 flex-shrink-0">Precio</span>
                                        <span className="text-stone-700 font-semibold">
                                            {formattedPrice}
                                            <span className="text-stone-500 font-normal">/{intervalLabel}</span>
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 text-[15px]">
                                    <CalendarDaysIcon className="w-6 h-6 text-stone-400 flex-shrink-0" />
                                    <span className="text-stone-500 w-32 flex-shrink-0">Próxima renovación</span>
                                    <span className="text-stone-700 font-semibold">
                                        {formatDate(sessionData.currentPeriodEnd)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-stone-100 mb-6" />

                            {/* Countdown de redirección */}
                            <div className="space-y-2">
                                <p className="text-sm text-stone-500">
                                    Redirigiendo a explorar rutas...
                                </p>
                                <div className="bg-stone-100 rounded-full overflow-hidden h-0.5">
                                    <div className="h-full bg-lime-500 animate-countdown origin-left" />
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* ── Error ── */}
                {status === 'error' && (
                    <div className="animate-fade-up bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xl">

                        {/* Barra de acento roja */}
                        <div className="h-1 bg-red-400" />

                        <div className="px-8 pt-7 pb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <ExclamationTriangleIcon className="w-8 h-8 text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="text-[11px] text-stone-500 uppercase tracking-widest font-semibold mb-0.5">
                                        Pago no confirmado
                                    </p>
                                    <h1 className="text-2xl font-bold text-stone-700 leading-tight">
                                        Hubo un problema
                                    </h1>
                                </div>
                            </div>
                            <p className="text-[15px] text-stone-500 leading-relaxed">
                                No pudimos confirmar tu suscripción.
                                Si ya realizaste el pago, contacta con nuestro equipo de soporte.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
