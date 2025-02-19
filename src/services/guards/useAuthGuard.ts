"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function useAuthGuard() {
    const router = useRouter();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser.isLoading && (!currentUser.isAuthenticated || currentUser.isError)) {
            router.push("/login");
        }
    }, [currentUser, router]);

    return currentUser;
}
