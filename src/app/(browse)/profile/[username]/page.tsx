'use client';

import { useParams } from "next/navigation";
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileContent from "@/components/profile/ProfileContent";
import { useAuthGuard } from "@/services/guards/useAuthGuard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function ProfilePage() {
    const currentUser = useAuthGuard();
    const params = useParams();
    const { username } = params as { username: string };

    if (currentUser.isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <main className="
            container flex items-start flex-grow gap-6
            min-h-[calc(100vh-500px-64px)] mx-auto md:px-8 lg:px-12 py-10
        ">
            {/* Columna izquierda: perfil */}
            <ProfileSidebar username={username} />

            {/* Columna derecha: contenido dinámico */}
            <ProfileContent username={username} />
        </main>
    );
}
