'use client';

import { useState } from 'react';
import { useCanEdit } from '@/auth/authorizations';
import MySubscription from './MySubscription';

export default function ProfileMySubscription({ username }: { username: string }) {
    // State para controlar qué vista se muestra
    const [activeTab, setActiveTab] =
        useState<'miSuscripción'>('miSuscripción');
    const { canEdit } = useCanEdit(username);

    // Funciones para cambiar la pestaña
    const showMySubscription = () => setActiveTab('miSuscripción');

    return (
        <div className="
            w-3/4 h-auto bg-stone-100 border border-stone-20 rounded-2xl px-7 py-4">
            {/* Barra de pestañas */}
            <div className="flex gap-3 border-b text-gray-400 font-bold">
                {canEdit && (
                    <button
                        onClick={showMySubscription}
                        className={`flex items-center gap-1 px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                            ${activeTab === 'miSuscripción'
                            ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                            : ''}
                        `}
                    >
                        Mi suscripción
                    </button>
                )}
            </div>

            {/* Contenido dinámico */}
            <div className="mt-4">
                {activeTab === 'miSuscripción' && <MySubscription username={username} />}
            </div>
        </div>
    );
}
