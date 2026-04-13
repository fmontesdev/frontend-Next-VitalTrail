'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartBarIcon, UsersIcon, CreditCardIcon, MapIcon, ArrowLeftIcon, BellAlertIcon } from '@heroicons/react/24/outline';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: ChartBarIcon, exact: true },
    { href: '/admin/users', label: 'Usuarios', icon: UsersIcon, exact: false },
    { href: '/admin/routes', label: 'Rutas', icon: MapIcon, exact: false },
    { href: '/admin/subscriptions', label: 'Suscripciones', icon: CreditCardIcon, exact: false },
    { href: '/admin/notifications', label: 'Notificaciones', icon: BellAlertIcon, exact: false },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-teal-800 to-teal-600 flex flex-col">
            <div className="px-6 py-4 border-b border-white/20">
                <span className="text-xl font-bold text-white">
                    VitalTrail Admin
                </span>
            </div>
            <nav className="flex-1 py-4">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                                active
                                    ? 'bg-white/20 text-white font-semibold'
                                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-white/20">
                <Link href="/routes" className="flex items-center gap-2 text-sm text-white/75 hover:text-white transition-colors px-2 py-1.5">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Volver al sitio
                </Link>
            </div>
        </aside>
    );
}
