'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ILogin } from "@/shared/interfaces/entities/user.interface";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();


    const validationSchema = Yup.object({
        email: Yup.string().email('El correo electrónico no es válido').required('El correo electrónico es obligatorio'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    });

    const handleSubmit = async (values: any) => {
        if (login.isPending || !values.email.trim() || !values.password.trim()) return;
        const loginUser: ILogin = { user: { email: values.email, password: values.password } };
        login.mutateAsync(loginUser);
    };

    return (
        <main className="min-h-[calc(100vh-500px-64px)] flex items-center justify-center bg-stone-100 py-14">
            <div className="bg-white p-8 rounded-3xl shadow-md w-[26rem] text-center">
                <h2 className="text-3xl font-bold text-teal-700 mb-4">Hola de nuevo.</h2>
                <p className="text-lg text-gray-500 font-semibold mb-6">Inicia sesión y empieza a explorar.</p>
                <Formik
                    initialValues={{ email: '', password: '' }}
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
                        <button
                            type="submit"
                            className="
                                w-full bg-lime-500 text-base text-white font-semibold p-2.5 rounded-full
                                hover:bg-lime-600 transition transform duration-200"
                        >
                            Inicia sesión
                        </button>
                    </Form>
                </Formik>
                <p className="flex items-center justify-center mt-5 text-md text-gray-500 font-semibold gap-2">
                    ¿No tienes una cuenta?
                    <Link
                        href="/register"
                        className="text-base text-lime-600 font-bold underline-offset-2 hover:underline"
                    >
                        Regístrate gratis
                    </Link>
                </p>
                <div className="absolute top-4 left-4 bg-white">
                    {/* {login.isError && 
                        <p className="text-red-500 text-base font-semibold">
                            Error durante el inicio de sesión. Vuelve a intentarlo.
                        </p>
                    } */}
                </div>
            </div>
        </main>
    );
}
