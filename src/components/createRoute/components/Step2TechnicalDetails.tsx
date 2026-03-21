'use client';

import { type ComponentType } from 'react';
import { Field, ErrorMessage, FormikErrors, FormikTouched } from 'formik';
import {
    SunIcon,
    BoltIcon,
    FireIcon,
    ExclamationTriangleIcon,
    ArrowLongRightIcon,
    ArrowPathIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

type Difficulty = 'fácil' | 'moderada' | 'difícil' | 'experto';
type TypeRoute = 'solo ida' | 'circular';

interface IStep2Values {
    duration: number | string;
    difficulty: Difficulty | '';
    typeRoute: TypeRoute | '';
}

interface IStep2Props {
    values: IStep2Values;
    errors: FormikErrors<IStep2Values>;
    touched: FormikTouched<IStep2Values>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setFieldValue: (field: string, value: unknown) => void;
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; Icon: ComponentType<{ className?: string }> }[] = [
    { value: 'fácil', label: 'Fácil', Icon: SunIcon },
    { value: 'moderada', label: 'Moderada', Icon: BoltIcon },
    { value: 'difícil', label: 'Difícil', Icon: FireIcon },
    { value: 'experto', label: 'Experto', Icon: ExclamationTriangleIcon },
];

const TYPE_ROUTE_OPTIONS: { value: TypeRoute; label: string; Icon: ComponentType<{ className?: string }> }[] = [
    { value: 'solo ida', label: 'Solo ida', Icon: ArrowLongRightIcon },
    { value: 'circular', label: 'Circular', Icon: ArrowPathIcon },
];

export default function Step2TechnicalDetails({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
}: IStep2Props) {
    const inputClass = `
        w-full border border-gray-300 rounded-3xl px-4 py-3 font-medium text-gray-900
        focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600
        transition-colors placeholder-gray-400
    `;

    const errorClass = 'text-red-500 text-sm mt-1';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-teal-700 mb-0.5">Detalles técnicos</h2>
                <p className="text-gray-500 text-sm">Indica la duración estimada, la dificultad y el tipo de ruta.</p>
            </div>

            {/* Nota informativa — distancia auto-calculada */}
            <div className="flex justify-center items-center gap-3 rounded-3xl bg-teal-50 border border-teal-200 px-4 py-2">
                <InformationCircleIcon className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-base text-teal-700">
                    <span className="font-semibold">La distancia se calcula automáticamente</span> a partir del
                    recorrido trazado en el siguiente paso.
                </p>
            </div>

            {/* Duración */}
            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-1">
                    Duración (minutos)
                </label>
                <div className="w-1/4 min-w-[140px]">
                    <Field
                        id="duration"
                        type="number"
                        name="duration"
                        min={1}
                        step={1}
                        placeholder="120"
                        className={inputClass}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.duration}
                    />
                </div>
                <ErrorMessage name="duration" component="p" className={errorClass} />
            </div>

            {/* Dificultad — segmented control */}
            <div>
                <p className="block text-sm font-medium text-gray-400 mb-1">
                    Dificultad
                </p>
                <div className="flex rounded-3xl border-2 border-gray-200 overflow-hidden">
                    {DIFFICULTY_OPTIONS.map((opt) => {
                        const isSelected = values.difficulty === opt.value;
                        const { Icon } = opt;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setFieldValue('difficulty', opt.value)}
                                className={`
                                    flex-1 flex flex-row items-center justify-center gap-2 py-3.5 px-3
                                    font-medium text-sm transition-all border-r border-gray-200 last:border-r-0
                                    ${isSelected
                                        ? 'bg-lime-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="text-base">{opt.label}</span>
                            </button>
                        );
                    })}
                </div>
                <ErrorMessage name="difficulty" component="p" className={errorClass} />
            </div>

            {/* Tipo de ruta — segmented control */}
            <div>
                <p className="block text-sm font-medium text-gray-400 mb-1">
                    Tipo de ruta
                </p>
                <div className="flex rounded-3xl border-2 border-gray-200 overflow-hidden">
                    {TYPE_ROUTE_OPTIONS.map((opt) => {
                        const isSelected = values.typeRoute === opt.value;
                        const { Icon } = opt;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setFieldValue('typeRoute', opt.value)}
                                className={`
                                    flex-1 flex flex-row items-center justify-center gap-2 py-3.5 px-4
                                    font-medium text-sm transition-all border-r border-gray-200 last:border-r-0
                                    ${isSelected
                                        ? 'bg-lime-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="text-base">{opt.label}</span>
                            </button>
                        );
                    })}
                </div>
                <ErrorMessage name="typeRoute" component="p" className={errorClass} />
            </div>
        </div>
    );
}
