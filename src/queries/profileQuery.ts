import { useQuery } from '@tanstack/react-query';
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
