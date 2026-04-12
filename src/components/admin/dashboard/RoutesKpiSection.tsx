import KpiCard from './KpiCard';
import { IAdminRouteStats } from '@/shared/interfaces/entities/adminStats.interface';

interface IRoutesKpiSectionProps {
    data: IAdminRouteStats;
}

export default function RoutesKpiSection({ data }: IRoutesKpiSectionProps) {
    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Rutas</h2>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                <KpiCard label="Total rutas" value={data.total} />
                <KpiCard label="Nuevas este mes" value={data.newThisMonth} />
            </div>
        </section>
    );
}
