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

import { ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import GoogleCaptchaWrapper from "@/app/utils/auth/ReCaptcha/ReCaptchaWarpper";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { encrypt } from "@/app/utils/crypto/ClientCrypto";
import { SignUpAuthToken } from "@/proto/generated/signup/SignUpAuthToken";
import { useRouter } from 'next/navigation';
import { useAuthContext } from "@/app/utils/contexts/auth/AuthContext";

const specialCharacters = '!@#$%&*()_\\-+=.';

function SignUpForm() {
    const TOTAL_SIGNUP_SECTIONS = 2;
    const [section, setSection] = useState<number>(0);
    const [finalizedSignUp, setFinalizedSignUp] = useState<boolean>(false);
    const router = useRouter();
    const { setToken } = useAuthContext();

    const formSchema = useMemo(() => z.object({
        firstname: z.string().min(1, 'Please provide your first name.')
            .min(2, 'First name must have at least 2 characters.')
            .max(64, 'First name can only have the maximum of 64 characters.')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscore.'),
        lastname: z.string().min(1, 'Please provide your last name.')
            .min(2, 'Last name must have at least 2 characters.')
            .max(64, 'Last name can only have the maximum of 64 characters.')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscore.'),
        email: z.string().email('Please provide a valid email address.').optional(),
        reemail: z.string().email('Please provide a valid email address.').optional(),
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
        repassword: z.string().min(1, 'Please provide a password')
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
            firstname: "",
            lastname: "",
            email: "",
            reemail: "",
            password: "",
            repassword: ""
        },
    });

    const { executeRecaptcha } = useGoogleReCaptcha();

    const checkSection = async (section: number) => {
        switch (section) {
            case 0:
                const result0 = await form.trigger("firstname");
                const result1 = await form.trigger("lastname");
                return result0 && result1;
            case 1:
                const result2 = await form.trigger("email");
                const result3 = await form.trigger("reemail");
                return result3 && result2;

            case 2:
                const result4 = await form.trigger("password");
                const result5 = await form.trigger("repassword");
                return result4 && result5;
            default:
                break;
        }
    }

    const advanceSection = async () => {
        const sectionIsValid = await checkSection(section);
        if (sectionIsValid && section < TOTAL_SIGNUP_SECTIONS) {
            setSection(section + 1);
        }
    };

    useEffect(() => {
        if (section == TOTAL_SIGNUP_SECTIONS) {
            setFinalizedSignUp(true);
        }
    }, [section, setFinalizedSignUp])

    const returnSection = () => {
        if (section > 0) {
            setSection(section - 1);
        }

        setFinalizedSignUp(false);
    }


    // const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const onSubmit = async (values: any) => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const errors = result.error.errors;
            // Find the first invalid section
            let firstInvalidSection = -1;
            for (let i = 0; i < errors.length; i++) {
                const errorPath = errors[i].path[0];
                if (errorPath === "firstname" || errorPath === "lastname") {
                    firstInvalidSection = 0;
                    break;
                } else if (errorPath === "email" || errorPath === "reemail") {
                    firstInvalidSection = 1;
                    break;
                } else if (errorPath === "password" || errorPath === "repassword") {
                    firstInvalidSection = 2;
                    break;
                }
            }
            if (firstInvalidSection !== -1) {
                setSection(firstInvalidSection);
                return;
            }
        }

        // Proceed with form submission
        if (executeRecaptcha !== undefined) {
            const token = await executeRecaptcha("registerSubmit");
            try {
                const e = result?.data?.email;
                const p = result?.data?.password;
                const fn = result?.data?.firstname;
                const ln = result?.data?.lastname;
                if (e !== undefined && p !== undefined && fn !== undefined && ln !== undefined) {
                    const email = await encrypt(e);
                    const password = await encrypt(p);
                    const firstName = await encrypt(fn);
                    const lastName = await encrypt(ln);
    
                    const response = await fetch(`/api/signup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: email, password: password, firstName: firstName, lastName: lastName, reCaptchaToken: token })
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const authToken: SignUpAuthToken = await response.json();
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
                <h1 className="text-center text-xl font-bold">Sign Up</h1>
                <div>
                    {section === 0 && (
                        <>
                            <FormField
                                control={form.control}
                                name="firstname"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormDescription>
                                            This is your first name
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormDescription>
                                            This is your last name
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {section === 1 && (
                        <>
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
                                name="reemail"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>Confirm Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                        <FormDescription>
                                            Please confirm your email
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {section === 2 && (
                        <>
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
                            <FormField
                                control={form.control}
                                name="repassword"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormDescription>
                                            Please confirm your password
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>

                <div>
                    <div className="w-full mb-2 flex justify-between mt-4 h-12">
                        <Button type="button" variant={(section == 0) ? "outline" : "default"} size="icon" onClick={returnSection} disabled={section == 0}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button type={finalizedSignUp ? "submit" : "button"} disabled={!finalizedSignUp} className="grow mx-2 transition-all">
                            {finalizedSignUp ? 'Sign Up' : `${section + 1}/${TOTAL_SIGNUP_SECTIONS + 1}`}
                        </Button>
                        <Button type="button" variant={finalizedSignUp ? "outline" : "default"} size="icon" onClick={advanceSection} disabled={finalizedSignUp}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="mx my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-neutral-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-neutral-400">
                        or
                    </div>
                    <p className="text-center my-2 text-sm rounded-md px-3 text-neutral-600">If you already have an account please <Link href="/login" className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50 transition-all">Log In</Link></p>
                </div>
            </form>
        </Form>
    )
}

export default function SignUpFormPage() {
    return (
        <GoogleCaptchaWrapper>
            <div className="w-5/12 h-full">
                <SignUpForm />
                <div className="absolute bottom-4 left-4" id="recaptchaContainer" />
            </div>
        </GoogleCaptchaWrapper>
    );
}