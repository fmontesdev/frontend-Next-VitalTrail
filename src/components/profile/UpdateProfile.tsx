'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useProfile } from '@/queries/profileQuery';
import { useUpdateProfile, useUploadAvatar } from '@/mutations/profileMutation';
import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormatToDD_MM_YYYY, ParseDD_MM_YYYY } from '@/shared/utils/formatDate';
import { getImageUrl } from '@/shared/utils/imageUrl';
import { CalendarDaysIcon, CheckCircleIcon, CameraIcon } from '@heroicons/react/24/outline';
import { IUpdProfile } from '@/shared/interfaces/entities/user.interface';

interface IUpdateProfileFormValues {
    name: string;
    surname: string;
    bio: string;
    birthday: Date | null;
    password: string;
    confirmPassword: string;
}

export default function UpdateProfile({ username }: { username: string }) {
    const { data: profile } = useProfile(username);
    const { mutateAsync, isPending, isError } = useUpdateProfile();
    const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar(username);
    const [successMessage, setSuccessMessage] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validationSchema = Yup.object({
        name: Yup.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
        surname: Yup.string().min(3, 'Los apellidos deben tener al menos 3 caracteres'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
            .nullable(),
    });

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview local inmediato
        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
        setAvatarError(null);

        try {
            await uploadAvatar(file);
        } catch {
            setAvatarError('Error al subir el avatar. Volvé a intentarlo.');
            setAvatarPreview(null);
        }
    };

    const handleSubmit = async (values: IUpdateProfileFormValues) => {
        if (isPending) return;
        const updateProfile: IUpdProfile = {
            user: {
                password: values.password === '' ? undefined : values.password,
                name: values.name === '' ? undefined : values.name,
                surname: values.surname === '' ? undefined : values.surname,
                birthday: values.birthday == null ? undefined : FormatToDD_MM_YYYY(values.birthday),
                bio: values.bio === '' ? undefined : values.bio,
            }
        };
        try {
            await mutateAsync(updateProfile);
            setSuccessMessage(true);
            setTimeout(() => setSuccessMessage(false), 3000);
        } catch {
            // isError de useMutation ya captura el estado
        }
    };

    const currentAvatar = avatarPreview ?? (profile?.imgUser ? getImageUrl('avatar', profile.imgUser) : null);

    return (
        <Formik
            enableReinitialize
            initialValues={{
                name: profile?.name || '',
                surname: profile?.surname || '',
                bio: profile?.bio || '',
                birthday: ParseDD_MM_YYYY(profile?.birthday || ''),
                password: '',
                confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form className="text-gray-600 space-y-4 py-2">

                {/* Avatar upload */}
                <div className="flex items-center gap-4">
                    <div className="relative group w-16 h-16 shrink-0">
                        {currentAvatar ? (
                            <Image
                                src={currentAvatar}
                                alt="Avatar"
                                fill
                                className="rounded-full object-cover border border-gray-300"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300" />
                        )}
                        {/* Overlay al hover */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="
                                absolute inset-0 flex items-center justify-center
                                rounded-full bg-black/40 opacity-0 group-hover:opacity-100
                                transition-opacity duration-200 disabled:cursor-not-allowed"
                            aria-label="Cambiar avatar"
                        >
                            <CameraIcon className="h-6 w-6 text-white" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">Foto de perfil</p>
                        {isUploadingAvatar ? (
                            <p className="text-xs text-gray-400 mt-0.5">Subiendo...</p>
                        ) : (
                            <p className="text-xs text-gray-400 mt-0.5">Hacé clic en la imagen para cambiarla</p>
                        )}
                        {avatarError && (
                            <p className="text-xs text-red-500 font-semibold mt-0.5">{avatarError}</p>
                        )}
                    </div>
                </div>

                {/* Fila: Nombre + Apellidos */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Field
                            type="text"
                            name="name"
                            placeholder="Nombre del usuario"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full
                                focus:outline-none focus:border-teal-600 px-5 py-3"
                        />
                        <ErrorMessage
                            name="name"
                            component="p"
                            className="text-red-500 text-xs font-semibold px-3"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Field
                            type="text"
                            name="surname"
                            placeholder="Apellidos del usuario"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full
                                focus:outline-none focus:border-teal-600 px-5 py-3"
                        />
                        <ErrorMessage
                            name="surname"
                            component="p"
                            className="text-red-500 text-xs font-semibold px-3"
                        />
                    </div>
                </div>

                {/* Bio — textarea full width */}
                <div className="flex flex-col gap-1">
                    <Field
                        as="textarea"
                        name="bio"
                        placeholder="Descripción del usuario"
                        rows={3}
                        className="
                            w-full text-gray-700 font-medium border border-gray-300 rounded-2xl
                            focus:outline-none focus:border-teal-600 px-5 py-3 resize-none"
                    />
                </div>

                {/* Fecha de nacimiento */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Field name="birthday">
                            {({ field, form }: FieldProps) => (
                                <div className="relative w-full">
                                    <DatePicker
                                        selected={field.value}
                                        onChange={(date) => form.setFieldValue(field.name, date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Fecha de nacimiento"
                                        wrapperClassName="w-full"
                                        className="
                                            h-11 w-full text-gray-700 font-medium border border-gray-300
                                            rounded-full focus:outline-none focus:border-teal-600 px-5 py-3"
                                    />
                                    <CalendarDaysIcon
                                        strokeWidth={2}
                                        className="h-5 w-5 absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                </div>
                            )}
                        </Field>
                    </div>
                </div>

                {/* Fila: Contraseña + Confirmar */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Field
                            type="password"
                            name="password"
                            placeholder="Cambiar contraseña"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full
                                focus:outline-none focus:border-teal-600 px-5 py-3"
                        />
                        <ErrorMessage
                            name="password"
                            component="p"
                            className="text-red-500 text-xs font-semibold px-3"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Field
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full
                                focus:outline-none focus:border-teal-600 px-5 py-3"
                        />
                        <ErrorMessage
                            name="confirmPassword"
                            component="p"
                            className="text-red-500 text-xs font-semibold px-3"
                        />
                    </div>
                </div>

                {/* Footer: mensajes + botón */}
                <div className="flex items-center justify-between pt-1">
                    <div>
                        {isError && (
                            <p className="text-red-500 text-sm font-semibold">
                                Error al actualizar el perfil. Volvé a intentarlo.
                            </p>
                        )}
                        {successMessage && (
                            <p className="flex items-center gap-1 text-teal-700 text-sm font-semibold">
                                <CheckCircleIcon className="h-4 w-4" />
                                Perfil actualizado correctamente.
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="
                            bg-lime-600 text-base text-white font-semibold rounded-full
                            px-6 py-2 hover:bg-lime-700 transition transform duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Guardando...' : 'Actualizar'}
                    </button>
                </div>
            </Form>
        </Formik>
    );
}
