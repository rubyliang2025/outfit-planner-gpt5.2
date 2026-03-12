'use client';

import { useEffect, useState, useRef } from 'react';

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();
  const smoothPos = useRef({ x: 0, y: 0 });
  const trailPositions = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      // 更灵敏的跟随速度
      smoothPos.current.x += (mousePosition.x - smoothPos.current.x) * 0.25;
      smoothPos.current.y += (mousePosition.y - smoothPos.current.y) * 0.25;

      // 记录拖尾位置
      trailPositions.current.unshift({ x: smoothPos.current.x, y: smoothPos.current.y });
      if (trailPositions.current.length > 12) {
        trailPositions.current.pop();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition.x, mousePosition.y]);

  const currentX = smoothPos.current.x;
  const currentY = smoothPos.current.y;

  return (
    <>
      {/* 基础深色背景 */}
      <div className="absolute inset-0 bg-[#02020a]" />

      {/* 主渐变层 - 更深的紫调 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0e0520] via-[#080d28] via-40% to-[#050f1a]" />

      {/* 动态渐变层 - 紫到蓝绿 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/50 via-transparent to-cyan-950/30" />

      {/* 红色点缀 */}
      <div className="absolute inset-0 bg-gradient-to-bl from-red-950/15 via-transparent to-transparent" />

      {/* 静态大光晕 */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-950/40 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-cyan-900/10 rounded-full blur-[180px]" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-950/35 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-950/25 rounded-full blur-[120px]" />

      {/* 红色光晕 */}
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-rose-950/20 rounded-full blur-[100px]" />

      {/* 拖尾光点 - 无边缘柔和效果 */}
      {trailPositions.current.map((pos, index) => {
        const size = 40 - index * 3;
        const opacity = Math.max(0, 0.5 - index * 0.045);
        return (
          <div
            key={index}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              left: pos.x - size / 2,
              top: pos.y - size / 2,
              background: `radial-gradient(circle, rgba(199, 210, 254, ${opacity}) 0%, rgba(139, 92, 246, ${opacity * 0.6}) 40%, transparent 100%)`,
              filter: `blur(${2 + index * 0.5}px)`,
              opacity: isVisible ? opacity : 0,
              transition: 'opacity 0.15s',
            }}
          />
        );
      })}

      {/* 核心光点 - 紧贴鼠标 */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 14,
          height: 14,
          left: currentX - 7,
          top: currentY - 7,
          background: 'radial-gradient(circle, rgba(199, 210, 254, 0.6) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(6, 182, 212, 0.1) 100%)',
          boxShadow: '0 0 15px rgba(199, 210, 254, 0.4), 0 0 30px rgba(139, 92, 246, 0.2)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s',
        }}
      />
    </>
  );
}
