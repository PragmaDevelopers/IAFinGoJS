"use client"

import { usePathname, useRouter } from "next/navigation";
import { ReactElement, useLayoutEffect } from "react";
import { useAuthContext } from "../utils/contexts/auth/AuthContext";
import GlobalSidebar from "@/components/clientside/ui/modals/GlobalSidebar";

interface PageProps {
    children: ReactElement<any, any>
}

export default function Layout(props: PageProps): ReactElement<PageProps, any> {
    const { children } = props;
    const usePath = usePathname();
    const router = useRouter();
    const { token } = useAuthContext();
    useLayoutEffect(()=>{
        if(["/home","/dashboard"].includes(usePath)){
            if(token == "" || token == null){
                // router.push("/login");
            }
        }
    },[usePath])
    return (
        <div className="h-full overflow-x-hidden">
            <GlobalSidebar />
            { children }
        </div>
    );
}