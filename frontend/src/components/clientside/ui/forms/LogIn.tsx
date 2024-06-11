"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { useMemo, useState } from "react";
import GoogleCaptchaWrapper from "@/app/utils/auth/ReCaptcha/ReCaptchaWarpper";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { LogInAuthToken } from "@/proto/generated/login/LogInAuthToken";
import { encrypt } from "@/app/utils/crypto/ClientCrypto";
import { useRouter } from 'next/navigation';
import { useAuthContext } from "@/app/utils/contexts/auth/AuthContext";


const specialCharacters = '!@#$%&*()_\\-+=.';

function LogInForm() {
    const { setToken } = useAuthContext();
    const router = useRouter();

    const formSchema = useMemo(() => z.object({
        email: z.string().email('Please provide a valid email address.').optional(),
        password: z.string().min(1, 'Please provide a password')
            .min(8, 'Password must have at least 8 characters')
            .max(64, 'Password can only have the maximum of 64 characters.')
            .refine(password => /[A-Z]/.test(password), {
                message: "Password must have at least one uppercase letter"
            })
            .refine(password => /[a-z]/.test(password), {
                message: "Password must have at least one lowercase letter"
            })
            .refine(password => !/\s/.test(password), {
                message: "Password cannot contain spaces"
            })
            .refine(password => new RegExp(`[${specialCharacters}]`).test(password), {
                message: `Password must contain at least one special character: ${specialCharacters}`
            }),
    }), []);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange', // Validate on change or blur to avoid issues with hidden fields
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { executeRecaptcha } = useGoogleReCaptcha();

    const onSubmit = async (values: any) => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const errors = result.error.errors;
            // Find the first invalid section
            console.log(errors)
        }

        // Proceed with form submission
        if (executeRecaptcha !== undefined) {
            const token = await executeRecaptcha("registerSubmit");

            try {
                const e = result?.data?.email;
                const p = result?.data?.password;
                if (e !== undefined && p !== undefined) {
                    const email = await encrypt(e);
                    const password = await encrypt(p);
    
                    const response = await fetch(`/api/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: email, password: password, reCaptchaToken: token })
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const authToken: LogInAuthToken = await response.json();
                    if (authToken?.token !== "" && authToken.token !== undefined) {
                        setToken(authToken.token);
                        router.push("/home");
                    }
                }
            } catch (error: any) {
                console.error("Fetch error: ", error.message);
            }

        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full py-8 px-12 border-l border-neutral-400 h-full flex flex-col justify-between">
            <h1 className="text-center text-xl font-bold">Log In</h1>
                <div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: any) => (
                            <FormItem className="mt-2 h-36">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" />
                                </FormControl>
                                <FormDescription>
                                    This is your account email
                                </FormDescription>
                                <FormMessage className="" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }: any) => (
                            <FormItem className="mt-2 h-36">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormDescription>
                                    This is your account password
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <Button type="submit" className="w-full mb-2 mt-4 transition-all">
                        Log In
                    </Button>
                    <div className="mx my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-neutral-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-neutral-400">
                        or
                    </div>
                    <p className="text-center my-2 text-sm rounded-md px-3 text-neutral-600">If you don't have an account please <Link href="/signup" className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50 transition-all">Sign Up</Link></p>
                </div>
            </form>
        </Form>
    )
}

export default function LogInFormPage() {
    return (
        <GoogleCaptchaWrapper>
            <div className="w-5/12 h-full">
                <LogInForm />
                <div className="absolute bottom-4 left-4" id="recaptchaContainer" />
            </div>
        </GoogleCaptchaWrapper>
    );
}