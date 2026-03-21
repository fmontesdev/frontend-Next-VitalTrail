'use client';

import Image from 'next/image';
import { FormikErrors, FormikTouched } from 'formik';
import { ErrorMessage } from 'formik';
import { useCategoryRoutes } from '@/queries/categoryRouteQuery';
import { ICategoryRoute } from '@/shared/interfaces/entities/categoryRoute.interface';
import { getImageUrl } from '@/shared/utils/imageUrl';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface IStep3Values {
    categoryTitle: string;
}

interface IStep3Props {
    values: IStep3Values;
    errors: FormikErrors<IStep3Values>;
    touched: FormikTouched<IStep3Values>;
    setFieldValue: (field: string, value: unknown) => void;
}

export default function Step3Category({
    values,
    errors,
    touched,
    setFieldValue,
}: IStep3Props) {
    const { data: categories, isLoading, isError, refetch } = useCategoryRoutes();

    const errorClass = 'text-red-500 text-sm mt-1';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-teal-700 mb-0.5">Categoría</h2>
                <p className="text-gray-500 text-sm">Selecciona la categoría que mejor describe tu ruta.</p>
            </div>

            {/* Estado: cargando */}
            {isLoading && (
                <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-gray-100 overflow-hidden animate-pulse"
                        >
                            <div className="h-36 bg-gray-200" />
                            <div className="p-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Estado: error */}
            {isError && !isLoading && (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <p className="text-gray-500">No se han podido cargar las categorías.</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* Estado: datos */}
            {!isLoading && !isError && categories && (
                <div className="grid grid-cols-3 gap-4">
                    {categories.map((category: ICategoryRoute) => {
                        const isSelected = values.categoryTitle === category.title;
                        return (
                            <button
                                key={category.idCategory}
                                type="button"
                                onClick={() => setFieldValue('categoryTitle', category.title)}
                                className={`
                                    relative rounded-2xl border-2 overflow-hidden text-left
                                    transition-all focus:outline-none focus:ring-1 focus:ring-lime-600
                                    ${isSelected
                                        ? 'border-lime-600/85 shadow-md'
                                        : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                    }
                                `}
                            >
                                {/* Imagen de la categoría */}
                                {category.imgCategory ? (
                                    <div className="relative h-32 w-full">
                                        <Image
                                            src={getImageUrl('category', category.imgCategory)}
                                            alt={category.title}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                        {/* Overlay oscuro */}
                                        <div className="absolute inset-0 bg-black/10" />
                                    </div>
                                ) : (
                                    <div className="h-32 w-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400 text-xs">Sin imagen</span>
                                    </div>
                                )}

                                {/* Nombre */}
                                <div className={`p-2 text-center transition-colors ${isSelected ? 'bg-lime-600/80' : 'bg-lime-200/50'}`}>
                                    <span className={`text-base font-medium capitalize ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                        {category.title}
                                    </span>
                                </div>

                                {/* Checkmark si está seleccionada */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <CheckCircleIcon className="w-5 h-5 text-lime-600 bg-white rounded-full" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            <ErrorMessage name="categoryTitle" component="p" className={errorClass} />
        </div>
    );
}
