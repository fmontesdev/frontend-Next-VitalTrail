'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ILogin } from '@/shared/interfaces/entities/user.interface';
import { getImageUrl } from '@/shared/utils/imageUrl';

interface ILoginFormValues {
    email: string;
    password: string;
}

export default function LoginPage() {
    const { login } = useAuth();

    const validationSchema = Yup.object({
        email: Yup.string().email('El correo electrónico no es válido').required('El correo electrónico es obligatorio'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    });

    const handleSubmit = async (values: ILoginFormValues) => {
        if (login.isPending) return;
        const loginUser: ILogin = { user: { email: values.email, password: values.password } };
        try {
            await login.mutateAsync(loginUser);
        } catch {
            // login.isError de useMutation captura el estado
        }
    };

    return (
        <main
            className="min-h-[calc(100vh-64px-64px)] w-full flex items-center justify-center py-14"
            style={{
                backgroundImage: `url(${getImageUrl('background', 'login.jpg')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="animate-fade-up bg-white p-8 rounded-3xl shadow-xl w-[26rem] text-center">
                <h2 className="text-3xl font-bold text-teal-700 mb-4">Hola de nuevo.</h2>
                <p className="text-lg text-gray-500 font-semibold mb-6">Inicia sesión y empieza a explorar.</p>

                <Formik
                    initialValues={{ email: '', password: '' }}
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

                        {login.isError && (
                            <p className="text-red-500 text-sm font-semibold text-left px-1">
                                Credenciales incorrectas. Vuelve a intentarlo.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="
                                w-full bg-lime-600 text-base text-white font-bold p-2.5 rounded-full
                                hover:bg-lime-700 transition transform duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {login.isPending ? 'Iniciando sesión...' : 'Inicia sesión'}
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
            </div>
        </main>
    );
}
