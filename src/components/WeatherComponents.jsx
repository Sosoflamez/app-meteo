import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function ParticleCanvas({ particle }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 14 + 6,
      sx: (Math.random() - 0.5) * 0.4,
      sy: Math.random() * 0.35 + 0.1,
      op: Math.random() * 0.35 + 0.1,
      w: Math.random() * Math.PI * 2,
      ws: Math.random() * 0.018 + 0.004,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.w += p.ws;
        p.x += Math.sin(p.w) * 0.4 + p.sx;
        p.y -= p.sy;
        if (p.y < -30) { p.y = canvas.height + 30; p.x = Math.random() * canvas.width; }
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;
        ctx.save();
        ctx.globalAlpha = p.op;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(particle, p.x, p.y);
        ctx.restore();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [particle]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

export function WeatherIconAnim({ icon }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.killTweensOf(ref.current);
    gsap.fromTo(ref.current,
      { scale: 0, rotate: -15, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    );
    gsap.to(ref.current, { y: -16, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.8 });
    gsap.to(ref.current, { rotate: 6, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 });
  }, [icon]);

  return (
    <div
      ref={ref}
      style={{ fontSize: "7rem", display: "inline-block", filter: "drop-shadow(0 0 40px rgba(255,255,255,0.15))" }}
    >
      {icon}
    </div>
  );
}

export function AnimatedTemp({ value, accent }) {
  const ref = useRef(null);
  const prev = useRef(0);

  useEffect(() => {
    const obj = { val: prev.current };
    gsap.to(obj, {
      val: value,
      duration: 1.4,
      ease: "power3.out",
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.val) + "°"; },
    });
    prev.current = value;
  }, [value]);

  return (
    <span
      ref={ref}
      style={{ fontSize: "6.5rem", fontWeight: 200, color: "white", lineHeight: 1, textShadow: `0 0 60px ${accent}55` }}
    >
      {value}°
    </span>
  );
}

export function StatBar({ value, max, accent }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current)
      gsap.fromTo(ref.current,
        { width: 0 },
        { width: `${(value / max) * 100}%`, duration: 1, ease: "power2.out", delay: 0.5 }
      );
  }, [value]);

  return (
    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 5, width: "100%", overflow: "hidden", marginTop: 6 }}>
      <div ref={ref} style={{ height: "100%", background: accent, borderRadius: 999, width: 0 }} />
    </div>
  );
}

