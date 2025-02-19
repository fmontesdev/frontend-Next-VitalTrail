'use client';

import { useEffect } from 'react';
import { useCommentsByRoute } from '@/queries/commentQuery';
import Link from 'next/link';
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { useAuth } from '@/hooks/useAuth';
import { ICommentsListProps } from '@/shared/interfaces/props/props.interface';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function CommentsList({ routeSlug, initialComments, onCommentsCount }: ICommentsListProps) {
    const { currentUser } = useAuth();
    const { data: comments, isLoading, isError } = useCommentsByRoute(routeSlug, initialComments);
    // console.log(comments);

    useEffect(() => {
        if (comments && onCommentsCount) {
            onCommentsCount(comments.comments.length);
        }
    }, [comments, onCommentsCount]);

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
        <div className="max-h-[32rem] overflow-y-auto hide-scrollbar space-y-4 px-4 lg:px-24">
            {currentUser.isAuthenticated ? (
                <CommentInput routeSlug={routeSlug} />
            ) : (
                <Link href={`/login`} className="text-md text-lime-600 font-bold hover:underline underline-offset-2">
                    Debes iniciar sesión para comentar
                </Link>
            )}

            {comments && comments.comments.map((comment) => (
                <CommentItem key={comment.idComment} comment={comment} />
            ))}
        </div>
    );
}
