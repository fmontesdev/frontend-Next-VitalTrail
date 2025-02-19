import apiService from "./apiService";
import { IComment, IComments } from "@/shared/interfaces/entities/comment.interface";

export const CommentService = {
    getAllByRoute(routeSlug: string): Promise<IComments> {
        return apiService.get<IComments>(`routes/${routeSlug}/comments`);
    },

    getAllByUser(username: string): Promise<IComment[]> {
        return apiService.get<{comments: IComment[]}>(`profile/${username}/comments`).then(data => {
            return data.comments;
        });
    },

    createComment(routeSlug: string, data: string): Promise<IComment> {
        return apiService.post<IComment>(`routes/${routeSlug}/comments`, {comment: {body: data}});
    },

    deleteComment(idComment: number): Promise<number> {
        return apiService.delete<number>(`comments/${idComment}`);
    },
};
