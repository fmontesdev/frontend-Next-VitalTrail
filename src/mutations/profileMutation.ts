import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/services/profileService';
import { UserService } from '@/services/userService';
import { IUser, IProfile, IProfiles } from '@/shared/interfaces/entities/user.interface';
import { IUpdProfile } from '@/shared/interfaces/entities/user.interface';

export const useFollow = (username: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => ProfileService.follow(username),
        onSuccess: (updatedProfile: IProfile) => {
            // Actualizar la query de perfil
            queryClient.setQueryData(['profile', username], updatedProfile);

            // // Actualizar la query de "followingProfiles"
            // queryClient.setQueryData<IProfiles | undefined>(
            //     ['followingProfiles', username],
            //     (oldData) => {
            //         if (!oldData) {
            //             return { profiles: [updatedProfile], profilesCount: 1 };
            //         }
            //         // Evitar duplicados
            //         if (oldData.profiles.find((profile) => profile.username === updatedProfile.username)) {
            //             return oldData;
            //         }
            //         return {
            //             ...oldData,
            //             profiles: [...oldData.profiles, updatedProfile],
            //             profilesCount: oldData.profilesCount + 1,
            //         };
            //     }
            // );

            // Invalidar queries para asegurar datos frescos
            queryClient.invalidateQueries({ queryKey: ['followingProfiles'] });
            queryClient.invalidateQueries({ queryKey: ['followerProfiles'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error) => {
            console.log(error);
        }
    });
};

export const useUnfollow = (username: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => ProfileService.unfollow(username),
        onSuccess: (updatedProfile: IProfile) => {
            // Actualizar la query de perfil
            queryClient.setQueryData(['profile', username], updatedProfile);

            // // Actualizar la query de "followingProfiles": remover el perfil dejado de seguir
            // queryClient.setQueryData<IProfiles | undefined>(
            //     ['followingProfiles', username],
            //     (oldData) => {
            //         if (!oldData) return { profiles: [], profilesCount: 0 };
            //         const filteredProfiles = oldData.profiles.filter(
            //             (profile) => profile.username !== updatedProfile.username
            //         );
            //         return {
            //             ...oldData,
            //             profiles: filteredProfiles,
            //             profilesCount: filteredProfiles.length,
            //         };
            //     }
            // );

            // Invalidar queries para asegurar datos frescos
            queryClient.invalidateQueries({ queryKey: ['followingProfiles'] });
            queryClient.invalidateQueries({ queryKey: ['followerProfiles'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error) => {
            console.log(error);
        }
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IUpdProfile) => UserService.updateUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error) => {
            console.log(error);
        }
    });
};
