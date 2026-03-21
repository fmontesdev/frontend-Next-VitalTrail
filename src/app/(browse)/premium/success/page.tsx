'use client';

import { useSearchParams } from 'next/navigation';
import { useStripeSession } from '@/queries/stripeQuery';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FcOk, FcHighPriority } from 'react-icons/fc';
import { getImageUrl } from '@/shared/utils/imageUrl';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    const { 
        data: sessionData, 
        isLoading, 
        isError 
    } = useStripeSession(sessionId);
    
    // Estado derivado para mostrar el estado correcto
    const status = isLoading 
        ? 'loading' 
        : isError 
            ? 'error' 
            : (sessionData?.status === 'complete') 
                ? 'success' 
                : 'error';

    // Función para formatear fechas
    const formatDate = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    return (
        <main className="min-h-[calc(100vh-64px-64px)] w-full flex items-center justify-center"
            style={{ 
                backgroundImage: `url(${getImageUrl('background', 'subscription_success.webp')})`,
                backgroundSize: '100% auto', // Estira al ancho completo sin recortar altura
                backgroundPosition: 'center top', // Posiciona desde arriba
                backgroundRepeat: 'no-repeat', // Evita que se repita
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                // backgroundAttachment: 'fixed', // Mantiene la imagen fija al hacer scroll
            }}
        >
            <div className="max-w-3xl container mx-auto px-4 py-14">
                {status === 'loading' && (
                    <div className="text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-white text-3xl font-semibold">Procesando tu pago...</p>
                    </div>
                )}
                
                {status === 'success' && sessionData && (
                    <div className="bg-white text-center px-11 pt-8 pb-11 rounded-3xl shadow-xl">
                        <div className="inline-flex items-center justify-center mb-3">
                            <FcOk className="w-20 h-20 opacity-80" />
                            <h1 className="text-4xl font-bold text-teal-700 pl-6">¡Suscripción activada!</h1>
                        </div>
                        <p className="text-xl font-medium text-stone-500 mb-6">
                            Tu cuenta ha sido actualizada exitósamente a Premium<br/>
                            ¡Ahora puedes disfrutar de todos los beneficios!
                        </p>

                        {/* Detalles de la suscripción */}
                        <div className="bg-stone-100 rounded-2xl px-10 py-6 border-stone-200 border text-stone-700">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-4 text-left">
                                <div>
                                    <p className="text-sm text-stone-500">ID de la suscripción</p>
                                    <p className="font-medium">{sessionData.subscriptionId}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-stone-500">Estado</p>
                                    {sessionData.subscriptionStatus === 'active' ? (
                                        <p className="font-medium text-lime-600">Activo</p>
                                    ) : (
                                        <p className="font-medium text-red-600">Desactivo</p>
                                    )}
                                </div>
                                
                                <div>
                                    <p className="text-sm text-stone-500">Plan</p>
                                    <p className="font-medium">{sessionData.productName}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-stone-500">Precio</p>
                                    <p className="font-medium">
                                        {new Intl.NumberFormat('es-ES', {
                                            style: 'currency',
                                            currency: sessionData.currency || 'EUR'
                                        }).format((sessionData.priceAmount || 0) / 100)}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-stone-500">Fecha de inicio</p>
                                    <p className="font-medium">{formatDate(sessionData.currentPeriodStart)}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-stone-500">Próximo pago</p>
                                    <p className="font-medium">{formatDate(sessionData.currentPeriodEnd)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="bg-white text-center px-11 pt-8 pb-11 rounded-3xl shadow-xl">
                        <div className="inline-flex items-center justify-center mb-6">
                            <FcHighPriority className="w-20 h-20 opacity-80" />
                            <h1 className="text-4xl font-bold text-red-700 pl-6">Hubo un problema</h1>
                        </div>
                        
                        <p className="text-xl font-medium text-stone-500">
                            No pudimos confirmar tu suscripción.
                            Si ya realizaste el pago, por favor contacta con nuestro equipo de soporte.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
