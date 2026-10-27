import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/features/auth/schemas/auth";

export const LoginForm = ({ className }: { className?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted successfully:", data);
  };

  return (
    <Card variant="solid" corners className={className}>
      <CardHeader className="flex items-center justify-center pb-2">
        <Logo />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

          <Input
            label="Email:"
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message as string}
          />

          <Input
            label="Password:"
            type="password"
            id="password"
            {...register("password")}
            error={errors.password?.message as string}
            placeholder="Enter your password"
          />
          <div className="flex justify-center mt-2">
            <Button type="submit" variant="solid" className="w-full">
              Log in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};