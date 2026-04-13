'use client';

export default function CommentInput({
    value,
    onChange,
    isError,
}: {
    value: string;
    onChange: (value: string) => void;
    isError: boolean;
}) {
    return (
        <div className="relative w-full">
            <textarea
                id="comment-input"
                className="
                    h-28 w-full border rounded-2xl py-2 px-4 text-gray-700 font-medium shadow-inner
                    shadow-stone-200 focus:outline-none focus:border-2 focus:border-teal-600"
                placeholder="Escribe tu comentario..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {isError && (
                <p className="absolute top-2 left-4 bg-white text-red-500 text-base font-semibold">
                    Error al añadir el comentario.
                </p>
            )}
        </div>
    );
}
