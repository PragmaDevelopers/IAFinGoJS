"use client";

import { ReactNode } from "react";
import { AuthContextProvider } from "@/app/utils/contexts/auth/AuthContext";


export function AuthContextWrapper({children}: {children: ReactNode}): ReactNode {
    return (
        <AuthContextProvider>
            { children }
        </AuthContextProvider>
    )
}