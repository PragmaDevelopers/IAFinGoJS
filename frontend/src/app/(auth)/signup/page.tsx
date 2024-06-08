import SignUpForm from "@/components/clientside/ui/forms/SignUp";
import { ReactElement } from "react";

export default function Page(): ReactElement<any, any> {
    return (
        <main>
            <h1 className="text-2xl font-bold mb-8 text-center">IA Finanças</h1>
            <SignUpForm />
        </main>
    );
}