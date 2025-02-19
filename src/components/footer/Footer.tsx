import Link from 'next/link';
import { merienda } from '@/app/fonts';

export default function Footer() {
    return (
        <footer className="bg-teal-800 text-white py-4 text-base font-medium mt-auto">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" aria-label="Inicio">
                    <span className={`${merienda.className} antialiased text-2xl font-black text-white hover:text-lime-400`}>
                        VitalTrail
                    </span>
                </Link>

                {/* Enlaces */}
                <nav className="mt-2 md:mt-0 space-x-8">
                    <Link href="/about" className="text-white hover:text-lime-400">
                        Acerca de VitalTrail
                    </Link>
                    <Link href="/privacity" className="text-white hover:text-lime-400">
                        Política de privacidad
                    </Link>
                </nav>
            </div>
        </footer>
    )
}
