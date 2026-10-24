"use client";
import React, { useEffect, useRef } from "react";

// Gold dust drifting in the window's light. Draws one still frame under
// reduced motion, and pauses whenever the hero is off screen.

function rng(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Motes({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const R = rng(9);
    const dots = Array.from({ length: 60 }, () => ({
      u: R(),
      v: R(),
      r: 0.5 + R() * 1.7,
      s: 0.00008 + R() * 0.00025,
      p: R() * Math.PI * 2,
    }));
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);
      const wide = width > 960;
      for (const d of dots) {
        const v = (((d.v - t * d.s) % 1) + 1) % 1;
        const u = d.u + Math.sin(t * 0.0003 + d.p) * 0.02;
        const x = wide ? width * (0.08 + u * 0.6 + (1 - v) * 0.2) : width * (0.2 + u * 0.6);
        const y = height * (0.12 + v * 0.84);
        const alpha = 0.2 + 0.55 * Math.abs(Math.sin(t * 0.0006 + d.p));
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 226, 120, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    const loop = (t) => {
      draw(t);
      if (visible) frame = requestAnimationFrame(loop);
    };

    size();
    const onResize = () => {
      size();
      if (reduce) draw(0);
    };
    window.addEventListener("resize", onResize);

    if (reduce) {
      draw(0);
      return () => window.removeEventListener("resize", onResize);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(loop);
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
