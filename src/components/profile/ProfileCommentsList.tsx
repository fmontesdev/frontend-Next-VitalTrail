'use client';

import { useEffect } from 'react';
import { useCommentsByUser } from '@/queries/commentQuery';
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CommentItem from '../comments/CommentItem';
import { IProfileCommentsListProps } from '@/shared/interfaces/props/props.interface';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ProfileCommentsList({ username, onCommentsCount }: IProfileCommentsListProps) {
    const { data: comments, isLoading, isError } = useCommentsByUser(username);
    console.log(comments);

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

    return (
        <div className="max-h-[32rem] overflow-y-auto hide-scrollbar space-y-4 px-4 lg:px-24 py-4">
            {comments && comments.map((comment) => (
                <CommentItem key={comment.idComment} comment={comment} />
            ))}
        </div>
    );
}
