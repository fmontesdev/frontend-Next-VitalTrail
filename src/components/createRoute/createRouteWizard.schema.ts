import * as Yup from 'yup';
import { ICreateRoute } from '@/shared/interfaces/entities/route.interface';

// Esquemas de validación por paso — índice 0 = paso 1
export const STEP_SCHEMAS = [
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

export const INITIAL_VALUES: ICreateRoute = {
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
