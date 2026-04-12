import KpiCard from './KpiCard';
import { IAdminSubscriptionStats } from '@/shared/interfaces/entities/adminSubscription.interface';

interface ISubscriptionsKpiSectionProps {
    data: IAdminSubscriptionStats;
}

export default function SubscriptionsKpiSection({ data }: ISubscriptionsKpiSectionProps) {
    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Suscripciones</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <KpiCard label="Activas" value={data.active} />
                <KpiCard label="Mensuales" value={data.monthly} />
                <KpiCard label="Anuales" value={data.annual} />
                <KpiCard label="Nuevas este mes" value={data.newThisMonth} />
                <KpiCard label="Churn rate" value={`${data.churnRate}%`} sub="Cancelaciones / mes" />
            </div>
        </section>
    );
}
