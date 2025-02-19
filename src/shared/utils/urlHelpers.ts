export function buildQueryString(params: Record<string, string | number>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== 0) {
            searchParams.set(key, value.toString());
        }
    });
    return `?${searchParams.toString()}`;
}