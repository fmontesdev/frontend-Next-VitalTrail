'use client';

import { useState, useTransition } from 'react';
import { Formik, FormikHelpers, FormikTouched } from 'formik';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import * as Yup from 'yup';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCreateRoute, useUploadRouteImage } from '@/mutations/routeMutation';
import StepIndicator from '@/components/createRoute/StepIndicator';
import Step1BasicInfo from '@/components/createRoute/components/Step1BasicInfo';
import Step2TechnicalDetails from '@/components/createRoute/components/Step2TechnicalDetails';
import Step3Category from '@/components/createRoute/components/Step3Category';
import Step4MapWrapper from '@/components/createRoute/components/Step4MapWrapper';
import Step5ImageUpload from '@/components/createRoute/components/Step5ImageUpload';
import Step6Review from '@/components/createRoute/components/Step6Review';
import { ICreateRoute } from '@/shared/interfaces/entities/route.interface';

// Esquemas de validación por paso
const STEP_SCHEMAS = [
    // Paso 1 — Información básica
    Yup.object({
        title: Yup.string()
            .min(3, 'Mínimo 3 caracteres')
            .max(100, 'Máximo 100 caracteres')
            .required('El título es obligatorio'),
        description: Yup.string()
            .min(10, 'Mínimo 10 caracteres')
            .max(500, 'Máximo 500 caracteres')
            .required('La descripción es obligatoria'),
        location: Yup.string()
            .min(2, 'Mínimo 2 caracteres')
            .max(100, 'Máximo 100 caracteres')
            .required('La ubicación es obligatoria'),
    }),
    // Paso 2 — Detalles técnicos
    Yup.object({
        duration: Yup.number()
            .typeError('Debe ser un número')
            .positive('Debe ser mayor que 0')
            .integer('Debe ser un número entero')
            .required('La duración es obligatoria'),
        difficulty: Yup.string()
            .oneOf(['fácil', 'moderada', 'difícil', 'experto'])
            .required('La dificultad es obligatoria'),
        typeRoute: Yup.string()
            .oneOf(['solo ida', 'circular'])
            .required('El tipo de ruta es obligatorio'),
    }),
    // Paso 3 — Categoría
    Yup.object({
        categoryTitle: Yup.string().required('Selecciona una categoría'),
    }),
    // Paso 4 — Mapa
    Yup.object({
        coordinates: Yup.array()
            .min(2, 'Añade al menos 2 puntos en el mapa')
            .required('Las coordenadas son obligatorias'),
    }),
    // Paso 5 — Imágenes
    Yup.object({
        images: Yup.array().min(1, 'Añade al menos una imagen').required(),
    }),
    // Paso 6 — Resumen (sin validación adicional)
    Yup.object({}),
];

// Valores iniciales
const initialValues: ICreateRoute = {
    title: '',
    description: '',
    location: '',
    distance: 0,
    duration: 0,
    difficulty: 'fácil',
    typeRoute: 'circular',
    coordinates: [],
    categoryTitle: '',
    images: [],
};

// Variantes de animación para la transición entre pasos del wizard (efecto de slide).
const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
};

const stepLabels = ['Información', 'Detalles', 'Categoría', 'Mapa', 'Imágenes', 'Resumen'];

// Componente principal
export default function CreateRouteWizard() {
    const [step, setStep] = useState(1);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [imageUploadWarning, setImageUploadWarning] = useState<string | null>(null);
    const router = useRouter();
    // useTransition permite marcar router.push() como una transición de baja prioridad.
    // isPending (isNavigating) permanece true desde que se llama startNavigation() hasta que
    // Next.js ha fetchado y renderizado completamente la nueva página. Así el spinner del
    // botón "Crear Ruta" cubre todo el proceso: mutaciones → subida de imágenes → navegación,
    // sin el hueco que habría si solo usásemos isPending de las mutaciones de TanStack Query.
    const [isNavigating, startNavigation] = useTransition();
    const { mutateAsync: createRouteMutateAsync, isPending: isCreatePending } = useCreateRoute();
    const { mutateAsync: uploadImageAsync, isPending: isUploadPending } = useUploadRouteImage();

    // Avanzar al siguiente paso con validación parcial
    const handleNext = async (
        values: ICreateRoute,
        helpers: FormikHelpers<ICreateRoute>,
    ) => {
        try {
            await STEP_SCHEMAS[step - 1].validate(values, { abortEarly: false });
            setStep((s) => s + 1);
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors: Partial<Record<keyof ICreateRoute, string>> = {};
                const touched: Partial<Record<keyof ICreateRoute, boolean>> = {};
                err.inner.forEach((e) => {
                    if (e.path) {
                        errors[e.path as keyof ICreateRoute] = e.message;
                        touched[e.path as keyof ICreateRoute] = true;
                    }
                });
                helpers.setErrors(errors);
                helpers.setTouched(touched as FormikTouched<ICreateRoute>);
            }
        }
    };

    // Submit final — llamado desde Step6Review via submitForm()
    const handleFormSubmit = async (values: ICreateRoute) => {
        setSubmitError(null);
        setImageUploadWarning(null);

        try {
            const route = await createRouteMutateAsync(values);

            const failedImages: string[] = [];
            for (const file of values.images) {
                try {
                    await uploadImageAsync({ idRoute: route.idRoute, file });
                } catch {
                    failedImages.push(file.name);
                }
            }

            if (failedImages.length > 0) {
                setImageUploadWarning(
                    `La ruta se creó correctamente, pero no se pudieron subir algunas imágenes: ${failedImages.join(', ')}`
                );
            }

            // Envolvemos router.push en startNavigation para que isNavigating sea true
            // durante la transición de página — el spinner no se apaga hasta llegar al detalle.
            startNavigation(() => {
                router.push(`/route/${route.slug}`);
            });
        } catch (err) {
            const axiosErr = err as {
                response?: { status: number; data?: { message?: string } };
            };
            if (axiosErr.response?.status === 422) {
                setSubmitError('Los datos introducidos no son válidos. Revisa el formulario.');
            } else if (axiosErr.response?.status === 404) {
                setSubmitError('La categoría seleccionada no existe. Vuelve al paso 3.');
            } else if (axiosErr.response?.status === 401) {
                setSubmitError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            } else {
                setSubmitError('Ha ocurrido un error inesperado. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            {/* Cabecera */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-teal-700">Crear nueva ruta</h1>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    Paso {step} de 6
                </span>
            </div>

            {/* Indicador de pasos */}
            <StepIndicator
                currentStep={step}
                totalSteps={6}
                stepLabels={stepLabels}
                onStepClick={(s) => setStep(s)}
                completedSteps={Array.from({ length: step - 1 }, (_, i) => i + 1)}
            />

            {/* Formik global */}
            <Formik
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {(formik) => (
                    <form onSubmit={formik.handleSubmit} noValidate>
                        {/* Transición entre pasos */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                            >
                                {step === 1 && (
                                    <Step1BasicInfo
                                        values={formik.values}
                                        errors={formik.errors}
                                        touched={formik.touched}
                                        handleChange={formik.handleChange}
                                        handleBlur={formik.handleBlur}
                                    />
                                )}
                                {step === 2 && (
                                    <Step2TechnicalDetails
                                        values={formik.values}
                                        errors={formik.errors}
                                        touched={formik.touched}
                                        handleChange={formik.handleChange}
                                        handleBlur={formik.handleBlur}
                                        setFieldValue={formik.setFieldValue}
                                    />
                                )}
                                {step === 3 && (
                                    <Step3Category
                                        values={formik.values}
                                        errors={formik.errors}
                                        touched={formik.touched}
                                        setFieldValue={formik.setFieldValue}
                                    />
                                )}
                                {step === 4 && (
                                    <Step4MapWrapper
                                        values={formik.values}
                                        errors={formik.errors}
                                        touched={formik.touched}
                                        setFieldValue={formik.setFieldValue}
                                    />
                                )}
                                {step === 5 && (
                                    <Step5ImageUpload
                                        values={formik.values}
                                        setFieldValue={formik.setFieldValue}
                                        errors={formik.errors}
                                        touched={formik.touched}
                                        onNext={() => handleNext(formik.values, formik)}
                                        onBack={() => setStep(4)}
                                    />
                                )}
                                {step === 6 && (
                                    <Step6Review
                                        values={formik.values}
                                        onSubmit={formik.submitForm}
                                        onBack={() => setStep(5)}
                                        isSubmitting={isCreatePending || isUploadPending || isNavigating}
                                        submitError={submitError}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Botones de navegación — solo pasos 1-4 (pasos 5 y 6 tienen los suyos propios) */}
                        {step < 5 && (
                            <div className="flex justify-between mt-8">
                                {/* Botón "Anterior" — oculto en paso 1 */}
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep((s) => s - 1)}
                                        className="flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2.5 rounded-full font-medium transition-colors"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4" />
                                        Anterior
                                    </button>
                                ) : (
                                    <div />
                                )}

                                {/* Botón "Siguiente" / "Añadir imágenes" */}
                                <button
                                    type="button"
                                    onClick={() => handleNext(formik.values, formik)}
                                    className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
                                >
                                    {step === 4 ? 'Añadir imágenes' : 'Siguiente'}
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Aviso de fallos en la subida de imágenes */}
                        {imageUploadWarning && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                                {imageUploadWarning}
                            </div>
                        )}
                    </form>
                )}
            </Formik>
        </div>
    );
}
