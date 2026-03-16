import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login - Cipherium",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="font-mono font-bold text-xl text-center mb-2 text-foreground">
        Welcome Back
      </h1>
      <p className="font-mono text-sm text-center text-muted-foreground mb-6">
        Access your phishing analysis dashboard
      </p>
      <LoginForm />
    </>
  );
}
