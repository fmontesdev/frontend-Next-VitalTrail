/**
 * Formats a "YYYY-MM" string into a short localized label, e.g. "Mar 25".
 * Used by chart components that display monthly data axes.
 */
export function formatMonth(month: string): string {
    const [year, m] = month.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[parseInt(m) - 1]} ${year.slice(2)}`;
}
