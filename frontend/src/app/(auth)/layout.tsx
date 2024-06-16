import { ReactElement } from "react";

interface PageProps {
    children: ReactElement<any, any>
}

export default function Layout(props: PageProps): ReactElement<PageProps, any> {
    const { children } = props;
    return (
        <div className="w-full h-full flex justify-center items-center">
            { children }
        </div>
    );
}