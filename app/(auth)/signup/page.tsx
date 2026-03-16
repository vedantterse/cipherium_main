import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign Up - Cipherium",
};

export default function SignupPage() {
  return (
    <>
      <h1 className="font-mono font-bold text-xl text-center mb-2 text-foreground">
        Create Account
      </h1>
      <p className="font-mono text-sm text-center text-muted-foreground mb-6">
        Start detecting phishing threats today
      </p>
      <SignupForm />
    </>
  );
}
