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
  RegisterSchema,
  type RegisterFormData,
} from "@/features/auth/schemas/auth";
import { Link } from "react-router-dom";

const linkClass =
  "text-accent underline underline-offset-4 transition-colors duration-(--duration) hover:text-accent/80";

export const SignUpForm = ({ className }: { className?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting , isValid },
  } = useForm<RegisterFormData>({
    mode: "onBlur",
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Form submitted successfully:", data);
  };

  return (
    // flex-col lets this card stretch to the same height as its neighbour
    <Card
      variant="solid"
      corners
      className={`flex flex-col ${className ?? ""}`}
    >
      <CardHeader className="flex items-center justify-center pb-2">
        <Logo />
      </CardHeader>

      <CardContent className="flex-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Username:"
            type="text"
            id="username"
            autoComplete="username"
            placeholder="Enter your username"
            {...register("username")}
            error={errors.username?.message as string}
          />

          <Input
            label="Email:"
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message as string}
          />

          <Input
            label="Password:"
            type="password"
            id="password"
            autoComplete="new-password"
            placeholder="Enter your password"
            {...register("password")}
            error={errors.password?.message as string}
          />

          <Input
            label="Confirm Password:"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message as string}
          />

          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                {...register("terms")}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-ui border-border bg-card accent-accent"
              />
              <label
                htmlFor="terms"
                className="cursor-pointer select-none text-xs text-muted-foreground"
              >
                I agree to the{" "}
                <a href="/terms" className={linkClass}>
                  terms and conditions
                </a>
              </label>
            </div>
            {errors.terms?.message && (
              <p role="alert" className="text-xs text-destructive">
                {errors.terms.message as string}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="solid"
            size="lg"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            className="mt-2 w-full"
          >
            Sign up
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pt-4">
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className={linkClass}>
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
