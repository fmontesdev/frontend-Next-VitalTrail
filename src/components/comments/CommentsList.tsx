'use client';

import { useState, useEffect } from 'react';
import { useCommentsByRoute } from '@/queries/commentQuery';
import { useCreateComment } from '@/mutations/commentMutation';
import Link from 'next/link';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { useAuth } from '@/hooks/useAuth';
import { ICommentsListProps } from '@/shared/interfaces/props/props.interface';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function CommentsList({ routeSlug, initialComments, commentsCount, onCommentsCount }: ICommentsListProps) {
    const { currentUser } = useAuth();
    const { data: comments, isLoading, isError } = useCommentsByRoute(routeSlug, initialComments);
    const { mutateAsync, isPending, isError: isSubmitError } = useCreateComment(routeSlug);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if (comments && onCommentsCount) {
            onCommentsCount(comments.comments.length);
        }
    }, [comments, onCommentsCount]);

    const handleSubmit = async () => {
        if (isPending || !commentText.trim()) return;
        await mutateAsync(commentText);
        setCommentText('');
    };

    if (isLoading) return (
        <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
        </div>
    );

    if (isError) return (
        <div className="flex items-center justify-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Hubo un error al cargar los comentarios</span>
        </div>
    );

    return (
        <div className="space-y-4 px-4 lg:px-24">
            {/* Header: título + contador + botón enviar */}
            <div className="flex items-center justify-between pt-2 pb-1">
                <h2 className="text-lg font-bold text-gray-500">
                    Comentarios ({commentsCount})
                </h2>
                {currentUser.isAuthenticated && (
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || !commentText.trim()}
                        className="
                            bg-lime-600 text-white text-sm font-semibold rounded-full
                            px-5 py-2 hover:bg-lime-700 active:scale-95
                            transition transform duration-150
                            disabled:bg-stone-300 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Enviando...' : 'Enviar'}
                    </button>
                )}
            </div>

            {/* Textarea o link de login */}
            {currentUser.isAuthenticated ? (
                <CommentInput
                    value={commentText}
                    onChange={setCommentText}
                    isError={isSubmitError}
                />
            ) : (
                <Link href="/login" className="text-md text-lime-600 font-bold hover:underline underline-offset-2">
                    Debes iniciar sesión para comentar
                </Link>
            )}

            {/* Lista de comentarios */}
            {comments && comments.comments.map((comment) => (
                <CommentItem key={comment.idComment} comment={comment} />
            ))}
        </div>
    );
}
