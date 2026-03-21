'use client';

import { Field, ErrorMessage } from 'formik';
import { FormikErrors, FormikTouched } from 'formik';

interface IStep1Values {
    title: string;
    description: string;
    location: string;
}

interface IStep1Props {
    values: IStep1Values;
    errors: FormikErrors<IStep1Values>;
    touched: FormikTouched<IStep1Values>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function Step1BasicInfo({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
}: IStep1Props) {
    const inputClass = `
        w-full border border-gray-300 rounded-3xl px-4 py-3 font-medium text-gray-900
        focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600
        transition-colors placeholder-gray-400
    `;

    const errorClass = 'text-red-500 text-sm mt-1';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-teal-700 mb-0.5">Información básica</h2>
                <p className="text-gray-500 text-sm">Cuéntanos los detalles principales de tu ruta.</p>
            </div>

            {/* Título */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                    Título
                </label>
                <Field
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Ej: Ruta por la Sierra de Guadarrama"
                    className={inputClass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                />
                <ErrorMessage name="title" component="p" className={errorClass} />
            </div>

            {/* Descripción */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label htmlFor="description" className="text-sm font-medium text-gray-400">
                        Descripción
                    </label>
                    <span className="text-xs text-gray-400">
                        {values.description.length}/500
                    </span>
                </div>
                <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe el recorrido, puntos de interés, dificultades..."
                    className={`${inputClass} resize-none`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                />
                <ErrorMessage name="description" component="p" className={errorClass} />
            </div>

            {/* Localización */}
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">
                    Localización
                </label>
                <Field
                    id="location"
                    type="text"
                    name="location"
                    placeholder="Ej: Sierra de Guadarrama, Madrid"
                    className={inputClass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.location}
                />
                <ErrorMessage name="location" component="p" className={errorClass} />
            </div>
        </div>
    );
}
