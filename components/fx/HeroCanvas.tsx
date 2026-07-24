"use client";
import { useEffect, useRef } from "react";

/**
 * Three.js ambient background for navy heroes: a slow-breathing wave field of
 * brand-green points with gentle mouse parallax. Lazy-loads three, caps DPR,
 * pauses when offscreen/hidden, and skips under prefers-reduced-motion.
 */
export function HeroCanvas({ dim = false }: { dim?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let raf = 0;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed || !hostRef.current) return;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
      camera.position.set(0, 2.1, 7.5);
      camera.lookAt(0, 0, 0);

      // Wavy grid of points
      const COLS = 90, ROWS = 34, W = 22, D = 9;
      const count = COLS * ROWS;
      const pos = new Float32Array(count * 3);
      const seed = new Float32Array(count);
      let i = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          pos[i * 3] = (c / (COLS - 1) - 0.5) * W;
          pos[i * 3 + 1] = 0;
          pos[i * 3 + 2] = (r / (ROWS - 1) - 0.5) * D;
          seed[i] = Math.random() * Math.PI * 2;
          i++;
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x04d98b,
        size: 0.045,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      points.position.y = -1.1;
      scene.add(points);

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      // Pause when the hero is offscreen or the tab is hidden
      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
      io.observe(host);

      let mx = 0, my = 0;
      const onPointer = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        mx = (e.clientX - rect.left) / rect.width - 0.5;
        my = (e.clientY - rect.top) / rect.height - 0.5;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const clock = new THREE.Clock();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime();
        const p = geo.attributes.position as InstanceType<typeof THREE.BufferAttribute>;
        for (let k = 0; k < count; k++) {
          const x = pos[k * 3], z = pos[k * 3 + 2];
          p.array[k * 3 + 1] = Math.sin(x * 0.55 + t * 0.7 + seed[k] * 0.15) * 0.32 + Math.cos(z * 0.9 + t * 0.5) * 0.22;
        }
        p.needsUpdate = true;
        points.rotation.y += ((mx * 0.12 - points.rotation.y) * 0.04);
        points.rotation.x = -0.06 + (-my * 0.05 - points.rotation.x - 0.06) * 0.04;
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointer);
        ro.disconnect();
        io.disconnect();
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return <div ref={hostRef} className={`hero-canvas${dim ? " hero-canvas--dim" : ""}`} aria-hidden="true" />;
}
