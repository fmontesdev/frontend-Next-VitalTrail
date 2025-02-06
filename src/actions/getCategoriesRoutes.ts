import { prisma } from '@/libs/prisma'
import { ICategoryRoute } from '@/shared/interfaces/entities/categoryRoute.interface'

export default async function getCategoriesRoutes(): Promise<ICategoryRoute[]> {
    // Simular un retraso de 3 segundos
    // await new Promise(resolve => setTimeout(resolve, 3000));

    const categories = await prisma.categoryRoute.findMany({
        orderBy: { idCategory: 'asc' }
    })

    return categories.map((category) => {
        return {
            idCategory: Number(category.idCategory),
            title: category.title,
            imgCategory: category.imgCategory,
            description: category.description
        } as ICategoryRoute;
    });
}