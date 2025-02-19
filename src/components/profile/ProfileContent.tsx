'use client';

import React, { useState } from 'react';
import { useCanEdit, useCanManageAdmin } from '@/auth/authorizations';
import MyRoutesList from '../profile/MyRouteList';
import ProfileCommentsList from './ProfileCommentsList';
import FollowingList from './FollowingList';
import FollowersList from './FollowersList';
import UpdateProfile from './UpdateProfile';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export default function ProfileContent({ username }: { username: string }) {
    // State para controlar qué vista se muestra
    const [activeTab, setActiveTab] =
        useState<'rutas' | 'favoritos' | 'comentarios' | 'siguiendo' | 'seguidos' | 'editarPerfil'>('rutas');
    // Contadores
    const [commentsCount, setCommentsCount] = useState<number>();
    const { canEdit } = useCanEdit(username);
    const { canManageAdmin } = useCanManageAdmin(username);

    // Funciones para cambiar la pestaña
    const showRoutes = () => setActiveTab('rutas');
    const showFavorites = () => setActiveTab('favoritos');
    const showComments = () => setActiveTab('comentarios');
    const showFollowing = () => setActiveTab('siguiendo');
    const showFollowers = () => setActiveTab('seguidos');
    const showUpdateProfile = () => setActiveTab('editarPerfil');

    return (
        <div className="
            w-3/4 h-auto bg-stone-100 border border-stone-20 rounded-2xl px-7 py-4">
            {/* Barra de pestañas */}
            <div className="flex gap-3 border-b text-gray-400 font-bold">
                {canManageAdmin && (
                    <>
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
                        Mis Comentarios {commentsCount !== undefined && commentsCount > 0 ? `(${commentsCount})` : ''}
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

                {canEdit && (
                    <button
                        onClick={showUpdateProfile}
                        className={`flex itmes-center gap-1 px-2 py-1 hover:text-gray-500 transition duration-250 ease-in-out
                            ${activeTab === 'editarPerfil'
                            ? 'text-teal-700 border-b-2 border-teal-700 hover:text-teal-700'
                            : ''}
                        `}
                    >
                        <PencilSquareIcon strokeWidth={2} className="h-5 w-5" />
                        Editar Perfil
                    </button>
                )}
            </div>

            {/* Contenido dinámico */}
            <div className="mt-4">
                {activeTab === 'rutas' && <MyRoutesList username={username} />}
                {activeTab === 'favoritos'}
                {activeTab === 'comentarios' && <ProfileCommentsList username={username} onCommentsCount={(count) => setCommentsCount(count)}/>}
                {activeTab === 'siguiendo' && <FollowingList username={username} />}
                {activeTab === 'seguidos'  && <FollowersList username={username} />}
                {activeTab === 'editarPerfil' && <UpdateProfile username={username} />}
            </div>
        </div>
    );
}
