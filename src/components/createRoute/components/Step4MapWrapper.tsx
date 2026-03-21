'use client';

import dynamic from 'next/dynamic';
import { FormikErrors, FormikTouched } from 'formik';
import { ICreateRoute } from '@/shared/interfaces/entities/route.interface';

// Props reexportadas para que CreateRouteWizard las pueda importar desde aquí
export interface IStep4WrapperProps {
    values: ICreateRoute;
    errors: FormikErrors<ICreateRoute>;
    touched: FormikTouched<ICreateRoute>;
    setFieldValue: (field: string, value: unknown) => void;
}

// ssr: false — Leaflet accede a window/document al importarse el módulo, lo que rompe en Node.js.
// dynamic evita que el import se evalúe en el servidor; solo se carga en el browser.
const Step4MapAndReview = dynamic(() => import('./Step4Map'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">
            <div className="text-gray-500">Cargando mapa...</div>
        </div>
    ),
});

export default function Step4MapWrapper(props: IStep4WrapperProps) {
    return <Step4MapAndReview {...props} />;
}
