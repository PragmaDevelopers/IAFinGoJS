import { ReactElement } from "react";
import TestForm from "./TestForm";

export default function Page(): ReactElement<any, any> {
    return (
        <main>
            <TestForm />
        </main>
    );
}