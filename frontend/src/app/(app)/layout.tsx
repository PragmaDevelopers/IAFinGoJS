"use client"

import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactElement, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../utils/contexts/auth/AuthContext";
import Sidebar from "@/components/clientside/ui/Sidebar";

interface PageProps {
    children: ReactElement<any, any>
}

export default function Layout(props: PageProps): ReactElement<PageProps, any> {
    const { children } = props;
    const usePath = usePathname();
    const router = useRouter();
    const { token } = useAuthContext();
    useLayoutEffect(()=>{
        if(["/home"].includes(usePath)){
            if(token == "" || token == null){
                // router.push("/login");
            }
        }
    },[usePath])
    return (
        <div className="w-full h-full overflow-hidden">
            <Sidebar />
            { children }
        </div>
    );
}