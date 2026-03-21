// Route Segment Config — impide que Next.js pre-renderice esta ruta en build time.
// La página lee el session_id de Stripe desde query params, que solo existen en runtime.
export const dynamic = 'force-dynamic';

export default function PremiumSuccessLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
