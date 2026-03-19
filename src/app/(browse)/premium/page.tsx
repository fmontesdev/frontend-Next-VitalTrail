'use client';

import { useAuthGuard } from "@/services/guards/useAuthGuard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useCreateCheckoutSession } from '@/mutations/stripeMutation';
import { FcPicture, FcLandscape } from 'react-icons/fc';
import { GrFormCheckmark } from 'react-icons/gr';

// Acceder a las variables de entorno
const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '';
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID || '';

const SubscriptionPage = () => {
    const currentUser = useAuthGuard();
    const checkoutMutation = useCreateCheckoutSession();

    if (currentUser.isLoading) {
        return <LoadingSpinner />;
    }

    const handleSubscription = (priceId: string) => {
        checkoutMutation.mutate({ 
            priceId, 
            customerData: {
                email: currentUser.user!.email || '',
                customerId: currentUser.user!.client?.customerId || null
            }
        });
    };

    return (
        <main className="min-h-[calc(100vh-64px-64px)] w-full flex items-center justify-center"
            style={{ 
                backgroundImage: 'url("/backgrounds/subscriptions.jpg")',
                backgroundSize: '100% auto', // Estira al ancho completo sin recortar altura
                backgroundPosition: 'center top', // Posiciona desde arriba
                backgroundRepeat: 'no-repeat', // Evita que se repita
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                // backgroundAttachment: 'fixed', // Mantiene la imagen fija al hacer scroll
            }}
        >
            <div className="max-w-6xl mx-auto px-4 pt-10 pb-16">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white pb-4">Siéntete libre y explora</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* Plan mensual */}
                    <div
                        className="h-full bg-white rounded-3xl shadow-lg flex flex-col items-center text-center px-12 py-8 
                        cursor-pointer transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl"
                        onClick={() => handleSubscription(MONTHLY_PRICE_ID)}
                    >
                        <div className="mb-4">
                            <FcPicture className="w-20 h-20" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-700 mb-1">Plan mensual</h2>
                        <p className="text-lg font-medium text-stone-400 mb-2">Date rienda suelta</p>
                        <div className="text-5xl font-bold text-teal-700 my-4">
                            1,99
                            <span className="text-lg font-semibold text-stone-400">€/mes</span>
                        </div>

                        <ul className="space-y-2 mb-6 font-medium text-stone-500">
                            <li className="flex items-center justify-center gap-2">
                                <GrFormCheckmark className="w-6 h-6 text-lime-500" />
                                Característica 1
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <GrFormCheckmark className="w-6 h-6 text-lime-500" />
                                Característica 2
                            </li>
                        </ul>

                        {/* Espaciador flexible para empujar el botón hacia abajo */}
                        <div className="flex-grow"></div>

                        <div className="absolute -bottom-4 bg-lime-600 text-white font-semibold py-2 px-6 rounded-full">
                            Suscríbete
                        </div>
                    </div>

                    {/* Plan anual */}
                    <div
                        className="h-full bg-white rounded-3xl shadow-lg flex flex-col items-center text-center px-12 py-8 
                        cursor-pointer transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl"
                        onClick={() => handleSubscription(ANNUAL_PRICE_ID)}
                    >
                        <div className="absolute -top-4 bg-teal-600 font-semibold text-white px-7 py-2 rounded-full">
                            Mejor oferta
                        </div>
                        
                        <div className="mb-4">
                            <FcLandscape className="w-20 h-20" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-700 mb-1">Plan anual</h2>
                        <p className="text-lg font-medium text-stone-400 mb-2">Mas por menos</p>
                        <div className="text-5xl font-bold text-teal-700 my-4">
                            11,99
                            <span className="text-lg font-semibold text-stone-400">€/año</span>
                        </div>

                        <ul className="space-y-2 mb-6 text-gray-600">
                        <li className="flex items-center justify-center gap-2">
                                <GrFormCheckmark className="w-6 h-6 text-lime-500" />
                                Característica 1
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <GrFormCheckmark className="w-6 h-6 text-lime-500" />
                                Característica 2
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <GrFormCheckmark className="w-6 h-6 text-lime-500" />
                                Característica 3
                            </li>
                        </ul>

                        {/* Espaciador flexible para empujar el botón hacia abajo */}
                        <div className="flex-grow"></div>

                        <div className="absolute -bottom-4 bg-lime-600 text-white font-semibold py-2 px-6 rounded-full">
                            Suscríbete
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SubscriptionPage;
