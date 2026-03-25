'use client';

import { useState } from 'react';
import { useCanEdit, useCanManageAdmin } from '@/auth/authorizations';
import MyRoutesList from './MyRoutesList';
import ProfileCommentsList from './MyCommentsList';
import FollowingList from './FollowingList';
import FollowersList from './FollowersList';
import ProfileFavoritesList from './MyFavoritesRoutesList';
import MySessionsList from './MySessionsList';

export default function ProfileMyContent({ username }: { username: string }) {
    // State para controlar qué vista se muestra
    const [activeTab, setActiveTab] =
        useState<'sesiones' | 'favoritos' | 'rutas' | 'comentarios' | 'siguiendo' | 'seguidos'>('sesiones');
    const [commentsCount, setCommentsCount] = useState<number>(); // Contador de comentarios para mostrar en la pestaña (desactivado)
    const { canEdit } = useCanEdit(username);
    const { canManageAdmin } = useCanManageAdmin(username);

    // Funciones para cambiar la pestaña
    const showSessions = () => setActiveTab('sesiones');
    const showFavorites = () => setActiveTab('favoritos');
    const showRoutes = () => setActiveTab('rutas');
    const showComments = () => setActiveTab('comentarios');
    const showFollowing = () => setActiveTab('siguiendo');
    const showFollowers = () => setActiveTab('seguidos');

    return (
        <div className="w-3/4 bg-stone-100 border border-stone-200 rounded-2xl px-7 py-4">
            {/* Barra de pestañas */}
            <div className="flex items-center gap-3 border-b text-gray-400 font-bold">
                {canEdit && (
                    <button
                        onClick={showSessions}
                        className={`px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                            ${activeTab === 'sesiones'
                            ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                            : ''}
                        `}
                    >
                        Mis Sesiones
                    </button>
                )}

                {canManageAdmin && (
                    <>
                        <button
                            onClick={showFavorites}
                            className={`px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                                ${activeTab === 'favoritos'
                                ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                                : ''}
                            `}
                        >
                            Mis Favoritos
                        </button>

                        <button
                            onClick={showRoutes}
                            className={`px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                                ${activeTab === 'rutas'
                                ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                                : ''}
                            `}
                        >
                            Mis Rutas
                        </button>
                    </>
                )}

                {canEdit && (
                    <button
                        onClick={showComments}
                        className={`px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                            ${activeTab === 'comentarios'
                            ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                            : ''}
                        `}
                    >
                        Mis Comentarios
                    </button>
                )}

                <button
                    onClick={showFollowing}
                    className={`px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                        ${activeTab === 'siguiendo'
                        ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                        : ''}
                    `}
                >
                    Siguiendo
                </button>

                <button
                    onClick={showFollowers}
                    className={`px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                        ${activeTab === 'seguidos'
                        ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                        : ''}
                    `}
                >
                    Seguidores
                </button>
            </div>

            {/* Contenido dinámico */}
            <div className="mt-4">
                {activeTab === 'sesiones' && <MySessionsList />}
                {activeTab === 'favoritos' && <ProfileFavoritesList username={username} />}
                {activeTab === 'rutas' && <MyRoutesList username={username} />}
                {activeTab === 'comentarios' && <ProfileCommentsList username={username} onCommentsCount={(count) => setCommentsCount(count)}/>}
                {activeTab === 'siguiendo' && <FollowingList username={username} />}
                {activeTab === 'seguidos'  && <FollowersList username={username} />}
            </div>
        </div>
    );
}
