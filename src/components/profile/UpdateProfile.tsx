'use client';

import { useProfile } from '@/queries/profileQuery';
import { useUpdateProfile } from '@/mutations/profileMutation';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormatToDD_MM_YYYY, ParseDD_MM_YYYY } from '@/shared/utils/formatDate';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { IUpdProfile } from '@/shared/interfaces/entities/user.interface';

export default function UpdateProfile({ username }: { username: string }) {
    const { data: profile } = useProfile(username);
    const { mutateAsync, isPending, isError } = useUpdateProfile();
    // console.log(profile);

    const validationSchema = Yup.object({
        name: Yup.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
        surname: Yup.string().min(3, 'Los apellidos deben tener al menos 3 caracteres'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
            .nullable(),
    });

    const handleSubmit = async (values: any) => {
        if (isPending) return;
        const updateProfile: IUpdProfile = { 
            user: {
                password: values.password === '' ? null : values.password,
                name: values.name === '' ? null : values.name,
                surname: values.surname === '' ? null : values.surname,
                birthday: values.birthday === '' ? null : FormatToDD_MM_YYYY(values.birthday),
                bio: values.bio === '' ? null : values.bio,
                imgUser: values.imgUser === '' ? null : values.imgUser,
            }
        };
        // console.log(updateProfile);
        mutateAsync(updateProfile);
    };

    return (
        <Formik
            initialValues={{
                name: profile?.name || '',
                surname: profile?.surname || '',
                bio: profile?.bio || '',
                birthday: ParseDD_MM_YYYY(profile?.birthday || ''),
                imgUser: profile?.imgUser || '',
                password: '',
                confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form className="text-gray-600 space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative flex justify-center">
                        <Field
                            type="text"
                            name="name"
                            placeholder="Nombre del usuario"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full 
                                focus:outline-none focus:border-1 focus:border-teal-600 px-5 py-3"
                        />
                        <ErrorMessage
                            name="name"
                            component="p"
                            className="absolute top-8 text-red-500 text-sm font-bold bg-white rounded-full px-1"
                        />
                    </div>
                    <div className="relative flex justify-center">
                        <Field
                            type="text"
                            name="surname"
                            placeholder="Apellidos del usuario"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full 
                                focus:outline-none focus:border-1 focus:border-teal-600 px-5 py-3"
                        />
                        <ErrorMessage
                            name="surname"
                            component="p"
                            className="absolute top-8 text-red-500 text-sm font-bold bg-white rounded-full px-1"
                        />
                    </div>
                    <div className="relative flex justify-center">
                        <Field
                            type="text"
                            name="bio"
                            placeholder="Descripción del usuario"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full 
                                focus:outline-none focus:border-1 focus:border-teal-600 px-5 py-3"
                        />
                    </div>
                    <div className="relative flex justify-center">
                        <Field name="birthday">
                            {({ field, form }: any) => (
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
                    <div className="relative flex justify-center">
                        <Field
                            type="password"
                            name="password"
                            placeholder="Cambiar contraseña"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full 
                                focus:outline-none focus:border-1 focus:border-teal-600 px-5 py-3"
                        />
                        <ErrorMessage
                            name="password"
                            component="p"
                            className="absolute top-8 text-red-500 text-sm font-bold bg-white rounded-full px-1"
                        />
                    </div>
                    <div className="relative flex justify-center">
                        <Field
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full 
                                focus:outline-none focus:border-1 focus:border-teal-600 px-5 py-3"
                        />
                        <ErrorMessage
                            name="confirmPassword"
                            component="p"
                            className="absolute top-8 text-red-500 text-sm font-bold bg-white rounded-full px-1"
                        />
                    </div>
                    <div className="relative flex justify-center col-span-2">
                        <Field
                            type="text"
                            name="imgUser"
                            placeholder="Avatar"
                            className="
                                h-11 w-full text-gray-700 font-medium border border-gray-300 rounded-full 
                                focus:outline-none focus:border-1 focus:border-teal-600 px-5 py-3"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="
                            bg-lime-500 text-base text-white font-semibold rounded-full
                            px-6 py-2 hover:bg-lime-600 transition transform duration-200"
                    >
                        Actualizar
                    </button>
                </div>
                <div className="absolute top-4 left-4 bg-white">
                    {isError && 
                        <p className="text-red-500 text-base font-semibold">
                            Error durante el inicio de sesión. Vuelve a intentarlo.
                        </p>
                    }
                </div>
            </Form>
        </Formik>

    );
}
