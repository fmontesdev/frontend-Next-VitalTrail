'use client';

import { useEffect } from 'react';
import { useCommentsByUser } from '@/queries/commentQuery';
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CommentItem from '../comments/CommentItem';
import { IProfileCommentsListProps } from '@/shared/interfaces/props/props.interface';
import { ExclamationTriangleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function ProfileCommentsList({ username, onCommentsCount }: IProfileCommentsListProps) {
    const { data: comments, isLoading, isError } = useCommentsByUser(username);

    useEffect(() => {
        if (comments && onCommentsCount) {
            onCommentsCount(comments.length);
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

    if (!comments || comments.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
            <ChatBubbleLeftRightIcon className="w-12 h-12 mb-3" />
            <span className="text-sm font-medium">No has escrito comentarios todavía</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-3 py-2">
            {comments.map((comment) => (
                <CommentItem key={comment.idComment} comment={comment} />
            ))}
        </div>
    );
}
