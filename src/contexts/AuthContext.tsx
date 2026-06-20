"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Extended User type to support mock users
type AuthUser = User | { uid: string; displayName: string; email: string | null; phoneNumber: string | null; formattedToken?: string };

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    loginWithMock: (role: 'farmer' | 'buyer') => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginWithMock: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for mock session in localStorage first
        const storedMockUser = localStorage.getItem("mock_user_session");
        if (storedMockUser) {
            try {
                setUser(JSON.parse(storedMockUser));
                setLoading(false);
                return; // Skip Firebase check if we have a mock session
            } catch (e) {
                console.error("Failed to parse mock session", e);
                localStorage.removeItem("mock_user_session");
            }
        }

        // Listen to Firebase Auth
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Clear mock session if real auth happens
                localStorage.removeItem("mock_user_session");
            } else {
                // If firebase auth is null, and we didn't have a mock user (checked above),
                // then we are truly logged out.
                // But we must be careful: onAuthStateChanged might fire after the initial check.
                // If we are logged in via mock, we don't want to be logged out by firebase.
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithMock = (role: 'farmer' | 'buyer') => {
        // Use static IDs so data persists across sessions
        const mockUser = {
            uid: `mock-${role}-default`,
            displayName: `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            email: `${role}@example.com`,
            phoneNumber: "+919876543210",
        };
        setUser(mockUser);
        localStorage.setItem("mock_user_session", JSON.stringify(mockUser));
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithMock }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
