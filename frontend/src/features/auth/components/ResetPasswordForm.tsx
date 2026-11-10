import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth/schemas/auth";
import { Link, useNavigate } from "react-router-dom";

const linkClass =
  "text-accent underline underline-offset-4 transition-colors duration-(--duration) hover:text-accent/80";

export function ResetPasswordForm({ className }: { className?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordFormData>({
    mode: "onTouched",
    resolver: zodResolver(ResetPasswordSchema),
  });

  const navigate = useNavigate();
  const onSubmit = async (data: ResetPasswordFormData) => {
    // TODO: call your reset password API here. its okay to log password for now
    console.log("Reset password submitted for:", data);
  
    navigate("/password-reset-success", {
      state: { allowed: true },
      replace: true,
    });
  };

  return (
    <Card
      variant="solid"
      corners
      className={`flex flex-col ${className ?? ""}`}
    >
      <CardHeader className="flex flex-col items-center justify-center gap-2 pb-2">
        <Logo />
        <h2 className="text-xl font-bold uppercase tracking-ui text-foreground">
          Set new password
        </h2>
      </CardHeader>

      <CardContent className="flex-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Password:"
            type="password"
            id="password"
            autoComplete="new-password"
            placeholder="Enter your password"
            {...register("password", { deps: ["confirmPassword"] })}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password:"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="solid"
            size="lg"
            loading={isSubmitting}
            disabled={!isValid}
            className="mt-2 w-full"
          >
            Reset password
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-center text-xs text-muted-foreground">
          Changed your mind?{" "}
          <Link to="/login" className={linkClass}>
            Return to login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
} 
