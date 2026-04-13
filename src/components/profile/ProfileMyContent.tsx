'use client';

import { useState, useEffect, useRef } from 'react';
import { useCanEdit } from '@/auth/authorizations';
import { useAuth } from '@/hooks/useAuth';
import MyRoutesList from './MyRoutesList';
import ProfileCommentsList from './MyCommentsList';
import FollowingList from './FollowingList';
import FollowersList from './FollowersList';
import ProfileFavoritesList from './MyFavoritesRoutesList';
import MySessionsList from './MySessionsList';

export default function ProfileMyContent({ username }: { username: string }) {
    const [activeTab, setActiveTab] =
        useState<'sesiones' | 'favoritos' | 'rutas' | 'comentarios' | 'siguiendo' | 'seguidos' | null>(null);
    const [, setCommentsCount] = useState<number>();
    const [hasScroll, setHasScroll] = useState(false);
    const { isLoading: isLoadingEdit } = useCanEdit(username);
    const { currentUser } = useAuth();
    const isOwner = currentUser.user?.username === username;
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Establece el tab inicial una sola vez cuando canEdit termina de resolver.
    const initializedRef = useRef(false);
    useEffect(() => {
        if (isLoadingEdit || initializedRef.current) return;
        initializedRef.current = true;
        setActiveTab(isOwner ? 'sesiones' : 'favoritos');
    }, [isLoadingEdit, isOwner]);

    // Detecta si el contenedor de scroll tiene overflow activo para añadir pr-4
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const check = () => setHasScroll(container.scrollHeight > container.clientHeight);
        check();

        const observer = new ResizeObserver(check);
        observer.observe(container);
        return () => observer.disconnect();
    }, [activeTab]);

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
                {isOwner && (
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

                {isOwner && (
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
            <div
                ref={scrollContainerRef}
                className={`mt-4 max-h-[calc(100vh-220px)] overflow-y-auto ${hasScroll ? 'pr-4' : ''}`}
            >
                {activeTab === null && null}
                {activeTab === 'sesiones' && isOwner && <MySessionsList />}
                {activeTab === 'favoritos' && <ProfileFavoritesList username={username} />}
                {activeTab === 'rutas' && <MyRoutesList username={username} />}
                {activeTab === 'comentarios' && isOwner && <ProfileCommentsList username={username} onCommentsCount={(count) => setCommentsCount(count)}/>}
                {activeTab === 'siguiendo' && <FollowingList username={username} />}
                {activeTab === 'seguidos'  && <FollowersList username={username} />}
            </div>
        </div>
    );
}
