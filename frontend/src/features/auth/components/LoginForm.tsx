import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Logo } from "../../../components/ui/Logo";
import { Button } from "../../../components/ui/Button";



export const LoginForm = ({ className }: { className?: string }) => {
  return (
    <Card variant="solid" className={className}>
      <CardHeader className="flex items-center justify-center">
        <Logo />
      </CardHeader>
      <CardContent>
        <form>
          <div className="mt-4">
            <label htmlFor="username">Username:</label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="email">Email:</label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="password">Password:</label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            required/>
          </div>

          <div className="mt-4">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
            required/>
          </div>

          <div className="flex mt-4 gap-2 items-center">
            <Input type="checkbox" id="terms" name="terms"/>
            <label htmlFor="terms">I agree to the <span className="underline text-accent"><a href="/terms">terms and conditions</a></span></label>
          </div>

          <div className="flex justify-center mt-4">
            <Button type="submit">SIGN UP</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
