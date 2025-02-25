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
import { useState } from "react"
import { FaEnvelope, FaLock } from "react-icons/fa"

type FormData = {
    email: string
    password: string
}

export default function LoginForm() {
    const router = useRouter()
    const form = useForm<FormData>({
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const [loading, setLoading] = useState(false)

    async function onSubmit(values: FormData) {
        setLoading(true)
        const result = await fetch(`http://127.0.0.1:8000/api/login/`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            },
        })

        const data = await result.json()

        if (result.status === 200) {
            router.push("/dashboard")
        } else {
            form.setError("email", {
                type: "manual",
                message: data.message || "Invalid credentials",
            })
        }
        setLoading(false)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-3xl w-full p-4 "
            >
                <h2 className="text-3xl font-bold text-center mb-4 text-blue-500">Login</h2>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <FaEnvelope className="text-blue-500" />
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email" type="email" {...field} />
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
                            <FormLabel className="flex items-center gap-2">
                                <FaLock className="text-blue-500" />
                                Password
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button 
                    className="!mt-4 w-full bg-blue-400 hover:bg-blue-500 transition-colors duration-200" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center mt-4">
                    <p className="text-sm">
                        Don't have an account? 
                        <span 
                            className="text-blue-500 cursor-pointer hover:underline" 
                            onClick={() => router.push("/register")}
                        >
                            Sign up
                        </span>
                    </p>
                </div>
            </form>
        </Form>
    )
}
