'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    UsersIcon, UserGroupIcon, UserIcon, ShieldCheckIcon,
    InformationCircleIcon, UserPlusIcon, SparklesIcon, MegaphoneIcon,
} from '@heroicons/react/24/outline';
import UserSearchSelect from './UserSearchSelect';
import { ISendNotificationInput, NotificationType, TargetingMode } from '@/shared/interfaces/entities/notification.interface';

interface ISendNotificationFormProps {
    onValidSubmit: (values: ISendNotificationInput) => void;
    successMsg?: string | null;
    errorMsg?: string | null;
}

const notificationTypes: { value: NotificationType; label: string; Icon: React.ElementType }[] = [
    { value: 'system',       label: 'Sistema',       Icon: InformationCircleIcon },
    { value: 'social',       label: 'Social',        Icon: UserPlusIcon },
    { value: 'subscription', label: 'Suscripción',   Icon: SparklesIcon },
    { value: 'admin',        label: 'Administración', Icon: MegaphoneIcon },
];

const targetingOptions: { value: TargetingMode; label: string; description: string; Icon: React.ElementType }[] = [
    { value: 'broadcast',  label: 'Todos',       description: 'Todos los usuarios',    Icon: UsersIcon },
    { value: 'role',       label: 'Por rol',     description: 'Un rol específico',     Icon: UserGroupIcon },
    { value: 'individual', label: 'Individual',  description: 'Un usuario específico', Icon: UserIcon },
];

const roleOptions: { value: string; label: string; Icon: React.ElementType }[] = [
    { value: 'ROLE_CLIENT', label: 'Cliente',       Icon: UserIcon },
    { value: 'ROLE_ADMIN',  label: 'Administrador', Icon: ShieldCheckIcon },
];

const validationSchema = Yup.object({
    title:        Yup.string().required('El título es obligatorio').max(100, 'Máximo 100 caracteres'),
    description:  Yup.string().required('La descripción es obligatoria').max(500, 'Máximo 500 caracteres'),
    type:         Yup.string().required('El tipo es obligatorio').oneOf(['system', 'social', 'subscription', 'admin'], 'Tipo inválido'),
    targetingMode: Yup.string().required('Seleccioná el destinatario'),
    targetRole:   Yup.string().when('targetingMode', {
        is: 'role',
        then: (s) => s.required('Seleccioná un rol'),
        otherwise: (s) => s.optional(),
    }),
    targetUserId: Yup.string().when('targetingMode', {
        is: 'individual',
        then: (s) => s.required('Seleccioná un usuario'),
        otherwise: (s) => s.optional(),
    }),
});

const initialValues: ISendNotificationInput = {
    title:         '',
    description:   '',
    type:          'admin',
    targetingMode: 'broadcast',
    targetUserId:  '',
    targetRole:    '',
};

const inputClass = `
    w-full border border-stone-200 rounded-3xl px-4 py-3 text-sm text-stone-800
    focus:outline-none focus:ring-1 focus:ring-lime-500 focus:border-lime-600
    transition-colors placeholder-stone-400
`;

export default function SendNotificationForm({
    onValidSubmit,
    successMsg,
    errorMsg,
}: ISendNotificationFormProps) {
    const formik = useFormik<ISendNotificationInput>({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            onValidSubmit(values);
        },
    });

    useEffect(() => {
        if (successMsg) {
            formik.resetForm();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successMsg]);

    return (
        <form id="send-notification-form" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-10">

                {/* ── Columna izquierda: contenido ── */}
                <div className="space-y-6">

                    {/* Título */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-stone-500 mb-1">
                            Título
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Ej: Actualización de la plataforma"
                            className={`${inputClass} ${formik.touched.title && formik.errors.title ? 'border-red-400' : ''}`}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="mt-1 text-xs text-red-500">{formik.errors.title}</p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="description" className="text-sm font-medium text-stone-500">
                                Descripción
                            </label>
                            <span className="text-xs text-stone-400">{formik.values.description.length}/500</span>
                        </div>
                        <textarea
                            id="description"
                            name="description"
                            rows={6}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Describe el motivo o el contenido de la notificación..."
                            className={`${inputClass} resize-none ${formik.touched.description && formik.errors.description ? 'border-red-400' : ''}`}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="mt-1 text-xs text-red-500">{formik.errors.description}</p>
                        )}
                    </div>

                    {/* Tipo — segmented control */}
                    <div>
                        <p className="text-sm font-medium text-stone-500 mb-2">Tipo</p>
                        <div className="flex rounded-3xl border-2 border-stone-200 overflow-hidden">
                            {notificationTypes.map((t) => {
                                const isSelected = formik.values.type === t.value;
                                const { Icon } = t;
                                return (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => formik.setFieldValue('type', t.value)}
                                        className={`
                                            flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2
                                            text-xs font-medium transition-all
                                            border-r border-stone-200 last:border-r-0
                                            ${isSelected
                                                ? 'bg-lime-600 text-white'
                                                : 'bg-white text-stone-600 hover:bg-stone-50'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span>{t.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {formik.touched.type && formik.errors.type && (
                            <p className="mt-1 text-xs text-red-500">{formik.errors.type}</p>
                        )}
                    </div>
                </div>

                {/* ── Columna derecha: destinatarios ── */}
                <div className="space-y-6">

                    {/* Targeting — segmented control */}
                    <div>
                        <p className="text-sm font-medium text-stone-500 mb-2">Destinatarios</p>
                        <div className="flex rounded-3xl border-2 border-stone-200 overflow-hidden">
                            {targetingOptions.map((opt) => {
                                const isSelected = formik.values.targetingMode === opt.value;
                                const { Icon } = opt;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            formik.setFieldValue('targetingMode', opt.value);
                                            formik.setFieldValue('targetUserId', '');
                                            formik.setFieldValue('targetRole', '');
                                        }}
                                        className={`
                                            flex-1 flex flex-col items-center justify-center gap-1 py-4 px-3
                                            font-medium text-sm transition-all
                                            border-r border-stone-200 last:border-r-0
                                            ${isSelected
                                                ? 'bg-lime-600 text-white'
                                                : 'bg-white text-stone-600 hover:bg-stone-50'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        <span>{opt.label}</span>
                                        <span className={`text-xs ${isSelected ? 'text-lime-100' : 'text-stone-400'}`}>
                                            {opt.description}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {formik.touched.targetingMode && formik.errors.targetingMode && (
                            <p className="mt-1 text-xs text-red-500">{formik.errors.targetingMode}</p>
                        )}
                    </div>

                    {/* Condicional: rol — segmented control */}
                    {formik.values.targetingMode === 'role' && (
                        <div>
                            <p className="text-sm font-medium text-stone-500 mb-2">Rol destinatario</p>
                            <div className="flex rounded-3xl border-2 border-stone-200 overflow-hidden">
                                {roleOptions.map((opt) => {
                                    const isSelected = formik.values.targetRole === opt.value;
                                    const { Icon } = opt;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => formik.setFieldValue('targetRole', opt.value)}
                                            className={`
                                                flex-1 flex flex-col items-center justify-center gap-1 py-4 px-3
                                                font-medium text-sm transition-all
                                                border-r border-stone-200 last:border-r-0
                                                ${isSelected
                                                    ? 'bg-lime-600 text-white'
                                                    : 'bg-white text-stone-600 hover:bg-stone-50'
                                                }
                                            `}
                                        >
                                            <Icon className="w-5 h-5 shrink-0" />
                                            <span>{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {formik.touched.targetRole && formik.errors.targetRole && (
                                <p className="mt-1 text-xs text-red-500">{formik.errors.targetRole}</p>
                            )}
                        </div>
                    )}

                    {/* Condicional: usuario individual */}
                    {formik.values.targetingMode === 'individual' && (
                        <div>
                            <label className="block text-sm font-medium text-stone-500 mb-2">
                                Usuario destinatario
                            </label>
                            <UserSearchSelect
                                onSelect={(userId) => formik.setFieldValue('targetUserId', userId)}
                                fieldError={
                                    formik.touched.targetUserId && formik.errors.targetUserId
                                        ? formik.errors.targetUserId
                                        : undefined
                                }
                            />
                        </div>
                    )}

                    {/* Mensajes de estado */}
                    {successMsg && (
                        <p className="text-sm text-green-600 font-medium">{successMsg}</p>
                    )}
                    {errorMsg && (
                        <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
                    )}
                </div>
            </div>
        </form>
    );
}
