'use client';

import { useState } from 'react';
import { useSubscription } from '@/queries/stripeQuery';
import { useCancelSubscription } from '@/mutations/stripeMutation';
import Link from 'next/link';
import { FcCheckmark, FcInfo, FcCancel } from 'react-icons/fc';

import { useAuth } from '@/hooks/useAuth';

export default function MySubscription({ username }: { username: string }) {
    const { currentUser } = useAuth();
    const customerId = currentUser?.user?.client?.customerId || null;

    // Query para obtener la información de la suscripción
    const { data: subscription, isLoading, isError } = useSubscription(customerId);

    // Mutation para cancelar suscripción
    const cancelSubscriptionMutation = useCancelSubscription();

    // Estado para confirmación
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Funciones de formateo y manejo
    const formatDate = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCancelConfirm = () => {
        setShowConfirmation(true);
    };

    const handleCancelSubscription = () => {
        if (!customerId) return;

        cancelSubscriptionMutation.mutateAsync(customerId, {
            onSuccess: () => {
                setShowConfirmation(false);
            }
        });
    };

    if (isLoading) return <p>Cargando información de suscripción...</p>;

    if (isError) return <p>Error al cargar la información de suscripción.</p>;

    return (
        <div className="w-full py-2">
            {!subscription || subscription.status !== 'active' ? (
                <div className="bg-white px-7 py-6 rounded-2xl border border-stone-200 text-stone-700">
                    <p className="mb-3">No tienes una suscripción activa.</p>
                    <Link
                        href="/premium"
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                    >
                        Ver planes disponibles
                    </Link>
                </div>
            ) : (
                <div className="bg-white px-8 pt-6 pb-7 rounded-2xl border border-stone-200 text-stone-600">
                    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-4 mb-4 text-left">
                        <div>
                            <p className="text-sm text-stone-500">ID de la suscripción</p>
                            <p className="font-semibold">{subscription.subscriptionId}</p>
                        </div>

                        <div>
                            <p className="text-sm text-stone-500">Estado</p>
                            {subscription.status === 'active' ? (
                                <p className="font-semibold text-lime-600">Activo</p>
                            ) : (
                                <p className="font-semibold text-red-600">Desactivo</p>
                            )}
                        </div>

                        <div>
                            <p className="text-sm text-stone-500">Plan</p>
                            <p className="font-semibold">{subscription.productName}</p>
                        </div>

                        <div>
                            <p className="text-sm text-stone-500">Precio</p>
                            <p className="font-semibold">
                                {new Intl.NumberFormat('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR'
                                }).format((subscription.subscriptionType == "monthly" ? 199 : 1199) / 100)}

                                <span className="text-sm ml-1">
                                    /{subscription.billingInterval === 'month' ? 'mes' : 'año'}
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-stone-500">Fecha de inicio</p>
                            <p className="font-semibold">{formatDate(subscription.currentPeriodStart)}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-stone-500">Próximo pago</p>
                            <p className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
                        </div>
                    </div>

                    {subscription.cancelAtPeriodEnd && (
                        <div className="bg-yellow-50 p-3 rounded-md mb-4 text-sm text-yellow-800">
                            Tu suscripción finalizará el {formatDate(subscription.currentPeriodEnd)}.
                            Hasta entonces seguirás teniendo acceso a todas las funciones Premium.
                        </div>
                    )}

                    {!subscription.cancelAtPeriodEnd ? (
                        showConfirmation ? (
                            <div className="flex flex-col">
                                <p className="text-sm text-stone-500 mb-2">¿Estás seguro de que deseas cancelar tu suscripción?</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowConfirmation(false)}
                                        className="px-3 py-1 rounded-full border-2 border-lime-600 text-sm font-bold
                                        text-lime-600 hover:bg-lime-600/80 hover:text-white transition duration-150 ease-in-out"
                                        disabled={cancelSubscriptionMutation.isPending}
                                    >
                                        No, mantener
                                    </button>
                                    <button
                                        onClick={handleCancelSubscription}
                                        className="px-3 py-1 rounded-full border-2 border-red-600/80 text-sm font-bold
                                        text-red-600/80 hover:bg-red-600/80 hover:text-white transition duration-150 ease-in-out"
                                        disabled={cancelSubscriptionMutation.isPending}
                                    >
                                        {cancelSubscriptionMutation.isPending ? 'Procesando...' : 'Sí, cancelar'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleCancelConfirm}
                                className="px-3 py-1 mt-1.5 rounded-full border-2 border-red-600/80 text-sm font-bold
                                text-red-600/80 hover:bg-red-600/80 hover:text-white transition duration-150 ease-in-out"
                            >
                                Cancelar suscripción
                            </button>
                        )
                    ) : null}
                </div>
            )}
        </div>
    );
}
