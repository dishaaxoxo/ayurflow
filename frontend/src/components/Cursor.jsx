import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let isHovering = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.15; // lerp friction
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${isHovering ? 1.6 : 1})`;
      requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove);
    let animationFrame = requestAnimationFrame(loop);

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, [data-cursor-hover="true"]');
      if (target) {
        isHovering = true;
        ring.style.backgroundColor = 'rgba(108, 142, 117, 0.15)';
        ring.style.borderColor = 'rgba(108, 142, 117, 0.3)';
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0)`;
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, input, textarea, [data-cursor-hover="true"]');
      if (target) {
        isHovering = false;
        ring.style.backgroundColor = 'transparent';
        ring.style.borderColor = 'rgba(108, 142, 117, 0.8)';
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Hide on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-[32px] h-[32px] -ml-[16px] -mt-[16px] rounded-full border-2 border-[#6C8E75]/80 pointer-events-none z-[10000] mix-blend-multiply transition-colors duration-300 ease-out will-change-transform"
        style={{ transition: 'background-color 0.3s, border-color 0.3s, transform 0.1s linear' }}
      />
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] -ml-[3px] -mt-[3px] bg-[#6C8E75] rounded-full pointer-events-none z-[10000] transition-transform duration-200 ease-out will-change-transform"
      />
    </>
  );
}
