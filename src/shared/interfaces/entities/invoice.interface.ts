export interface IInvoice {
    id: string;
    number: string;
    status: 'paid' | 'open' | 'void' | 'uncollectible';
    amountTotal: number;    // importe en céntimos (ej. 399 = 3,99 €)
    currency: string;
    created: number;        // Unix timestamp, fecha de emisión
    description: string;    // descripción del concepto
    periodStart: number;    // Unix timestamp, inicio del período facturado
    periodEnd: number;      // Unix timestamp, fin del período facturado
    invoiceUrl: string;     // URL de visualización en Stripe
    invoicePdf: string;     // URL de descarga del PDF
}
