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

export const LoginForm = ({ className }: { className?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    mode: "onBlur",
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Form submitted successfully:", data);
  };

  return (
    <Card variant="solid" corners className={className}>
      <CardHeader className="flex items-center justify-center pb-2">
        <Logo />
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Email:"
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Password:"
            type="password"
            id="password"
            {...register("password")}
            error={errors.password?.message}
            placeholder="Enter your password"
          />
          <div className="flex justify-center mt-2">
            <Button
              type="submit"
              variant="solid"
              size="lg"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              className="mt-2 w-full"
            >
              Log in
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
