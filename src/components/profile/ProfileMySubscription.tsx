'use client';

import { useState } from 'react';
import { useCanEdit } from '@/auth/authorizations';
import MySubscription from './MySubscription';
import MyInvoices from './MyInvoices';

export default function ProfileMySubscription({ username }: { username: string }) {
    const [activeTab, setActiveTab] = useState<'miSuscripción' | 'misFacturas'>('miSuscripción');
    const { canEdit } = useCanEdit(username);

    return (
        <div className="w-3/4 h-auto bg-stone-100 border border-stone-200 rounded-2xl px-7 py-4">
            {/* Barra de pestañas */}
            <div className="flex gap-3 border-b text-gray-400 font-bold">
                {canEdit && (
                    <>
                        <button
                            onClick={() => setActiveTab('miSuscripción')}
                            className={`flex items-center gap-1 px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                                ${activeTab === 'miSuscripción'
                                ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                                : ''}
                            `}
                        >
                            Mi suscripción
                        </button>

                        <button
                            onClick={() => setActiveTab('misFacturas')}
                            className={`flex items-center gap-1 px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                                ${activeTab === 'misFacturas'
                                ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                                : ''}
                            `}
                        >
                            Mis facturas
                        </button>
                    </>
                )}
            </div>

            {/* Contenido dinámico */}
            <div className="mt-4">
                {activeTab === 'miSuscripción' && <MySubscription />}
                {activeTab === 'misFacturas' && <MyInvoices />}
            </div>
        </div>
    );
}
