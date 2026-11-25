

export default function ThemePallete({ theme }: { theme: string }) {
  return (
    <span className="theme-palette" data-theme={theme} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}