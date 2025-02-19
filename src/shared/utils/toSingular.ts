// Elimina la "s" o "es" final de cada palabra
export function ToSingular(text: string): string {
    return text.split(" ").map(word => word.replace(/(es|s)$/i, "")).join(" ");
}    
