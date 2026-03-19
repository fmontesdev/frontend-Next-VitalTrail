/**
 * Utilidades para parsear y formatear fechas de sesiones.
 * El backend devuelve fechas en formato "DD-MM-YYYY HH:MM" (no ISO 8601).
 */

/**
 * Parsea una fecha en formato "DD-MM-YYYY HH:MM" a un objeto Date.
 * Devuelve null si el formato es inválido.
 */
export function parseSessionDate(dateStr: string): Date | null {
    // Formato esperado: "DD-MM-YYYY HH:MM"
    const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/);
    if (!match) return null;

    const [, day, month, year, hours, minutes] = match;
    // Usar Date.UTC para evitar el desfase de zona horaria al comparar con Date.now()
    const date = new Date(Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
    ));
    return isNaN(date.getTime()) ? null : date;
}

/**
 * Calcula el tiempo transcurrido en segundos entre startAt y ahora.
 * Devuelve 0 si startAt es inválido.
 */
export function getElapsedSeconds(startAt: string): number {
    const start = parseSessionDate(startAt);
    if (!start) return 0;
    const elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
    return Math.max(0, elapsed);
}

/**
 * Formatea una cantidad de segundos a "HH:MM:SS".
 */
export function formatElapsed(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}
