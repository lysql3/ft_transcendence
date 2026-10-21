import { NavBar } from "../components/layout/NavBar";
import { MatrixRain } from "../components/ui/MatrixRain";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../components/ui/Card";
import { LoginForm } from "../features/auth/components/LoginForm";

function HomePage() {
  return (
    <div>
      <MatrixRain />
      <NavBar links={[]} homeHref="/" activePath="/" />
      <div className="flex justify-start items-center justify-center p-4">
        <Card variant="glass" padding="lg" className="max-w-2xl">
          <CardHeader className="space-y-0 leading-none">
            <h1 className="text-[70px] sm:text-[900x] md:text-[100px] font-black tracking-tight text-fg">
              CODE.
            </h1>
            <h1 className="text-[70px] sm:text-[90px] md:text-[100px] font-black tracking-tight text-accent">
              COMPETE.
            </h1>
            <h1 className="text-[70px] sm:text-[90px] md:text-[100px] font-black tracking-tight text-fg">
              CONQUER.
            </h1>
          </CardHeader>

          <CardContent className="mt-6">
            <CardDescription className="text-base sm:text-lg text-muted">
              A multiplayer coding arena where developers compete, solve
              challenges, and climb the leaderboard.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="relative flex justify-center">
        <LoginForm className="" />
      </div>
    </div>
  );
}

export default HomePage;
