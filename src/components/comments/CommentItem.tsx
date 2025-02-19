'use client';

import { usedeleteComment } from '@/mutations/commentMutation';
import { useIsAuthor } from '@/auth/authorizations';
import Avatar from "../avatar/Avatar";
import { useAuth } from '@/hooks/useAuth';
import { FormatDate } from "@/shared/utils/formatDate";
import { StarIcon } from "@heroicons/react/24/solid";
import { IComment } from '@/shared/interfaces/entities/comment.interface';
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CommentItem({ comment }: {comment: IComment}) {
    const { currentUser } = useAuth();
    const { mutateAsync, isPending, isError } = usedeleteComment(comment.idComment);
    const isAuthor = useIsAuthor(comment.user.username);

    function createRating(rating: number) {
        let stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<StarIcon key={i} className="w-4 h-4 text-amber-500" />)
        }
        return stars;
    }

    const onDelete = async () => {
        mutateAsync();
    }

    return (
        <div className="relative flex border-b border-stone-200 space-x-4 pt-1 pb-5">
            <Link
                href={currentUser.isAuthenticated ? `/profile/${comment.user.username}` : '/login'}
                // href={`/profiles/${comment.user.username}`}
                className="transition duration-200 hover:brightness-90"
            >
                {comment.user.imgUser ? (
                    <Avatar src={comment.user.imgUser} name={comment.user.name} surname={comment.user.surname} />
                ) : (
                    <Avatar name={comment.user.name} surname={comment.user.surname} />
                )}
            </Link>

            <div>
                <div className="font-bold text-teal-700">
                    <Link
                        href={currentUser.isAuthenticated ? `/profile/${comment.user.username}` : '/login'}
                        // href={`/profile/${comment.user.username}`}
                        className="hover:underline underline-offset-2 transition duration-300  pr-2"
                    >
                        {comment.user.name} {comment.user.surname}
                    </Link>
                    <span className="text-gray-600 text-sm font-medium inline-block whitespace-nowrap pr-12">
                        {FormatDate(comment.createdAt)}
                    </span>
                </div>

                {comment.rating && (
                    <div className="flex">
                        {createRating(comment.rating)}
                    </div>
                )}

                <p>{comment.body}</p>

                {isAuthor && (
                    <button
                        onClick={onDelete}
                        className="
                            absolute top-[-9] right-2 text-sm text-white bg-red-400 rounded-full hover:bg-red-500
                            active:scale-90 transition transform duration-150 p-1 mt-2"
                        disabled={isPending}
                    >
                        <XMarkIcon strokeWidth={3} className="w-5 h-5" />
                    </button>
                )}

                {isError && 
                    <p className="text-red-500 text-base font-semibold pt-1">Error al eliminar el comentario.</p>
                }
            </div>
        </div>
    );
}
