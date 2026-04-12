import KpiCard from './KpiCard';
import { IAdminUserStats } from '@/shared/interfaces/entities/adminStats.interface';

interface IUsersKpiSectionProps {
    data: IAdminUserStats;
}

export default function UsersKpiSection({ data }: IUsersKpiSectionProps) {
    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Usuarios</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Total usuarios" value={data.total} />
                <KpiCard label="Usuarios free" value={data.free} />
                <KpiCard label="Usuarios premium" value={data.premium} />
                <KpiCard label="Nuevos este mes" value={data.newThisMonth} />
            </div>
        </section>
    );
}
