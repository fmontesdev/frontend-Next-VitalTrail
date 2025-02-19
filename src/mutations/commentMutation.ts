import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/services/commentService';
import { IComment, IComments } from '@/shared/interfaces/entities/comment.interface';

// const key = 'comments'

export const useCreateComment = (routeSlug: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newComment: string) => CommentService.createComment(routeSlug, newComment),
        onSuccess: (comment: IComment) => {
            // queryClient.setQueryData<IComments | undefined>(
            //     [key, routeSlug],
            //     (oldData) => {
            //         if (oldData && Array.isArray(oldData.comments)) {
            //             return { ...oldData, comments: [comment, ...oldData.comments] };
            //         }
            //         return { comments: [comment], averageRatings: oldData?.averageRatings ?? 0 };
            //     }
            // );

            // Invalidar queries para asegurar datos frescos
            // Invalidar queries para asegurar datos frescos
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'routeComments' || query.queryKey[0] === 'profileComments',
                refetchActive: true,
                refetchInactive: true,
            });
        },
        onError: (error) => {
            console.log(error);
        }
    });
};

export const usedeleteComment = (idComment: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => CommentService.deleteComment(idComment),
        onSuccess: () => {
            // queryClient.setQueryData<IComments | undefined>(
            //     [key, routeSlug],
            //     (oldData) => {
            //         if (oldData && Array.isArray(oldData.comments)) {
            //             return { ...oldData, comments: oldData.comments.filter((comment) => comment.idComment !== idComment) };
            //         }
            //         return { comments: [], averageRatings: 0 };
            //     }
            // );

            // Invalidar queries para asegurar datos frescos
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'routeComments' || query.queryKey[0] === 'profileComments',
                refetchActive: true,
                refetchInactive: true,
            });
        },
        onError: (error) => {
            console.log(error);
        }
    });
};
