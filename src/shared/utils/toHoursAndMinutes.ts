// Convierte una cadena de texto en horas y minutos
export function ToHoursAndMinutes(timeString: string): { hours: number, minutes: number } {
    const [hours, minutes] = timeString.split(":").map(Number);
    return { hours, minutes };
}    
