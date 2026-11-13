import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/features/auth/schemas/auth";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const linkClass =
  "text-accent underline underline-offset-4 transition-colors duration-(--duration) hover:text-accent/80";

export function ForgotPasswordForm({ className = "" }: { className?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordFormData>({
    mode: "onTouched",
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const navigate = useNavigate();
  
  const onSubmit = async (data: ForgotPasswordFormData) => {
    // TODO: call your forgot password API here.
    console.log("Forgot password submitted for:", data.email);

    navigate("/reset-link-sent", {
      state: { allowed: true },
      replace: true,
    });
  };

  return (
    <Card variant="solid" corners className={`flex flex-col ${className}`}>
      <CardHeader className="flex flex-col items-center justify-center gap-2 pb-2">
        <Logo />
        <h2 className="text-xl font-bold uppercase tracking-ui text-foreground">
          Forgot password?
        </h2>
        <p className="text-center text-xs text-muted-foreground">
          No problem. We'll send a reset link to your inbox.
        </p>
      </CardHeader>

      <CardContent className="flex-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Email:"
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Enter your email address"
            {...register("email")}
            error={errors.email?.message}
          />

          <Button
            type="submit"
            variant="solid"
            size="lg"
            loading={isSubmitting}
            disabled={!isValid}
            className="mt-2 w-full"
          >
            Send Reset Link
          </Button>

          <div className="mt-4 flex items-center justify-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-4 text-accent" />
            <p className="text-center text-xs text-muted-foreground">
              Reset links expire after 30 minutes.
            </p>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pt-2">
        <p className="text-center text-xs text-muted-foreground">
          Remembered your credentials?{" "}
          <Link to="/login" className={linkClass}>
            Back to login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
