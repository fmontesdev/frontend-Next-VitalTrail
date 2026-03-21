'use client';

import { useState, useEffect, useRef } from 'react';
import { FormikErrors, FormikTouched } from 'formik';
import { PhotoIcon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { ICreateRoute } from '@/shared/interfaces/entities/route.interface';

interface IStep5ImageUploadProps {
    values: ICreateRoute;
    setFieldValue: (field: string, value: unknown) => void;
    errors: FormikErrors<ICreateRoute>;
    touched: FormikTouched<ICreateRoute>;
    onNext: () => void;
    onBack: () => void;
}

const ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/webp',
    'image/avif', 'image/gif', 'image/svg+xml',
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function validateFile(file: File): string | null {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return `Tipo de archivo no permitido: ${file.type}`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return `"${file.name}" supera el tamaño máximo de 5 MB`;
    }
    return null;
}

export default function Step5ImageUpload({
    values,
    setFieldValue,
    errors,
    touched,
    onNext,
    onBack,
}: IStep5ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [objectUrls, setObjectUrls] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const urls = values.images.map((file) => URL.createObjectURL(file));
        setObjectUrls(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [values.images]);

    function processFiles(files: File[]) {
        const validFiles: File[] = [];
        let firstError: string | null = null;

        for (const file of files) {
            const error = validateFile(file);
            if (error) {
                if (firstError === null) firstError = error;
            } else {
                validFiles.push(file);
            }
        }

        setFileError(firstError);

        if (validFiles.length > 0) {
            setFieldValue('images', [...values.images, ...validFiles]);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        processFiles(Array.from(e.target.files ?? []));
        e.target.value = '';
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }

    function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }

    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        processFiles(Array.from(e.dataTransfer.files));
    }

    function handleRemove(index: number) {
        const updated = values.images.filter((_, i) => i !== index);
        setFieldValue('images', updated);
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-teal-700">Añade imágenes a tu ruta</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Sube al menos una imagen. Formatos: JPG, PNG, WEBP, AVIF, GIF, SVG. Máximo 5 MB por archivo.
                </p>
            </div>

            {/* Click-to-select + drag-and-drop area */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center gap-2 transition-colors cursor-pointer select-none ${
                    isDragging
                        ? 'border-lime-500 bg-lime-50/60 text-lime-700'
                        : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-lime-400 hover:text-lime-600 hover:bg-lime-50/40'
                }`}
            >
                <PhotoIcon className="w-10 h-10" />
                <span className="font-medium">
                    {isDragging ? 'Suelta las imágenes aquí' : 'Haz clic para seleccionar imágenes'}
                </span>
                <span className="text-xs">o arrastra y suelta aquí</span>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Thumbnails grid */}
            {values.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                    {objectUrls.map((url, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-3xl overflow-hidden border border-gray-200 group"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={url}
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* File validation error */}
            {fileError && <p className="text-red-500 text-sm">{fileError}</p>}

            {/* Formik validation error (no images selected) */}
            {typeof errors.images === 'string' && touched.images && (
                <p className="text-red-500 text-sm">{errors.images}</p>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2.5 rounded-full font-medium transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Anterior
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
                >
                    Siguiente
                    <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
