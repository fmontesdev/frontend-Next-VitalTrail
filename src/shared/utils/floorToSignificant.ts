/**
 * Redondea hacia abajo al número significativo más cercano.
 * Solo aplica si n > 100; de lo contrario devuelve n sin cambios.
 *
 * Ejemplos: 125→120, 1547→1500, 8500→8500, 45000→45000, 6→6
 */
export function floorToSignificant(n: number): number {
    if (n <= 100) return n;
    const magnitude = Math.pow(10, Math.floor(Math.log10(n)) - 1);
    return Math.floor(n / magnitude) * magnitude;
}
