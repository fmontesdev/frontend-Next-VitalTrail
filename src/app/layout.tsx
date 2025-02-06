import type { Metadata } from "next";
import { quicksand } from "./fonts";
import "./globals.css";

import { QueryCliProvider } from "./(browse)/QueryClientProvider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
    metadataBase: new URL('https://vitaltrail.com'),
    title: "VitalTrail",
    description: "Explora el exterior, equilibra tu interior",
    keywords: ['rutas', 'senderismo', 'montaña', 'naturaleza', 'aire libre', 'equilibrio', 'vida sana'],
    robots: {
        index: true,
        follow: true
    },
    openGraph: {
        title: 'VitalTrail',
        description: 'Explora el exterior, equilibra tu interior',
        url: 'https://vitaltrail.com',
        siteName: 'VitalTrail',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${quicksand.className} antialiased flex flex-col min-h-screen`}>
                <QueryCliProvider>
                    <Header />
                        {children}
                    <Footer />
                </QueryCliProvider>
            </body>
        </html>
    );
}
