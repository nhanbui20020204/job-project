import RegisterForm from "@/app/Components/Client/AuthForm/RegisterForm";
import Header from "@/app/Components/Client/Header/page";

export default function LoginPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen items-center justify-center">
            <RegisterForm />
        </div>
        </>
    )
}