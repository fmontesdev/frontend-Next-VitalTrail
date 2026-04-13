'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserSearchSelect from './UserSearchSelect';
import { ISendNotificationInput, NotificationType, TargetingMode } from '@/shared/interfaces/entities/notification.interface';

interface ISendNotificationFormProps {
    onValidSubmit: (values: ISendNotificationInput) => void;
    isSubmitting: boolean;
    successMsg?: string | null;
    errorMsg?: string | null;
}

const notificationTypes: { value: NotificationType; label: string }[] = [
    { value: 'system', label: 'Sistema' },
    { value: 'social', label: 'Social' },
    { value: 'subscription', label: 'Suscripción' },
    { value: 'admin', label: 'Administración' },
];

const targetingOptions: { value: TargetingMode; label: string; description: string }[] = [
    { value: 'broadcast', label: 'Todos', description: 'Enviar a todos los usuarios' },
    { value: 'role', label: 'Por rol', description: 'Enviar a un rol específico' },
    { value: 'individual', label: 'Individual', description: 'Enviar a un usuario específico' },
];

const validationSchema = Yup.object({
    title: Yup.string().required('El título es obligatorio').max(100, 'Máximo 100 caracteres'),
    description: Yup.string().required('La descripción es obligatoria').max(500, 'Máximo 500 caracteres'),
    type: Yup.string().required('El tipo es obligatorio').oneOf(['system', 'social', 'subscription', 'admin'], 'Tipo inválido'),
    targetingMode: Yup.string().required('Seleccioná el destinatario'),
    targetRole: Yup.string().when('targetingMode', {
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
    title: '',
    description: '',
    type: 'admin',
    targetingMode: 'broadcast',
    targetUserId: '',
    targetRole: '',
};

export default function SendNotificationForm({
    onValidSubmit,
    isSubmitting,
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
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-teal-700 mb-1">
                    Título
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Título de la notificación"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-600 ${
                        formik.touched.title && formik.errors.title ? 'border-red-400' : 'border-stone-300'
                    }`}
                />
                {formik.touched.title && formik.errors.title && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.title}</p>
                )}
            </div>

            {/* Descripción */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-teal-700 mb-1">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Contenido de la notificación"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-600 resize-none ${
                        formik.touched.description && formik.errors.description ? 'border-red-400' : 'border-stone-300'
                    }`}
                />
                {formik.touched.description && formik.errors.description && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.description}</p>
                )}
            </div>

            {/* Tipo */}
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-teal-700 mb-1">
                    Tipo
                </label>
                <select
                    id="type"
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-600 ${
                        formik.touched.type && formik.errors.type ? 'border-red-400' : 'border-stone-300'
                    }`}
                >
                    {notificationTypes.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
                {formik.touched.type && formik.errors.type && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.type}</p>
                )}
            </div>

            {/* Modo de targeting */}
            <div>
                <span className="block text-sm font-medium text-teal-700 mb-2">Destinatarios</span>
                <div className="space-y-2">
                    {targetingOptions.map((opt) => (
                        <label
                            key={opt.value}
                            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                formik.values.targetingMode === opt.value
                                    ? 'border-teal-500 bg-teal-50'
                                    : 'border-stone-200 hover:bg-stone-50'
                            }`}
                        >
                            <input
                                type="radio"
                                name="targetingMode"
                                value={opt.value}
                                checked={formik.values.targetingMode === opt.value}
                                onChange={() => {
                                    formik.setFieldValue('targetingMode', opt.value);
                                    formik.setFieldValue('targetUserId', '');
                                    formik.setFieldValue('targetRole', '');
                                }}
                                className="mt-0.5 accent-teal-600"
                            />
                            <div>
                                <p className="text-sm font-medium text-stone-700">{opt.label}</p>
                                <p className="text-xs text-stone-400">{opt.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
                {formik.touched.targetingMode && formik.errors.targetingMode && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.targetingMode}</p>
                )}
            </div>

            {/* Condicional: rol */}
            {formik.values.targetingMode === 'role' && (
                <div>
                    <label htmlFor="targetRole" className="block text-sm font-medium text-teal-700 mb-1">
                        Rol destinatario
                    </label>
                    <select
                        id="targetRole"
                        name="targetRole"
                        value={formik.values.targetRole}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-600 ${
                            formik.touched.targetRole && formik.errors.targetRole ? 'border-red-400' : 'border-stone-300'
                        }`}
                    >
                        <option value="">Seleccioná un rol</option>
                        <option value="ROLE_CLIENT">Cliente</option>
                        <option value="ROLE_ADMIN">Administrador</option>
                    </select>
                    {formik.touched.targetRole && formik.errors.targetRole && (
                        <p className="mt-1 text-xs text-red-500">{formik.errors.targetRole}</p>
                    )}
                </div>
            )}

            {/* Condicional: usuario individual */}
            {formik.values.targetingMode === 'individual' && (
                <div>
                    <label className="block text-sm font-medium text-teal-700 mb-1">
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

            {/* Botón submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-lime-600 hover:bg-lime-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Enviando...' : 'Enviar notificación'}
            </button>
        </form>
    );
}
