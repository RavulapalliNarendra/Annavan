"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/lib/firestore";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            if (user) {
                const profile = await getUserProfile(user.uid);
                if (profile) {
                    router.push(`/dashboard/${profile.role}`);
                } else {
                    // If no profile, maybe go back to login or profile creation? 
                    // For now, let's assume they might need to logout or contact support
                    router.push("/login?step=profile");
                }
            }
            setChecking(false);
        };

        checkRole();
    }, [user, router]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <Loader2 className="animate-spin h-10 w-10 text-green-600 mx-auto mb-4" />
                <p className="text-gray-500">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
