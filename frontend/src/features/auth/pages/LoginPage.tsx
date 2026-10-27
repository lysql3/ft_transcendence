import { LoginForm } from "@/features/auth/components/LoginForm";
import { MatrixRain } from "@/components/ui/MatrixRain";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <MatrixRain />
      <LoginForm className="w-full max-w-md" />
    </div>
  );
}