'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from "next/navigation";
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileMyContent from "@/components/profile/ProfileMyContent";
import ProfileMySubscription from "@/components/profile/ProfileMySubscription";
import UpdateProfile from "@/components/profile/UpdateProfile";
import MyNotificationsList from "@/components/profile/MyNotificationsList";
import { useAuthGuard } from "@/services/guards/useAuthGuard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function ProfilePage() {
    const currentUser = useAuthGuard();
    const params = useParams();
    const searchParams = useSearchParams();
    const { username } = params as { username: string };

    const initialTab = searchParams.get('tab');

    // State para controlar qué vista se muestra
    const [activeTab, setActiveTab] = useState<'miContenido' | 'misNotificaciones' | 'miSuscripción' | 'editarPerfil'>(
        initialTab === 'suscripcion' ? 'miSuscripción' : 'miContenido'
    );

    if (currentUser.isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <main className="
            container flex items-start flex-grow gap-6
            min-h-[calc(100vh-64px)] mx-auto md:px-8 lg:px-12 py-9
        ">
            {/* Columna izquierda: perfil */}
            <ProfileSidebar
                username={username}
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
            />

            {/* Columna derecha: contenido dinámico */}
            {activeTab === 'miContenido' && <ProfileMyContent username={username} />}
            {activeTab === 'misNotificaciones' && <MyNotificationsList />}
            {activeTab === 'miSuscripción' && <ProfileMySubscription username={username} />}
            {activeTab === 'editarPerfil' && (
                <div className="w-3/4 h-auto bg-stone-100 border border-stone-200 rounded-2xl px-7 py-4">
                    <div className="flex gap-3 border-b text-gray-400 font-bold mb-4">
                        <span className="px-2 py-1 text-teal-700 border-b-2 border-teal-700">
                            Editar Perfil
                        </span>
                    </div>
                    <UpdateProfile username={username} />
                </div>
            )}
        </main>
    );
}
