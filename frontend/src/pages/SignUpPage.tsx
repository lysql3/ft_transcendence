import { LoginForm } from "@/features/auth/components/SignUpForm"
import { MatrixRain } from "@/components/ui/MatrixRain"

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <MatrixRain />
      <LoginForm />
    </div>
  );
}