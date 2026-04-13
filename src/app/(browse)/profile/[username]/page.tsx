'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from "next/navigation";
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileMyContent from "@/components/profile/ProfileMyContent";
import ProfileMySubscription from "@/components/profile/ProfileMySubscription";
import ProfileUpdate from "@/components/profile/ProfileUpdate";
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
            {activeTab === 'misNotificaciones'}
            {activeTab === 'miSuscripción' && <ProfileMySubscription username={username} />}
            {activeTab === 'editarPerfil' && <ProfileUpdate username={username} />}
        </main>
    );
}
