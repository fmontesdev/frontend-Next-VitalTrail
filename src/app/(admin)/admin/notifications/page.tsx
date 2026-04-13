import type { Metadata } from 'next';
import AdminNotificationsClient from '@/components/admin/notifications/AdminNotificationsClient';

export const metadata: Metadata = {
    title: 'Enviar Notificaciones | Admin',
};

export default function AdminNotificationsPage() {
    return <AdminNotificationsClient />;
}
