import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useForm, useWatch } from "react-hook-form";
import { Check, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  type RegisterFormData,
} from "@/features/auth/schemas/auth";
import { Link } from "react-router-dom";
import { useEmailAuthSubmit } from "../hooks/useEmailAuthSubmit";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { useState } from "react";

const serverErrorFields: Record<string, "username" | "email" | "password"> = {
  USERNAME_IS_ALREADY_TAKEN: "username",
  USERNAME_TOO_SHORT: "username",
  USERNAME_TOO_LONG: "username",
  INVALID_USERNAME: "username",
  USER_ALREADY_EXISTS: "email",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "email",
  INVALID_EMAIL: "email",
  PASSWORD_TOO_SHORT: "password",
  PASSWORD_TOO_LONG: "password",
};

const linkClass =
  "text-accent underline underline-offset-4 transition-colors duration-(--duration) hover:text-accent/80";

export function SignUpForm({ className }: { className?: string }) {
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormData>({
    mode: "onTouched",
    resolver: zodResolver(RegisterSchema),
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = useEmailAuthSubmit<RegisterFormData>({
    endpoint: "/api/auth/sign-up/email",
    failureMessage: "Unable to create your account",
    getPayload: (data) => ({
      name: data.username,
      username: data.username,
      email: data.email,
      password: data.password,
    }),
    errorFields: serverErrorFields,
    clearErrors,
    setError,
  });

  return (
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
            maxLength={20}
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Enter your username"
            {...register("username")}
            error={errors.username?.message}
          />
          <Input
            label="Email:"
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message}
          />
          <div className="flex flex-col gap-2">
            <Input
              label="Password:"
              type="password"
              id="password"
              autoComplete="new-password"
              aria-describedby={`password-requirements${errors.password ? " password-error" : ""}`}
              placeholder="Enter your password"
              {...register("password")}
              error={errors.password?.message}
            />
            <ul
              id="password-requirements"
              aria-label="Password requirements"
              className="grid gap-1.5 text-xs sm:grid-cols-2"
            >
              {passwordRequirements.map(({ label, met }) => {
                const Icon = met ? Check : X;
                return (
                  <li
                    key={label}
                    className={`flex items-center gap-2 ${met ? "text-success" : "text-muted-foreground"}`}
                  >
                    <Icon aria-hidden="true" className="size-3.5 shrink-0" />
                    <span className="sr-only">
                      {met ? "Met: " : "Not met: "}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>
          <Input
            label="Confirm Password:"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                {...register("terms")}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? "terms-error" : undefined}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-ui border-border bg-card accent-accent"
              />
              <label
                htmlFor="terms"
                className="cursor-pointer select-none text-xs text-muted-foreground"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  terms and conditions
                </a>
              </label>
            </div>
            {errors.terms?.message && (
              <p
                id="terms-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.terms.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            variant="solid"
            size="lg"
            loading={isSubmitting}
            disabled={!isValid || isGoogleSubmitting}
            className="mt-2 w-full"
          >
            Sign up
          </Button>

          <GoogleSignInButton
            label="Sign up with Google"
            disabled={isSubmitting}
            onStart={() => clearErrors("root")}
            onError={(message) => setError("root", { type: "server", message })}
            onLoadingChange={setIsGoogleSubmitting}
          />
          {errors.root?.message && (
            <p role="alert" className="text-xs text-destructive text-center">
              {errors.root.message}
            </p>
          )}
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
}
