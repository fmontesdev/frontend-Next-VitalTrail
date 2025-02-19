// Formatea fechas en formato "dd de mes de yyyy"
export function FormatDate(dateString: string): string {
    // Parsear la fecha de entrada
    const [day, month, year] = dateString.split(' ')[0].split('-');
    const date = new Date(`${year}-${month}-${day}`);

    // Formatear la fecha en el formato deseado
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

// Convierte fecha de date-picker al formato "dd-mm-yyyy"
export function FormatToDD_MM_YYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses comienzan en 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Convierte fecha en formato "dd-mm-yyyy" y tipo string a un objeto Date
export function ParseDD_MM_YYYY(dateStr: string): Date | null {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return isNaN(date.getTime()) ? null : date;
}
