import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Logo } from "../../../components/ui/Logo";
import { Button } from "@/components/ui/Button";

export const LoginForm = ({ className }: { className?: string }) => {
  return (
    <Card variant="solid" corners className={className}>
      <CardHeader className="flex items-center justify-center pb-2">
        <Logo />
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <Input
            label="Username:"
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            required
          />

          <Input
            label="Email:"
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />

          <Input
            label="Password:"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />

          <Input
            label="Confirm Password:"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="h-4 w-4 rounded-ui border-border bg-card accent-accent cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer select-none">
              I agree to the{" "}
              <a href="/terms" className="underline text-accent hover:text-accent/80 transition-colors">
                terms and conditions
              </a>
            </label>
          </div>

          <div className="flex justify-center mt-2">
            <Button type="submit" variant="solid" className="w-full">
              SIGN UP
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};