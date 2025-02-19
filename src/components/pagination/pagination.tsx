"use client";

import React, { useCallback } from 'react';
import Link from 'next/link';
import { buildQueryString } from '@/shared/utils/urlHelpers';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { IPaginationProps } from '@/shared/interfaces/props/props.interface';

export default function Pagination({ totalRoutes, limit, params, url }: IPaginationProps) {
    const totalPages = Math.ceil(totalRoutes / limit);
    const { page = '1' } = params;
    const currentPage = parseInt(page);
    const maxPageButtons = 5; // Número máximo de botones visibles

    if (totalPages <= 1) return null; // Si solo hay una página, ocultamos la paginación

    // Función para generar los números de página mostrados
    const getPageNumbers = () => {
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage < maxPageButtons - 1) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    // Función que construye la URL para la paginación, memorizada
    const buildUrl = useCallback((page: number) => {
        return `${url}${buildQueryString({ ...params, page })}`;
    }, [url, params]);

    return (
        <div className="flex justify-center items-center space-x-2 mt-6 text-gray-300">
            {/* Botón prev */}
            {currentPage === 1 ? (
                <div className="px-1.5 py-1.5 rounded-full text-gray-200 cursor-not-allowed">
                    <ChevronLeftIcon strokeWidth={3} className="w-5 h-5" />
                </div>
            ) : (
                <Link
                    href={buildUrl(currentPage - 1)}
                    className="px-1.5 py-1.5 rounded-full text-gray-600 hover:bg-stone-300 hover:text-white"
                >
                    <ChevronLeftIcon strokeWidth={3} className="w-5 h-5" />
                </Link>
            )}

            {/* Números de Página */}
            {getPageNumbers().map((page) => (
                <Link
                    key={page}
                    href={buildUrl(page)}
                    className={`
                        px-3.5 py-1.5 rounded-full transition
                        ${currentPage === page
                            ? "bg-lime-500 text-white font-bold"
                            : "bg-stone-300 text-white font-bold hover:bg-stone-400"
                        }
                    `}
                >
                    {page}
                </Link>
            ))}

            {/* Botón next */}
            {currentPage === totalPages ? (
                <div className="px-1.5 py-1.5 rounded-full text-gray-200 cursor-not-allowed">
                    <ChevronRightIcon strokeWidth={3} className="w-5 h-5" />
                </div>
            ) : (
                <Link
                    href={buildUrl(currentPage + 1)}
                    className="px-1.5 py-1.5 rounded-full text-gray-600 hover:bg-stone-300 hover:text-white"
                >
                    <ChevronRightIcon strokeWidth={3} className="w-5 h-5" />
                </Link>
            )}
        </div>
    );
}
