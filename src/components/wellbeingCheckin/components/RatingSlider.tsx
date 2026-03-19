'use client';

import { IRatingSliderProps } from '@/shared/interfaces/props/sessionTracker.props';

const RATINGS = [1, 2, 3, 4, 5] as const;

const RATING_LABELS: Record<number, string> = {
    1: '😔',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😄',
};

// Para campos invertidos (p. ej. estrés): 1 = perfecto, 5 = extremo
const RATING_LABELS_INVERTED: Record<number, string> = {
    1: '😄',
    2: '🙂',
    3: '😐',
    4: '😕',
    5: '😔',
};

export default function RatingSlider({ label, name, value, onChange, inverted = false }: IRatingSliderProps) {
    const labels = inverted ? RATING_LABELS_INVERTED : RATING_LABELS;

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-700">{label}</span>
            <div className="flex items-center gap-2" role="group" aria-label={label}>
                {RATINGS.map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => onChange(rating)}
                        aria-label={`${label} ${rating} de 5`}
                        aria-pressed={value === rating}
                        className={`
                            w-11 h-11 rounded-full flex items-center justify-center
                            text-lg border-2 transition-all duration-150 font-semibold
                            ${value === rating
                                ? 'border-lime-600 bg-lime-600 text-white scale-110 shadow-md'
                                : 'border-stone-200 bg-white text-gray-700 hover:border-lime-400 hover:bg-lime-50'
                            }
                        `}
                    >
                        {labels[rating]}
                    </button>
                ))}
            </div>
        </div>
    );
}
