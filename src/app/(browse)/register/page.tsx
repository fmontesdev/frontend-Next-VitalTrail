'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { merienda } from '@/app/fonts';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IRegister } from "@/shared/interfaces/entities/user.interface";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();

    const validationSchema = Yup.object({
        email: Yup.string().email('El correo electrónico no es válido').required('El correo electrónico es obligatorio'),
        username: Yup.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').required('El nombre de usuario es obligatorio'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
        name: Yup.string().required('El nombre es obligatorio'),
        surname: Yup.string().required('El apellido es obligatorio'),
    });

    const handleSubmit = async (values: any) => {
        if (register.isPending || !values.email.trim() || !values.password.trim()) return;
        const registerUser: IRegister = { 
            user: { email: values.email,
                username: values.username,
                password: values.password,
                name: values.name,
                surname: values.surname,
                imgUser: '4043260-avatar-male-man-portrait_113269.png',
                rol: 'ROLE_CLIENT'
            }
        };
        register.mutateAsync(registerUser);
    };

    return (
        <main className="min-h-[calc(100vh-500px-64px)] flex items-center justify-center bg-stone-100 py-14">
            <div className="bg-white p-8 rounded-3xl shadow-md w-[26rem] text-center">
                <p className={`${merienda.className} antialiased text-3xl font-black text-white pb-2`}>
                    <span className="text-lime-500">Vital</span>
                    <span className="text-teal-500">Trail</span>
                </p>
                <p className="text-lg text-gray-500 font-semibold mb-6">Crea tu cuenta gratuita</p>
                <Formik
                    initialValues={{ email: '', username: '', password: '', name: '', surname: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form className="text-gray-600 space-y-4">
                        <div className="relative flex justify-center">
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
                                className="absolute top-8 text-red-500 text-sm font-bold bg-white rounded-full px-2"
                            />
                        </div>
                        <div className="relative flex justify-center">
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
                                className="absolute top-8 text-red-500 text-sm font-bold bg-white rounded-full px-2"
                            />
                        </div>
                        <div className="relative flex justify-center">
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
                                className="absolute top-8 text-red-500 text-sm font-bold bg-white rounded-full px-2"
                            />
                        </div>
                        <div className="relative flex justify-center">
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
                                className="absolute top-8 text-red-500 text-sm font-bold bg-white rounded-full px-2"
                            />
                        </div>
                        <div className="relative flex justify-center">
                            <Field
                                type="text"
                                name="surname"
                                placeholder="Apellido"
                                className="
                                    h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full 
                                    focus:outline-none focus:border-2 focus:border-teal-600 px-5 py-3"
                            />
                            <ErrorMessage
                                name="surname"
                                component="p"
                                className="absolute top-8 text-red-500 text-sm font-bold bg-white rounded-full px-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="
                                w-full bg-lime-500 text-base text-white font-semibold p-2.5 rounded-full
                                hover:bg-lime-600 transition transform duration-200"
                        >
                            Regístrate
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
                <div className="absolute top-4 left-4 bg-white">
                    {/* {register.isError && 
                        <p className="text-red-500 text-base font-semibold">
                            Error durante el rgistro. Vuelve a intentarlo.
                        </p>
                    } */}
                </div>
            </div>
        </main>
    );
}
