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
import { Dispatch, SetStateAction, useEffect, useState, createContext, useContext } from "react";
import GoogleCaptchaWrapper from "@/app/utils/auth/ReCaptcha/ReCaptchaWarpper";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";


type FormStateContext = {
    setUsername: Dispatch<SetStateAction<string>>;
    setEmail: Dispatch<SetStateAction<string>>;
    setReemail: Dispatch<SetStateAction<string>>;
    setPassword: Dispatch<SetStateAction<string>>;
    setRepassword: Dispatch<SetStateAction<string>>;
    usernameValue: string;
    emailValue: string;
    reemailValue: string;
    passwordValue: string;
    repasswordValue: string;
}

const specialCharacters = '!@#$%&*()_\\-+=.';

const defaultFormState: FormStateContext = {
    setUsername: () => {},
    setEmail: () => {},
    setReemail: () => {},
    setPassword: () => {},
    setRepassword: () => {},
    usernameValue: '',
    emailValue: '',
    reemailValue: '',
    passwordValue: '',
    repasswordValue: ''
};


const FormContext = createContext<FormStateContext>(defaultFormState);



const formSchema = z.object({
    username: z.string()
        .min(1, 'Please provide a username.')
        .min(3, 'Username must have at least 3 characters.')
        .max(64, 'Username can only have the maximum of 64 characters.')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contains alphanumeric characters and underscore.'),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string()
        .min(1, 'Please provide a password')
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
    repassword: z.string()
        .min(1, 'Please provide a password')
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
    email: z.string().email('Please Provide a valid email address.'),
    reemail: z.string().email('Please Provide a valid email address.'),
})


interface GetFormSectionProps {
    section: number;
    form: any;
    // Dispatch<SetStateAction<string>>

}
function GetFormSection(props: GetFormSectionProps) {
    const {section, form} = props;
    const {
        setUsername,
        setEmail,
        setReemail,
        setPassword,
        setRepassword,
        usernameValue,
        emailValue,
        reemailValue,
        passwordValue,
        repasswordValue,
    } = useContext(FormContext);

    const handleChange = (setter: Dispatch<SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    switch (section) {
        case 0:
            return (
                <div>
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }: any) => (
                        <FormItem className="my-2">
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} type="text" value={usernameValue} onChange={handleChange(setUsername)} />
                            </FormControl>
                            <FormDescription>
                                This is your account username
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            );
        case 1:
            return (
                <div>
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }: any) => (
                        <FormItem className="my-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" value={emailValue} onChange={handleChange(setEmail)} />
                            </FormControl>
                            <FormDescription>
                                This is your account email
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField
                    control={form.control}
                    name="reemail"
                    render={({ field }: any) => (
                        <FormItem  className="my-2">
                            <FormLabel>Confirm Email</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" value={reemailValue} onChange={handleChange(setReemail)} />
                            </FormControl>
                            <FormDescription>
                                Please confirm your email
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            );
        case 2:
            return (
                <div>
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }: any) => (
                        <FormItem className="my-2">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" value={passwordValue} onChange={handleChange(setPassword)} />
                            </FormControl>
                            <FormDescription>
                                This is your account password
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField
                    control={form.control}
                    name="repassword"
                    render={({ field }: any) => (
                        <FormItem  className="my-2">
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password"  value={repasswordValue} onChange={handleChange(setRepassword)} />
                            </FormControl>
                            <FormDescription>
                                Please confirm your password
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            );
        default:
            break;
    }
}

function SignUpForm() {
    const TOTAL_SIGNUP_SECTIONS = 2;
    const [section, setSection] = useState<number>(0);
    const [finalizedSignUp, setFinalizedSignUp] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const { executeRecaptcha } = useGoogleReCaptcha();

    const advanceSection = () => {
        if  (section < TOTAL_SIGNUP_SECTIONS) {
            setSection(section + 1);
        }
    }

    useEffect(() => {
        if (section == TOTAL_SIGNUP_SECTIONS) {
            setFinalizedSignUp(true);
        }
    }, [section, setFinalizedSignUp])

    const returnSection = () => {
        if  (section > 0) {
            setSection(section - 1);
        }

        setFinalizedSignUp(false);
    }


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // This will be type-safe and validated.
        if (executeRecaptcha !== undefined) {
            const token = await executeRecaptcha("registerSubmit");
            console.log(values)
            console.log(token)
        }
    }

    const [usernameValue, setUsername] = useState<string>("");
    const [emailValue, setEmail] = useState<string>("");
    const [reemailValue, setReemail] = useState<string>("");
    const [passwordValue, setPassword] = useState<string>("");
    const [repasswordValue, setRepassword] = useState<string>("");

    return (
        <FormContext.Provider value={
            {
                setUsername: setUsername,
                setEmail: setEmail,
                setReemail: setReemail,
                setPassword: setPassword,
                setRepassword: setRepassword,
                usernameValue: usernameValue,
                emailValue: emailValue,
                reemailValue: reemailValue,
                passwordValue: passwordValue,
                repasswordValue: repasswordValue,
            }
        }>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 rounded-md border border-neutral-400 h-[25rem] flex flex-col justify-between">
                    <GetFormSection form={form} section={section}/>
                    <div>
                        <div className="w-full mb-2 flex justify-between mt-4">
                            <Button type="button" variant={(section == 0) ? "outline" : "default"} size="icon" onClick={returnSection} disabled={section == 0}>
                                <ChevronLeft  className="h-4 w-4"/>
                            </Button>
                            <Button type={finalizedSignUp ? "submit" : "button"} disabled={!finalizedSignUp} className="grow mx-2 transition-all">
                                {finalizedSignUp ? 'Sign Up' : `${section+1}/${TOTAL_SIGNUP_SECTIONS+1}`}
                            </Button>
                            <Button type="button" variant={finalizedSignUp ? "outline" : "default"} size="icon" onClick={advanceSection} disabled={finalizedSignUp}>
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </div>
                        <div className="mx my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-neutral-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-neutral-400">
                            or
                        </div>
                        <p className="my-2 text-sm rounded-md px-3 text-neutral-600">If you already have an account please <Link href="/login" className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50 transition-all">Log In</Link></p>
                    </div>
                </form>
            </Form>
        </FormContext.Provider>
    )
}

export default function SignUpFormPage() {
    return (
        <GoogleCaptchaWrapper>
            <div>
                <SignUpForm/>
                <div className="absolute bottom-4 right-4" id="recaptchaContainer" />
            </div>
        </GoogleCaptchaWrapper>
    );
}