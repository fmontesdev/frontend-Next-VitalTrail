'use client';

import { useCreateComment } from '@/mutations/commentMutation';
import { useState } from 'react';

export default function CommentInput({ routeSlug }: {routeSlug: string }) {
    const { mutateAsync, isPending, isError } = useCreateComment(routeSlug);
    const [commentText, setCommentText] = useState("");

    const handleSubmit = async () => {
        if (isPending || !commentText.trim()) return;
        mutateAsync(commentText);
        setCommentText(""); // Limpiar el campo de texto después de enviar el comentario
    };

    return (
        <>
            <div className="relative flex flex-col md:flex-row md:items-start md:justify-between pt-1 pb-1">
                <textarea
                    id="comment-input"
                    className="
                        h-28 w-full border rounded-lg py-2 px-4 text-gray-700 font-medium shadow-inner
                        shadow-stone-200 focus:outline-none focus:border-2 focus:border-teal-600"
                    placeholder="Escribe tu comentario..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    className="
                        w-32 bg-lime-500 text-md text-white font-semibold rounded-full
                        mt-4 px-4 py-2 md:mt-0 md:ml-4 hover:bg-lime-600
                        active:scale-95 transition transform duration-150"
                    disabled={isPending}
                >
                    {isPending ? "Enviando..." : "Enviar"}
                </button>

                <div className="absolute top-4 left-4 bg-white">
                    {isError && 
                        <p className="text-red-500 text-base font-semibold">
                            Error al añadir el comentario.
                        </p>
                    }
                </div>
            </div>
        </>
    );
}
