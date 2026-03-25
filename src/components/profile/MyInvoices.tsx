'use client';

import { DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { useInvoicesQuery } from '@/queries/stripeQuery';
import { IInvoice } from '@/shared/interfaces/entities/invoice.interface';

const STATUS_LABELS: Record<IInvoice['status'], { label: string; className: string }> = {
    paid:          { label: 'Pagada',    className: 'bg-lime-50 text-lime-700 border border-lime-200' },
    open:          { label: 'Pendiente', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
    void:          { label: 'Anulada',   className: 'bg-stone-100 text-stone-500 border border-stone-200' },
    uncollectible: { label: 'Fallida',   className: 'bg-red-50 text-red-600 border border-red-200' },
};

// Nº factura | Fecha | Concepto | Importe | Estado | PDF
const GRID = 'grid grid-cols-[0.9fr_0.6fr_3fr_auto_0.5fr_auto] gap-10 items-center px-6';

function TableHeader() {
    return (
        <div className={`${GRID} py-3 border-b border-stone-100 bg-stone-50`}>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest pl-0.5">Nº factura</span>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest pl-1">Fecha</span>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest pl-1">Concepto</span>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest pl-1">Importe</span>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest pl-1">Estado</span>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">PDF</span>
        </div>
    );
}

function InvoiceRowSkeleton() {
    return (
        <div className={`${GRID} py-4 border-b border-stone-100 animate-pulse`}>
            <div className="h-3.5 w-28 bg-stone-200 rounded" />
            <div className="h-3.5 w-20 bg-stone-100 rounded" />
            <div className="space-y-1.5">
                <div className="h-3.5 w-36 bg-stone-200 rounded" />
                <div className="h-3 w-40 bg-stone-100 rounded" />
            </div>
            <div className="h-3.5 w-12 bg-stone-200 rounded" />
            <div className="h-5 w-16 bg-stone-100 rounded-full" />
            <div className="h-5 w-5 bg-stone-100 rounded" />
        </div>
    );
}

export default function MyInvoices() {
    const { currentUser } = useAuth();
    const customerId = currentUser?.user?.client?.customerId || null;

    const { data: invoices = [], isLoading, isError } = useInvoicesQuery(customerId);

    const formatDate = (timestamp: number) =>
        new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const formatPeriod = (start: number, end: number) =>
        `${formatDate(start)} – ${formatDate(end)}`;

    const formatAmount = (amount: number, currency: string) =>
        new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100);

    /* Loading */
    if (isLoading) {
        return (
            <div className="w-full py-2">
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <TableHeader />
                    <InvoiceRowSkeleton />
                    <InvoiceRowSkeleton />
                    <InvoiceRowSkeleton />
                </div>
            </div>
        );
    }

    /* Error */
    if (isError) {
        return (
            <div className="w-full py-2">
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <TableHeader />
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-stone-600 font-medium text-sm">No se pudieron cargar las facturas</p>
                            <p className="text-stone-400 text-xs mt-0.5">Inténtalo de nuevo más tarde.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* Sin facturas */
    if (invoices.length === 0) {
        return (
            <div className="w-full py-2">
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <TableHeader />
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className="w-11 h-11 rounded-full bg-stone-100 flex items-center justify-center">
                            <DocumentTextIcon className="w-5 h-5 text-stone-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-stone-600 font-medium text-sm">Sin facturas todavía</p>
                            <p className="text-stone-400 text-xs mt-0.5">Tu historial de pagos aparecerá aquí.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* Lista de facturas */
    return (
        <div className="w-full py-2">
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <TableHeader />

                {invoices.map((invoice, index) => {
                    const statusConfig = STATUS_LABELS[invoice.status] ?? STATUS_LABELS.open;
                    return (
                        <div
                            key={invoice.id}
                            className={`${GRID} py-3 ${index < invoices.length - 1 ? 'border-b border-stone-100' : ''}`}
                        >
                            {/* Nº factura */}
                            {invoice.invoiceUrl ? (
                                <a
                                    href={invoice.invoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-teal-50 hover:bg-teal-400/25
                                        text-[12px] font-semibold text-teal-700 tabular-nums whitespace-nowrap
                                        border border-teal-500/60 hover:border-teal-800/30 transition-colors duration-150"
                                >
                                    {invoice.number}
                                </a>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50
                                    text-[12px] font-semibold text-teal-700 tabular-nums whitespace-nowrap border border-teal-200">
                                    {invoice.number}
                                </span>
                            )}

                            {/* Fecha de emisión */}
                            <span className="text-xs text-stone-500 whitespace-nowrap">
                                {formatDate(invoice.created)}
                            </span>

                            {/* Concepto: descripción · período */}
                            <p className="text-sm font-medium text-stone-700 truncate">
                                {invoice.description}
                                <span className="text-stone-300 mx-1.5 select-none font-normal">·</span>
                                <span className="text-xs font-normal text-stone-400">
                                    {formatPeriod(invoice.periodStart, invoice.periodEnd)}
                                </span>
                            </p>

                            {/* Importe */}
                            <span className="text-sm font-semibold text-stone-700 tabular-nums whitespace-nowrap">
                                {formatAmount(invoice.amountTotal, invoice.currency)}
                            </span>

                            {/* Estado */}
                            <span className={`inline-block px-3 py-0.5 rounded-full text-[12px] font-semibold ${statusConfig.className}`}>
                                {statusConfig.label}
                            </span>

                            {/* PDF */}
                            {invoice.invoicePdf ? (
                                <a
                                    href={invoice.invoicePdf}
                                    download={`${invoice.number}.pdf`}
                                    className="text-red-600/60 hover:text-red-600 transition-colors"
                                    aria-label="Descargar factura PDF"
                                >
                                    <DocumentArrowDownIcon className="w-5 h-5" />
                                </a>
                            ) : (
                                <span className="w-5 h-5" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
