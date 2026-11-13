import { useState } from "react";

type AvatarProps = {
  src?: string | null;
  name: string;
  className?: string;
};

/** Square avatar. Shows the profile image, falls back to the first letter
 *  if there is no image or it fails to load. */
export function Avatar({ src, name, className = "size-8" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!src && !failed;

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-ui border border-accent/40 bg-accent/10 text-xs font-bold text-accent ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </span>
  );
}