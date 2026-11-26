import { useState } from "react";
import { cn } from "@/lib/cn";
import defaultAvatar from "@/assets/images/default-avatar.png";

type AvatarProps = {
  src?: string | null;
  name: string;
  className?: string;
};

export function Avatar({ src, name, className }: AvatarProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);

  const imageSrc = [src?.trim(), defaultAvatar].find(
    (candidate) => candidate && !failedSources.includes(candidate),
  );

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-ui border border-accent/40 bg-accent/10 text-xs font-bold text-accent",
        className,
      )}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className="size-full object-cover"
          onError={() =>
            setFailedSources((previous) =>
              previous.includes(imageSrc) ? previous : [...previous, imageSrc],
            )
          }
        />
      ) : (
        name.trim().charAt(0).toUpperCase() || "?"
      )}
    </span>
  );
}
