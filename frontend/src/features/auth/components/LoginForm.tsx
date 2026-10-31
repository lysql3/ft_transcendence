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
import { LoginSchema, type LoginFormData } from "@/features/auth/schemas/auth";
import { Link } from "react-router-dom";

const linkClass =
  "text-accent underline underline-offset-4 transition-colors duration-(--duration) hover:text-accent/80";

export const LoginForm = ({ className }: { className?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: "onBlur",
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // TODO: call your login API here.
    console.log("Login submitted for:", data.email);
  };

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
            label="Email:"
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Password:"
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register("password")}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            variant="solid"
            size="lg"
            loading={isSubmitting}
            className="mt-2 w-full"
          >
            Log in
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className={linkClass}>
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
