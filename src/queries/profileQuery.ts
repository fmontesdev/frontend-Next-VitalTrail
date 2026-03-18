import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ProfileService } from '@/services/profileService';

export const useProfile = (username: string) => {
    return useQuery({
        queryKey: ['profile', username],
        queryFn: () => ProfileService.getProfile(username),
        staleTime: 1000 * 120, // 2 minutos
    });
}

export const useFollowingProfiles = (username: string) => {
    return useQuery({
        queryKey: ['followingProfiles', username],
        queryFn: () => ProfileService.getFollowings(username),
        staleTime: 1000 * 120, // 2 minutos
    });
}

export const useFollowerProfiles = (username: string) => {
    return useQuery({
        queryKey: ['followerProfiles', username],
        queryFn: () => ProfileService.getFollowers(username),
        staleTime: 1000 * 120, // 2 minutos
    });
}

export const useInfiniteProfileFavorites = (username: string) => {
    return useInfiniteQuery({
        queryKey: ['profileFavorites', username],
        queryFn: ({ pageParam }) => ProfileService.getFavorites(username, { limit: 6, offset: pageParam as number }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.flatMap(p => p.favoriteRoutes).length;
            return loaded < lastPage.favoritesRoutesCount ? loaded : undefined;
        },
        enabled: !!username,
    });
};
