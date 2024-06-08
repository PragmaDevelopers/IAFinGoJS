"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode } from "react";

export default function GoogleCaptchaWrapper({children}: {children: ReactNode}) {
  const recaptchaKey: string | undefined = process?.env?.NEXT_PUBLIC_CLIENT_KEY;
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaKey ?? "NOT DEFINED"}
            language="pt-BR"
            scriptProps={{
            async: false,
            defer: false,
            appendTo: "head",
            nonce: undefined,
            }}
            container={{ // optional to render inside custom element
                element: "recaptchaContainer",
                parameters: {},
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}