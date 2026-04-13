'use client';

import { useState } from 'react';
import { useSendNotificationMutation } from '@/mutations/notificationMutation';
import SendNotificationForm from './SendNotificationForm';
import ConfirmModal from '@/components/admin/common/ConfirmModal';
import { ISendNotificationInput } from '@/shared/interfaces/entities/notification.interface';

export default function AdminNotificationsClient() {
    const [pendingSubmit, setPendingSubmit] = useState<ISendNotificationInput | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const mutation = useSendNotificationMutation();

    const handleValidSubmit = (values: ISendNotificationInput) => {
        setErrorMsg(null);
        setSuccessMsg(null);

        if (values.targetingMode === 'broadcast') {
            setPendingSubmit(values);
        } else {
            mutation.mutate(values, {
                onSuccess: () => {
                    setSuccessMsg('Notificación enviada correctamente.');
                },
                onError: (err: Error) => {
                    setErrorMsg(err.message || 'Ocurrió un error al enviar la notificación.');
                },
            });
        }
    };

    const handleConfirmBroadcast = () => {
        if (!pendingSubmit) return;
        const values = pendingSubmit;
        setPendingSubmit(null);

        mutation.mutate(values, {
            onSuccess: () => {
                setSuccessMsg('Notificación enviada a todos los usuarios.');
            },
            onError: (err: Error) => {
                setErrorMsg(err.message || 'Ocurrió un error al enviar la notificación.');
            },
        });
    };

    const handleCancelBroadcast = () => {
        setPendingSubmit(null);
    };

    return (
        <div>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-teal-700">Enviar Notificaciones</h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Enviá notificaciones a todos los usuarios, un rol específico o un usuario individual.
                    </p>
                </div>
                <button
                    type="submit"
                    form="send-notification-form"
                    disabled={mutation.isPending}
                    className="bg-lime-600 hover:bg-lime-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                >
                    {mutation.isPending ? 'Enviando...' : 'Enviar'}
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8">
                <SendNotificationForm
                    onValidSubmit={handleValidSubmit}
                    successMsg={successMsg}
                    errorMsg={errorMsg}
                />
            </div>

            <ConfirmModal
                isOpen={!!pendingSubmit}
                title="Enviar a todos los usuarios"
                message="Estás a punto de enviar esta notificación a TODOS los usuarios registrados. ¿Confirmás la acción?"
                confirmLabel="Sí, enviar"
                cancelLabel="Cancelar"
                variant="warning"
                onConfirm={handleConfirmBroadcast}
                onCancel={handleCancelBroadcast}
            />
        </div>
    );
}
