import LogInForm from "@/components/clientside/ui/forms/LogIn";
import { ReactElement } from "react";

export default function Page(): ReactElement<any, any> {
    return (
        <main>
            <LogInForm />
        </main>
    );
}