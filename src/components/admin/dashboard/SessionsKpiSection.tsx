import KpiCard from './KpiCard';
import { IAdminSessionStats } from '@/shared/interfaces/entities/adminStats.interface';

interface ISessionsKpiSectionProps {
    data: IAdminSessionStats;
}

export default function SessionsKpiSection({ data }: ISessionsKpiSectionProps) {
    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Sesiones</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard label="Total sesiones" value={data.total} />
                <KpiCard label="Este mes" value={data.thisMonth} />
                <KpiCard label="Km totales" value={data.totalKm} />
            </div>
        </section>
    );
}
