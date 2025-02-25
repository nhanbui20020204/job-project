import LoginForm from "@/app/Components/Client/AuthForm/LoginForm";
import Header from "@/app/Components/Client/Header/page";

export default function LoginPage() {
    return (
        <>
        <div className="flex flex-col min-h-screen items-center justify-center">
            <LoginForm/>
        </div>
        </>
    )
}