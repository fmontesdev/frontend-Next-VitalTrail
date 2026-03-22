'use client';

import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// TODO: Conectar con el endpoint de facturas cuando esté disponible.
// Sustituir el array vacío por useInvoices(customerId) y mapear las filas.
export interface IInvoice {
    id: string;
    date: number;          // Unix timestamp
    amount: number;        // Importe en céntimos
    currency: string;
    status: 'paid' | 'open' | 'void' | 'uncollectible';
    description: string;
    pdfUrl: string | null;
}

const STATUS_LABELS: Record<IInvoice['status'], { label: string; className: string }> = {
    paid: { label: 'Pagada', className: 'bg-lime-50 text-lime-700 border border-lime-200' },
    open: { label: 'Pendiente', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
    void: { label: 'Anulada', className: 'bg-stone-100 text-stone-500 border border-stone-200' },
    uncollectible: { label: 'Fallida', className: 'bg-red-50 text-red-600 border border-red-200' },
};

function InvoiceRowSkeleton() {
    return (
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-stone-100 animate-pulse">
            <div className="space-y-1.5">
                <div className="h-3.5 w-40 bg-stone-200 rounded" />
                <div className="h-3 w-24 bg-stone-100 rounded" />
            </div>
            <div className="h-3.5 w-14 bg-stone-200 rounded self-center" />
            <div className="h-5 w-16 bg-stone-100 rounded-full self-center" />
            <div className="h-4 w-8 bg-stone-100 rounded self-center justify-self-end" />
        </div>
    );
}

export default function MyInvoices() {
    // Una vez disponible el endpoint, reemplazar con:
    // const { currentUser } = useAuth();
    // const customerId = currentUser?.user?.client?.customerId || null;
    // const { data: invoices, isLoading } = useInvoices(customerId);
    const invoices: IInvoice[] = [];
    const isLoading = false;

    const formatDate = (timestamp: number) =>
        new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const formatAmount = (amount: number, currency: string) =>
        new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100);

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div className="w-full py-2">
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    {/* Cabecera de tabla */}
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-stone-100 bg-stone-50">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Concepto</span>
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Importe</span>
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Estado</span>
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">PDF</span>
                    </div>
                    <InvoiceRowSkeleton />
                    <InvoiceRowSkeleton />
                    <InvoiceRowSkeleton />
                </div>
            </div>
        );
    }

    /* ── Sin facturas ── */
    if (invoices.length === 0) {
        return (
            <div className="w-full py-2">
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    {/* Cabecera de tabla */}
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-stone-100 bg-stone-50">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Concepto</span>
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Importe</span>
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Estado</span>
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">PDF</span>
                    </div>

                    {/* Empty state */}
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

    /* ── Lista de facturas ── */
    return (
        <div className="w-full py-2">
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                {/* Cabecera de tabla */}
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-stone-100 bg-stone-50">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Concepto</span>
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Importe</span>
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Estado</span>
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">PDF</span>
                </div>

                {/* Filas */}
                {invoices.map((invoice, index) => {
                    const statusConfig = STATUS_LABELS[invoice.status];
                    return (
                        <div
                            key={invoice.id}
                            className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4
                                ${index < invoices.length - 1 ? 'border-b border-stone-100' : ''}
                            `}
                        >
                            {/* Concepto + fecha */}
                            <div>
                                <p className="text-sm font-medium text-stone-700 leading-tight">
                                    {invoice.description}
                                </p>
                                <p className="text-xs text-stone-400 mt-0.5">
                                    {formatDate(invoice.date)}
                                </p>
                            </div>

                            {/* Importe */}
                            <span className="text-sm font-semibold text-stone-700 tabular-nums">
                                {formatAmount(invoice.amount, invoice.currency)}
                            </span>

                            {/* Estado */}
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig.className}`}>
                                {statusConfig.label}
                            </span>

                            {/* PDF */}
                            {invoice.pdfUrl ? (
                                <a
                                    href={invoice.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-stone-400 hover:text-teal-600 transition-colors"
                                    aria-label="Descargar factura PDF"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                </a>
                            ) : (
                                <span className="w-4 h-4" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
