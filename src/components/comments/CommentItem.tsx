'use client';

import { usedeleteComment } from '@/mutations/commentMutation';
import { useIsAuthor } from '@/auth/authorizations';
import { useAuth } from '@/hooks/useAuth';
import { FormatDate } from "@/shared/utils/formatDate";
import { StarIcon } from "@heroicons/react/24/solid";
import { XMarkIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { IComment, ICommentRoute } from '@/shared/interfaces/entities/comment.interface';
import Image from 'next/image';
import Link from "next/link";
import { getImageUrl } from '@/shared/utils/imageUrl';

export default function CommentItem({ comment }: { comment: IComment }) {
    const { currentUser } = useAuth();
    const { mutateAsync, isPending, isError } = usedeleteComment(comment.idComment);
    const isAuthor = useIsAuthor(comment.user.username);

    const profileHref = currentUser.isAuthenticated
        ? `/profile/${comment.user.username}`
        : '/login';

    const route: ICommentRoute | null =
        typeof comment.route === 'object' ? comment.route : null;

    return (
        <div className="
            w-full flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-2xl
            hover:shadow hover:shadow-stone-200 transition-shadow cursor-pointer"
        >
            {/* Avatar */}
            <Link href={profileHref} className="flex-shrink-0">
                <div className="w-[64px] h-[64px] rounded-full overflow-hidden bg-stone-100 flex items-center justify-center">
                    {comment.user.imgUser ? (
                        <Image
                            src={getImageUrl('avatar', comment.user.imgUser)}
                            alt={`${comment.user.name} ${comment.user.surname}`}
                            width={64}
                            height={64}
                            sizes="64px"
                            className="object-cover w-full h-full rounded-full"
                        />
                    ) : (
                        <span className="text-xl font-black text-teal-700">
                            {comment.user.name?.slice(0, 1).toUpperCase()}
                            {comment.user.surname?.slice(0, 1).toUpperCase()}
                        </span>
                    )}
                </div>
            </Link>

            {/* Datos */}
            <div className="flex flex-col min-w-0 flex-1">

                {/* Nombre + ruta asociada */}
                <div className="flex items-center gap-2 min-w-0">
                    <Link
                        href={profileHref}
                        className="text-base text-teal-700 font-bold leading-tight hover:underline underline-offset-2 truncate flex-shrink-0"
                    >
                        {comment.user.name} {comment.user.surname}
                    </Link>
                    {route && (
                        <>
                            <span className="text-gray-300 flex-shrink-0">·</span>
                            <Link
                                href={`/route/${route.slug}`}
                                className="flex items-center gap-1 text-sm text-gray-400 font-medium hover:text-teal-700 transition-colors duration-150 truncate"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                                {route.title}
                            </Link>
                        </>
                    )}
                </div>
                <span className="text-sm text-gray-400 font-medium mb-1">
                    {FormatDate(comment.createdAt)}
                </span>

                {/* Rating */}
                {comment.rating && (
                    <div className="flex gap-0.5 mb-1">
                        {Array.from({ length: comment.rating }).map((_, i) => (
                            <StarIcon key={i} className="w-3.5 h-3.5 text-amber-500" />
                        ))}
                    </div>
                )}

                {/* Cuerpo */}
                <p className="text-sm text-stone-600 leading-snug line-clamp-2">{comment.body}</p>

                {/* Error al eliminar */}
                {isError && (
                    <p className="text-xs text-red-500 font-semibold mt-1">Error al eliminar el comentario.</p>
                )}
            </div>

            {/* Botón eliminar */}
            {isAuthor && (
                <button
                    onClick={() => mutateAsync()}
                    disabled={isPending}
                    className="flex-shrink-0 text-white bg-red-400 rounded-full hover:bg-red-500 active:scale-90 transition-transform duration-150 p-1"
                >
                    <XMarkIcon strokeWidth={3} className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
