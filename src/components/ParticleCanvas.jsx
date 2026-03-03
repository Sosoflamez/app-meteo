import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function ParticleCanvas({ particle }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
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

    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [particle]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

ParticleCanvas.propTypes = {
  particle: PropTypes.string.isRequired,
};