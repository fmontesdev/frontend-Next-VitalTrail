'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { merienda } from '@/app/fonts';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IRegister } from '@/shared/interfaces/entities/user.interface';
import { getImageUrl } from '@/shared/utils/imageUrl';
import { CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface IRegisterFormValues {
    email: string;
    username: string;
    password: string;
    name: string;
    surname: string;
}

const DEFAULT_AVATARS = [
    'avatar-default-m1.png', 'avatar-default-m2.png', 'avatar-default-m3.png',
    'avatar-default-m4.png', 'avatar-default-m5.png', 'avatar-default-m6.png',
    'avatar-default-m7.png', 'avatar-default-m8.png', 'avatar-default-m9.png',
    'avatar-default-f1.png', 'avatar-default-f2.png', 'avatar-default-f3.png',
    'avatar-default-f4.png', 'avatar-default-f5.png', 'avatar-default-f6.png',
    'avatar-default-f7.png', 'avatar-default-f8.png', 'avatar-default-f9.png',
];

export default function RegisterPage() {
    const { register } = useAuth();
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [avatarOpen, setAvatarOpen] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string().email('El correo electrónico no es válido').required('El correo electrónico es obligatorio'),
        username: Yup.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').required('El nombre de usuario es obligatorio'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
        name: Yup.string().required('El nombre es obligatorio'),
        surname: Yup.string().required('El apellido es obligatorio'),
    });

    const handleSubmit = async (values: IRegisterFormValues) => {
        if (register.isPending) return;
        const registerUser: IRegister = {
            user: {
                email: values.email,
                username: values.username,
                password: values.password,
                name: values.name,
                surname: values.surname,
                imgUser: selectedAvatar ?? undefined,
            }
        };
        try {
            await register.mutateAsync(registerUser);
        } catch {
            // register.isError de useMutation captura el estado
        }
    };

    return (
        <main
            className="min-h-[calc(100vh-64px-64px)] w-full flex items-center justify-center py-14"
            style={{
                backgroundImage: `url(${getImageUrl('background', 'register.jpg')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="animate-fade-up bg-white p-8 rounded-3xl shadow-xl w-[32rem] text-center">
                <p className={`${merienda.className} antialiased text-3xl font-black pb-2`}>
                    <span className="text-lime-500">Vital</span>
                    <span className="text-teal-500">Trail</span>
                </p>
                <p className="text-lg text-gray-500 font-semibold mb-5">Crea tu cuenta gratuita</p>

                <Formik
                    initialValues={{ email: '', username: '', password: '', name: '', surname: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form className="text-gray-600 space-y-4">
                        <div className="flex flex-col gap-1">
                            <Field
                                type="email"
                                name="email"
                                placeholder="Dirección de correo electrónico"
                                className="
                                    h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full
                                    focus:outline-none focus:border-2 focus:border-teal-600 px-5 py-3"
                            />
                            <ErrorMessage
                                name="email"
                                component="p"
                                className="text-red-500 text-xs font-semibold px-3 text-left"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Field
                                type="text"
                                name="username"
                                placeholder="Nombre de usuario"
                                className="
                                    h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full
                                    focus:outline-none focus:border-2 focus:border-teal-600 px-5 py-3"
                            />
                            <ErrorMessage
                                name="username"
                                component="p"
                                className="text-red-500 text-xs font-semibold px-3 text-left"
                            />
                        </div>
                        <div className="grid grid-cols-[3fr_4fr] gap-3">
                            <div className="flex flex-col gap-1">
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Nombre"
                                    className="
                                        h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full
                                        focus:outline-none focus:border-2 focus:border-teal-600 px-5 py-3"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="p"
                                    className="text-red-500 text-xs font-semibold px-3 text-left"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Field
                                    type="text"
                                    name="surname"
                                    placeholder="Apellidos"
                                    className="
                                        h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full
                                        focus:outline-none focus:border-2 focus:border-teal-600 px-5 py-3"
                                />
                                <ErrorMessage
                                    name="surname"
                                    component="p"
                                    className="text-red-500 text-xs font-semibold px-3 text-left"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Field
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                className="
                                    h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full
                                    focus:outline-none focus:border-2 focus:border-teal-600 px-5 py-3"
                            />
                            <ErrorMessage
                                name="password"
                                component="p"
                                className="text-red-500 text-xs font-semibold px-3 text-left"
                            />
                        </div>

                        {/* Selector de avatar — opcional */}
                        <div className="border border-gray-300 rounded-3xl px-4 py-3">
                            <button
                                type="button"
                                onClick={() => setAvatarOpen(prev => !prev)}
                                className="flex items-center justify-between w-full text-sm font-semibold text-gray-500 text-left hover:text-gray-700 transition-colors"
                            >
                                <span>
                                    Elegí tu avatar{' '}
                                    <span className="font-normal text-gray-400">(opcional)</span>
                                    {selectedAvatar && (
                                        <span className="ml-2 text-lime-600 font-semibold">✓ seleccionado</span>
                                    )}
                                </span>
                                <ChevronDownIcon
                                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${avatarOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {avatarOpen && (
                                <div className="grid grid-cols-9 gap-2 mt-3">
                                    {DEFAULT_AVATARS.map((avatar) => (
                                        <button
                                            key={avatar}
                                            type="button"
                                            onClick={() => setSelectedAvatar(prev => prev === avatar ? null : avatar)}
                                            className="relative rounded-full focus:outline-none"
                                            aria-label={avatar}
                                        >
                                            <Image
                                                src={getImageUrl('avatar', avatar)}
                                                alt={avatar}
                                                width={44}
                                                height={44}
                                                className={`rounded-full object-cover transition-all duration-150 ${
                                                    selectedAvatar === avatar
                                                        ? 'ring-2 ring-offset-1 ring-lime-600 opacity-100'
                                                        : 'opacity-70 hover:opacity-100'
                                                }`}
                                            />
                                            {selectedAvatar === avatar && (
                                                <CheckCircleIcon className="absolute -bottom-1 -right-1 h-4 w-4 text-lime-600 bg-white rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {register.isError && (
                            <p className="text-red-500 text-sm font-semibold text-left px-1">
                                Error al crear la cuenta. Volvé a intentarlo.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={register.isPending}
                            className="
                                w-full bg-lime-600 text-base text-white font-bold p-2.5 rounded-full
                                hover:bg-lime-700 transition transform duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {register.isPending ? 'Creando cuenta...' : 'Regístrate'}
                        </button>
                    </Form>
                </Formik>

                <p className="flex items-center justify-center mt-5 text-md text-gray-500 font-semibold gap-2">
                    ¿Ya tienes una cuenta?
                    <Link
                        href="/login"
                        className="text-base text-lime-600 font-bold underline-offset-2 hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </main>
    );
}
