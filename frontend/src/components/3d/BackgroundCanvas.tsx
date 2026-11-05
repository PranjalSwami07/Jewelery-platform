import React, { useEffect, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollProgress } = useScrollProgress();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate gold sparkles / diamond dust particles
    const particleCount = 140;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 1600,
      z: Math.random() * 800 + 100,
      size: Math.random() * 2 + 0.6,
      opacity: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.4 + 0.1,
      shimmer: Math.random() * Math.PI * 2,
    }));

    // Gemstone 3D polyhedron vertices (Brilliant Cut Diamond geometry)
    const gemVertices: Point3D[] = [
      // Culet (bottom point)
      { x: 0, y: 220, z: 0 },
      // Pavilion girdle points
      { x: 130, y: 30, z: 0 },
      { x: 92, y: 30, z: 92 },
      { x: 0, y: 30, z: 130 },
      { x: -92, y: 30, z: 92 },
      { x: -130, y: 30, z: 0 },
      { x: -92, y: 30, z: -92 },
      { x: 0, y: 30, z: -130 },
      { x: 92, y: 30, z: -92 },
      // Crown points
      { x: 75, y: -70, z: 0 },
      { x: 53, y: -70, z: 53 },
      { x: 0, y: -70, z: 75 },
      { x: -53, y: -70, z: 53 },
      { x: -75, y: -70, z: 0 },
      { x: -53, y: -70, z: -53 },
      { x: 0, y: -70, z: -75 },
      { x: 53, y: -70, z: -53 },
      // Table facet (top center)
      { x: 0, y: -90, z: 0 },
    ];

    // Edges connecting vertices
    const gemEdges = [
      // Pavilion to Culet
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
      // Girdle loop
      [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 1],
      // Crown connections
      [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 14], [7, 15], [8, 16],
      // Upper crown loop
      [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 9],
      // To Table
      [17, 9], [17, 10], [17, 11], [17, 12], [17, 13], [17, 14], [17, 15], [17, 16]
    ];

    let angleX = 0.2;
    let angleY = 0;
    let angleZ = 0;

    const render = () => {
      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep luxury gradient background
      const bgGrad = ctx.createRadialGradient(
        width / 2 + mouseRef.current.x * 60,
        height / 2 + mouseRef.current.y * 60,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, "#191512");
      bgGrad.addColorStop(0.4, "#0f0e0d");
      bgGrad.addColorStop(1, "#070707");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Scroll-driven rotations
      angleY += 0.003 + scrollProgress * 0.015;
      angleX = 0.35 + mouseRef.current.y * 0.4 + scrollProgress * Math.PI * 0.8;
      angleZ = mouseRef.current.x * 0.3 + scrollProgress * 1.2;

      // Project 3D Diamond
      const focalLength = 700;
      const originX = width * 0.72 - mouseRef.current.x * 40;
      const originY = height * 0.48 + (scrollProgress - 0.2) * 220;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // Project vertices
      const projected = gemVertices.map((v) => {
        // Y-axis rotation
        let x1 = v.x * cosY + v.z * sinY;
        let y1 = v.y;
        let z1 = -v.x * sinY + v.z * cosY;

        // X-axis rotation
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Z-axis rotation
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2 + 850; // offset back

        const scale = focalLength / z3;
        return {
          x: originX + x3 * scale,
          y: originY + y3 * scale,
          z: z3,
          scale,
        };
      });

      // Ambient golden light glow behind the gemstone
      const glowGrad = ctx.createRadialGradient(
        originX,
        originY,
        10,
        originX,
        originY,
        280
      );
      glowGrad.addColorStop(0, "rgba(219, 193, 126, 0.16)");
      glowGrad.addColorStop(0.5, "rgba(197, 160, 89, 0.06)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(originX, originY, 280, 0, Math.PI * 2);
      ctx.fill();

      // Draw Diamond Facets & Wireframe Edges
      ctx.lineWidth = 1.2;
      gemEdges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) / 2;
        const depthAlpha = Math.max(0.12, Math.min(0.75, 1 - (avgZ - 650) / 450));

        ctx.strokeStyle = `rgba(225, 198, 138, ${depthAlpha * 0.8})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Highlight facet apexes
      projected.forEach((p) => {
        const apexAlpha = Math.max(0.2, Math.min(0.9, 1 - (p.z - 650) / 450));
        ctx.fillStyle = `rgba(255, 245, 220, ${apexAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, 2.5 * p.scale), 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Floating Gold Dust & Sparkles
      particles.forEach((p) => {
        p.shimmer += 0.03;
        p.y -= p.speed;
        if (p.y < -800) p.y = 800;

        const pZ = p.z + scrollProgress * 150;
        const pScale = focalLength / pZ;
        const screenX = width / 2 + (p.x + mouseRef.current.x * 80) * pScale;
        const screenY = height / 2 + (p.y - scrollProgress * 300) * pScale;

        if (screenX > 0 && screenX < width && screenY > 0 && screenY < height) {
          const alpha =
            (p.opacity + Math.sin(p.shimmer) * 0.3) *
            Math.max(0, Math.min(1, 1 - pZ / 1200));
          ctx.fillStyle = `rgba(219, 193, 126, ${Math.max(0.05, alpha)})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size * pScale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
    />
  );
};

export default BackgroundCanvas;
