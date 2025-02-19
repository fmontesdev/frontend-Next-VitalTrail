import { useQuery } from '@tanstack/react-query';
import { CommentService } from '@/services/commentService';
import { IComments } from '@/shared/interfaces/entities/comment.interface';

const key = 'comments'

export const useCommentsByRoute = (routeSlug: string, initialData: IComments) => {
    return useQuery({
        queryKey: ['routeComments', routeSlug],
        queryFn: () => CommentService.getAllByRoute(routeSlug),
        initialData: initialData,
        staleTime: 1000 * 30, // segundos
    });
}

export const useCommentsByUser = (username: string) => {
    return useQuery({
        queryKey: ['profileComments', username],
        queryFn: () => CommentService.getAllByUser(username),
        staleTime: 1000 * 30, // 2 segundos
    });
}
