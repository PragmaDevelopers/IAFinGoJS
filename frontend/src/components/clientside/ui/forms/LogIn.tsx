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

const specialCharacters = '!@#$%&*()_-+=.';

const formSchema = z.object({
    username: z.string()
        .min(1, 'Please provide a username.')
        .min(3, 'Username must have at least 3 characters.')
        .max(64, 'Username can only have the maximum of 64 characters.')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contains alphanumeric characters and underscore.'),
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
})
   

export default function LogInForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })


    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // This will be type-safe and validated.
        console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                control={form.control}
                name="username"
                render={({ field }: any) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                            This is your account username
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField
                control={form.control}
                name="password"
                render={({ field }: any) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                            This is your account password
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}