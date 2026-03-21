// Route Segment Config — impide que Next.js pre-renderice esta ruta en build time.
// La página lee cookies de auth en el servidor (PremiumGuard); las cookies solo existen en runtime.
export const dynamic = 'force-dynamic';

export default function NewRouteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
