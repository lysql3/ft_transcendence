import { useEffect, useRef } from "react";

export type RainLayer = {
  fontSize: number;
  speed: [number, number];
  trail: [number, number];
  brightness: number;
  glow: number;
  density: number;
};

export type MatrixRainConfig = {
  speed: number; 
  density: number; 
  bgColor: string; 
  trailFade: number; 
  trailLength: number; 
  color: string; 
  headColor: string; 
  chars: string; 
  font: string; 
  mutation: number; 
  layers: RainLayer[]; 
};

const DEFAULT_CONFIG: MatrixRainConfig = {
  speed: 1,
  density: 1,
  bgColor: "#000000", 
  trailFade: 0.32,
  trailLength: 1,
  color: "#AFFF33",
  headColor: "#EFFFD0",
  chars: "01",
  font: '"MS Gothic","Noto Sans Mono CJK JP","Hiragino Kaku Gothic Pro",monospace',
  mutation: 0.35,
  layers: [
    {
      fontSize: 12,
      speed: [5, 9],
      trail: [14, 30],
      brightness: 0.35,
      glow: 0,
      density: 0.55,
    },
    {
      fontSize: 18,
      speed: [9, 15],
      trail: [12, 28],
      brightness: 0.7,
      glow: 0,
      density: 0.45,
    },
    {
      fontSize: 28,
      speed: [15, 26],
      trail: [10, 24],
      brightness: 1,
      glow: 14,
      density: 0.35,
    },
  ],
};

type Stream = {
  col: number;
  len: number;
  y: number;
  speed: number;
  chars: string[];
  lastRow: number;
};
type LayerState = RainLayer & { streams: Stream[] };

type MatrixRainProps = Partial<MatrixRainConfig> & {
  className?: string;
  bgClass?: string; 
  colorClass?: string; 
  headClass?: string; 
};

const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
};

export function MatrixRain({
  className = "pointer-events-none fixed inset-0 -z-10 h-screen w-screen",
  bgClass = "bg-[var(--bg-primary)]",
  colorClass = "text-[var(--accent)]",
  headClass = "text-[var(--text-primary)]",
  ...overrides
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgProbe = useRef<HTMLSpanElement>(null);
  const mainProbe = useRef<HTMLSpanElement>(null);
  const headProbe = useRef<HTMLSpanElement>(null);

  
  
  const configKey = JSON.stringify(overrides);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const bgEl = bgProbe.current;
    const mainEl = mainProbe.current;
    const headEl = headProbe.current;
    if (!canvas || !ctx || !bgEl || !mainEl || !headEl) return;

    const parsed = JSON.parse(configKey) as Partial<MatrixRainConfig>;
    const CONFIG: MatrixRainConfig = { ...DEFAULT_CONFIG, ...parsed };

    
    
    const tryParse = (v: string): [number, number, number] | null => {
      if (!v) return null;
      ctx.fillStyle = "#010203";
      ctx.fillStyle = v;
      const out = String(ctx.fillStyle);
      if (out === "#010203" && v.toLowerCase() !== "#010203") return null;
      if (out.startsWith("#")) return hexToRgb(out);
      if (/^rgba?\(/.test(out)) {
        const m = out.match(/[\d.]+/g)!;
        if (m[3] !== undefined && +m[3] === 0) return null; 
        return [+m[0], +m[1], +m[2]];
      }
      return null;
    };

    
    
    const warned = new Set<string>();
    const parseColor = (value: string, fallback: string, label: string) => {
      const rgb = tryParse(value);
      if (rgb) return rgb;
      if (!warned.has(label)) {
        warned.add(label);
        console.warn(
          `MatrixRain: could not read a color for "${label}" from your theme, using fallback ${fallback}. ` +
            `Check that the class or CSS variable exists.`,
        );
      }
      return tryParse(fallback) ?? [0, 0, 0];
    };

    let bg: [number, number, number] = [0, 0, 0];
    let main = bg;
    let head = bg;
    let neck: number[] = bg;
    let colorKey = "";

    
    
    const readColors = () => {
      bg = parseColor(
        parsed.bgColor ?? getComputedStyle(bgEl).backgroundColor,
        DEFAULT_CONFIG.bgColor,
        "bgClass",
      );
      main = parseColor(
        parsed.color ?? getComputedStyle(mainEl).color,
        DEFAULT_CONFIG.color,
        "colorClass",
      );
      head = parseColor(
        parsed.headColor ?? getComputedStyle(headEl).color,
        DEFAULT_CONFIG.headColor,
        "headClass",
      );
      neck = main.map((v, i) => ((v + head[i]) / 2) | 0); 
      const key = `${bg}|${main}|${head}`;
      const changed = key !== colorKey;
      colorKey = key;
      return changed;
    };
    readColors();

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0.35
      : 1;
    const chars = CONFIG.chars;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const rndChar = () => chars[(Math.random() * chars.length) | 0];

    let W = 0;
    let H = 0;
    const layers: LayerState[] = CONFIG.layers.map((l) => ({
      ...l,
      streams: [],
    }));

    function makeStream(
      layer: LayerState,
      col: number,
      rows: number,
      scatter: boolean,
    ): Stream {
      const len = Math.max(
        3,
        Math.round(rnd(layer.trail[0], layer.trail[1]) * CONFIG.trailLength),
      );
      return {
        col,
        len,
        y: scatter ? rnd(-len, rows + len) : -rnd(0, rows * 0.6) - len,
        speed: rnd(layer.speed[0], layer.speed[1]),
        chars: Array.from({ length: len }, rndChar),
        lastRow: -9999,
      };
    }

    function initStreams() {
      layers.forEach((layer) => {
        const cols = Math.ceil(W / layer.fontSize);
        const rows = Math.ceil(H / layer.fontSize);
        const chance = Math.min(1, layer.density * CONFIG.density);
        layer.streams = [];
        for (let c = 0; c < cols; c++) {
          if (Math.random() < chance)
            layer.streams.push(makeStream(layer, c, rows, true));
        }
      });
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = `rgb(${bg})`;
      ctx!.fillRect(0, 0, W, H);
      initStreams();
    }

    let last = performance.now();
    let lastColorCheck = 0;
    let raf = 0;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      
      
      if (now - lastColorCheck > 250) {
        lastColorCheck = now;
        if (readColors()) {
          ctx!.fillStyle = `rgb(${bg})`;
          ctx!.fillRect(0, 0, W, H);
        }
      }

      ctx!.shadowBlur = 0;
      ctx!.fillStyle = `rgba(${bg[0]},${bg[1]},${bg[2]},${CONFIG.trailFade})`;
      ctx!.fillRect(0, 0, W, H);

      for (const layer of layers) {
        const fs = layer.fontSize;
        const rows = Math.ceil(H / fs);
        ctx!.font = `${fs}px ${CONFIG.font}`;

        for (const s of layer.streams) {
          s.y += s.speed * CONFIG.speed * motion * dt;
          const headRow = Math.floor(s.y);

          if (headRow !== s.lastRow) {
            s.chars.unshift(rndChar());
            s.chars.length = s.len;
            s.lastRow = headRow;
          }
          if (Math.random() < CONFIG.mutation) {
            s.chars[1 + ((Math.random() * (s.len - 1)) | 0)] = rndChar();
          }

          if (headRow - s.len > rows) {
            Object.assign(s, makeStream(layer, s.col, rows, false));
            continue;
          }

          const x = s.col * fs;
          for (let i = 0; i < s.len; i++) {
            const row = headRow - i;
            if (row < 0 || row > rows) continue;
            const a = Math.pow(1 - i / s.len, 1.7) * layer.brightness;
            if (a < 0.02) continue;
            const c = i === 0 ? head : i === 1 ? neck : main;
            ctx!.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
            const y = row * fs + fs;
            if (i === 0 && layer.glow) {
              ctx!.shadowColor = `rgb(${main})`;
              ctx!.shadowBlur = layer.glow;
              ctx!.fillText(s.chars[i], x, y);
              ctx!.shadowBlur = 0;
            } else {
              ctx!.fillText(s.chars[i], x, y);
            }
          }
        }
      }
    }

    const onVisibility = () => {
      last = performance.now();
    };

    
    
    const observer = new MutationObserver(() => {
      if (readColors()) {
        ctx.fillStyle = `rgb(${bg})`;
        ctx.fillRect(0, 0, W, H);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
      subtree: true,
    });

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    raf = requestAnimationFrame(frame);

    
    
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [configKey]);

  return (
    <>
      <canvas ref={canvasRef} className={className} aria-hidden="true" />
      {/* Hidden probes: Tailwind resolves your theme classes on these, and the
          animation reads the resulting colors. They are never shown. */}
      <div className="hidden" aria-hidden="true">
        <span ref={bgProbe} className={bgClass} />
        <span ref={mainProbe} className={colorClass} />
        <span ref={headProbe} className={headClass} />
      </div>
    </>
  );
}
