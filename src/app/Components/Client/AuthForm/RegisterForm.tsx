'use client'

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"

type FormData = {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export default function RegisterPage() {
    const router = useRouter()
    const form = useForm<FormData>({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: FormData) {
        if (values.password !== values.confirmPassword) {
            form.setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            })
            return
        }

        const result = await fetch(`http://127.0.0.1:8000/api/users/`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            },
        })

        const data = await result.json()

        if (result.status === 400) {
            if (data.username) {
                form.setError("username", {
                    type: "manual",
                    message: data.username[0],
                })
            }
        } else {
            router.push("/login")
        }
    }

    return (
            <div className="p-20  w-full  max-w-4xl transform transition-all    ">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-500">Create an Account</h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-700 flex items-center gap-2">
                                        <FaUser className="text-blue-500" /> Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username"
                                            {...field}
                                            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-700 flex items-center gap-2">
                                        <FaEnvelope className="text-blue-500" /> Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            type="email"
                                            {...field}
                                            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-700 flex items-center gap-2">
                                        <FaLock className="text-blue-500" /> Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your password"
                                            type="password"
                                            {...field}
                                            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-700 flex items-center gap-2">
                                        <FaLock className="text-blue-500" /> Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Confirm your password"
                                            type="password"
                                            {...field}
                                            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="!mt-4 w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-md transition-all"
                            type="submit"
                        >
                            Signup
                        </Button>
                    </form>
                </Form>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account?{" "}
                    <span
                        onClick={() => router.push("/login")}
                        className="text-blue-600 font-bold cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
    )
}
