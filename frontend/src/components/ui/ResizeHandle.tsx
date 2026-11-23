import { useRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ResizeHandleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "children"
  | "value"
  | "onChange"
  | "role"
  | "onPointerDown"
  | "onPointerMove"
  | "onPointerUp"
  | "onPointerCancel"
  | "onLostPointerCapture"
  | "onKeyDown"
  | "aria-orientation"
  | "aria-valuemin"
  | "aria-valuemax"
  | "aria-valuenow"
> & {
  orientation: "vertical" | "horizontal";
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  /** Reverse movement for a panel below or to the right of the handle. */
  reverse?: boolean;
  /** Convert pointer pixels to layout units; defaults to 1 for pixel sizes. */
  getPixelsPerUnit?: (handle: HTMLButtonElement) => number;
};

export function ResizeHandle({
  orientation,
  value,
  min,
  max,
  step = 1,
  onValueChange,
  reverse = false,
  getPixelsPerUnit,
  className,
  ...props
}: ResizeHandleProps) {
  const isVertical = orientation === "vertical";
  const direction = reverse ? -1 : 1;
  const drag = useRef<{
    pointerId: number;
    position: number;
    value: number;
    pixelsPerUnit: number;
  } | null>(null);
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  function finishDrag(handle: HTMLButtonElement, pointerId: number) {
    if (drag.current?.pointerId !== pointerId) return;
    drag.current = null;
    if (handle.hasPointerCapture(pointerId))
      handle.releasePointerCapture(pointerId);
  }

  return (
    <button
      {...props}
      type="button"
      role="separator"
      aria-orientation={orientation}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onPointerDown={(event) => {
        if (event.button !== 0 || drag.current) return;
        const handle = event.currentTarget;
        const pixelsPerUnit = getPixelsPerUnit?.(handle) ?? 1;
        if (!Number.isFinite(pixelsPerUnit) || pixelsPerUnit <= 0) return;
        event.preventDefault();
        handle.focus();
        handle.setPointerCapture(event.pointerId);
        drag.current = {
          pointerId: event.pointerId,
          position: isVertical ? event.clientX : event.clientY,
          value,
          pixelsPerUnit,
        };
      }}
      onPointerMove={(event) => {
        const start = drag.current;
        if (
          !start ||
          start.pointerId !== event.pointerId ||
          !event.currentTarget.hasPointerCapture(event.pointerId)
        )
          return;
        const position = isVertical ? event.clientX : event.clientY;
        onValueChange(
          clamp(
            start.value +
              (direction * (position - start.position)) / start.pixelsPerUnit,
          ),
        );
      }}
      onPointerUp={(event) => finishDrag(event.currentTarget, event.pointerId)}
      onPointerCancel={(event) =>
        finishDrag(event.currentTarget, event.pointerId)
      }
      onLostPointerCapture={(event) => {
        if (drag.current?.pointerId === event.pointerId) drag.current = null;
      }}
      onKeyDown={(event) => {
        let next: number;
        if (event.key === "Home") next = min;
        else if (event.key === "End") next = max;
        else if (event.key === (isVertical ? "ArrowLeft" : "ArrowUp"))
          next = value - direction * step;
        else if (event.key === (isVertical ? "ArrowRight" : "ArrowDown"))
          next = value + direction * step;
        else return;
        event.preventDefault();
        onValueChange(clamp(next));
      }}
      className={cn(
        "group flex shrink-0 touch-none select-none items-center justify-center rounded-ui border border-border bg-secondary p-0 text-muted-foreground",
        "transition-colors duration-(--duration) ease-ui hover:border-accent hover:bg-accent/10 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50",
        isVertical
          ? "h-full w-4 cursor-col-resize"
          : "h-4 w-full cursor-row-resize",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center gap-1",
          isVertical ? "flex-col" : "flex-row",
        )}
      >
        <span className="size-1 rounded-full bg-current" />
        <span className="size-1 rounded-full bg-current" />
        <span className="size-1 rounded-full bg-current" />
      </span>
    </button>
  );
}
