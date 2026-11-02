import { useNavigate } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { Button } from "@/components/ui/Button";

export function VerifySuccessPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh items-center justify-center px-gutter py-8">
      <MatrixRain />

      <Card
        variant="glass"
        padding="none"
        className="flex w-full max-w-2xl flex-col items-center p-8 text-center sm:p-12 md:p-16"
      >
        <CardHeader className="flex flex-col items-center gap-6">
          <span
            aria-hidden="true"
            className="flex size-16 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent"
          >
            <CircleCheck className="size-14" />
          </span>

          <div className="flex items-center gap-2 text-xs tracking-widest text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse"
            />
            <span>IDENTITY CONFIRMED</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          <h1 className="text-4xl uppercase font-extrabold leading-none tracking-ui text-foreground sm:text-6xl xl:text-7xl">
            ACCOUNT
            <span className="mt-2 block text-accent">VERIFIED</span>
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Your email has been successfully verified. Your node is online and
            your profile is ready for deployment in the arena.
          </p>

          <div className="w-full pt-4 sm:w-auto">
            {/* replace: the Back button won't return to the reset form */}
            <Button
              size="lg"
              className="w-full px-8 font-bold sm:w-auto"
              onClick={() => navigate("/login", { replace: true })}
            >
              Back to login
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
