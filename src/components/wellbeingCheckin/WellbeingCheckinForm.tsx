'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useCreateCheckin } from '@/mutations/routeSessionMutation';
import RatingSlider from '@/components/wellbeingCheckin/components/RatingSlider';
import { IWellbeingCheckinFormProps } from '@/shared/interfaces/props/sessionTracker.props';

const checkinSchema = Yup.object({
    energy: Yup.number().min(1).max(5).required('Indica tu nivel de energía'),
    stress: Yup.number().min(1).max(5).required('Indica tu nivel de estrés'),
    mood: Yup.number().min(1).max(5).required('Indica tu estado de ánimo'),
    notes: Yup.string().max(255, 'Máximo 255 caracteres').optional(),
});

type CheckinFormValues = Yup.InferType<typeof checkinSchema>;

/** Duración de la transición en ms — debe coincidir con duration-300 de Tailwind */
const ANIM_DURATION = 300;

export default function WellbeingCheckinForm({ idSession, onClose, onSuccess }: IWellbeingCheckinFormProps) {
    const { mutate: createCheckin, isPending, error } = useCreateCheckin(idSession);

    // Controla la visibilidad para las animaciones de entrada y salida
    const [isVisible, setIsVisible] = useState(false);

    // Activar la animación de entrada en el siguiente frame (el render inicial es opacity-0)
    useEffect(() => {
        const raf = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    // Fade-out primero, luego ejecutar el callback del padre
    const handleDismiss = (callback: () => void) => {
        setIsVisible(false);
        setTimeout(callback, ANIM_DURATION);
    };

    const formik = useFormik<CheckinFormValues>({
        initialValues: {
            energy: 3,
            stress: 3,
            mood: 3,
            notes: '',
        },
        validationSchema: checkinSchema,
        onSubmit: (values) => {
            createCheckin(
                {
                    checkin: {
                        energy: values.energy,
                        stress: values.stress,
                        mood: values.mood,
                        ...(values.notes ? { notes: values.notes } : {}),
                    },
                },
                {
                    onSuccess: () => handleDismiss(onSuccess),
                },
            );
        },
    });

    return (
        /* Overlay — fade */
        <div className={`
            fixed inset-0 z-50 flex items-end sm:items-center justify-center
            bg-black/60 transition-opacity duration-300
            ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}>
            {/* Modal — slide-up en móvil, scale en escritorio */}
            <div className={`
                w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl
                shadow-2xl flex flex-col overflow-hidden max-h-[90vh]
                transition-all duration-300
                ${isVisible
                    ? 'opacity-100 translate-y-0 sm:scale-100'
                    : 'opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95'
                }
            `}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-stone-100">
                    <div>
                        <h2 className="text-lg font-bold text-teal-700">¿Cómo fue la salida?</h2>
                        <p className="text-sm text-gray-500">Registra cómo te sientes tras la ruta</p>
                    </div>
                    <button
                        onClick={() => handleDismiss(onClose)}
                        aria-label="Cerrar"
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form body — scrollable */}
                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 px-5 py-5 overflow-y-auto">
                    <RatingSlider
                        label="Energía"
                        name="energy"
                        value={formik.values.energy}
                        onChange={(val) => formik.setFieldValue('energy', val)}
                    />
                    {formik.errors.energy && (
                        <p className="text-xs text-red-600 -mt-3">{formik.errors.energy}</p>
                    )}

                    <RatingSlider
                        label="Estrés"
                        name="stress"
                        value={formik.values.stress}
                        onChange={(val) => formik.setFieldValue('stress', val)}
                        inverted
                    />
                    {formik.errors.stress && (
                        <p className="text-xs text-red-600 -mt-3">{formik.errors.stress}</p>
                    )}

                    <RatingSlider
                        label="Estado de ánimo"
                        name="mood"
                        value={formik.values.mood}
                        onChange={(val) => formik.setFieldValue('mood', val)}
                    />
                    {formik.errors.mood && (
                        <p className="text-xs text-red-600 -mt-3">{formik.errors.mood}</p>
                    )}

                    {/* Notas opcionales */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                            Notas <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            maxLength={255}
                            placeholder="¿Algo destacable de esta salida?"
                            value={formik.values.notes}
                            onChange={formik.handleChange}
                            className="
                                w-full rounded-xl border border-stone-200 px-3 py-2
                                text-sm text-gray-700 resize-none focus:outline-none
                                focus:ring-2 focus:ring-lime-600 focus:border-transparent
                                placeholder:text-gray-400
                            "
                        />
                        <div className="flex justify-between">
                            {formik.errors.notes && (
                                <p className="text-xs text-red-600">{formik.errors.notes}</p>
                            )}
                            <span className="text-xs text-gray-400 ml-auto">
                                {(formik.values.notes ?? '').length}/255
                            </span>
                        </div>
                    </div>

                    {/* Error de API */}
                    {error && (
                        <p className="text-sm text-red-600">
                            Error al guardar. Inténtalo de nuevo.
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="
                            w-full flex items-center justify-center gap-2
                            py-3 rounded-full bg-lime-600 hover:bg-lime-700
                            text-white font-semibold text-sm transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        {isPending ? 'Guardando…' : 'Guardar check-in'}
                    </button>

                    {/* Omitir */}
                    <button
                        type="button"
                        onClick={() => handleDismiss(onClose)}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors pb-1"
                    >
                        Omitir por ahora
                    </button>
                </form>
            </div>
        </div>
    );
}

