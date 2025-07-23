'use client';
import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const InteractiveConstellation = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  const draw = useCallback((ctx, frameCount, theme) => {
    // Implement drawing logic here
    const canvas = ctx.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const config = {
      particleColor: 'rgba(30, 136, 229, 0.7)',
      lineColor: theme === 'dark' ? `rgba(255, 255, 255, 0.2)` : `rgba(30, 136, 229, 0.2)`,
      particleAmount: 100,
      defaultRadius: 4,
      variantRadius: 4,
      defaultSpeed: 0.05,
      variantSpeed: 0.05,
      linkRadius: 250,
      lineWidth: 2,
    };

    let particles = [];
    if (canvas.particles === undefined) {
      for (let i = 0; i < config.particleAmount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.defaultSpeed,
          vy: (Math.random() - 0.5) * config.defaultSpeed,
          radius: config.defaultRadius + Math.random() * config.variantRadius,
        });
      }
      canvas.particles = particles;
    } else {
      particles = canvas.particles;
    }


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = config.particleColor;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    for(let i = 0; i < particles.length; i++) {
      for(let j = i + 1; j < particles.length; j++) {
        let p1 = particles[i];
        let p2 = particles[j];
        let distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

        if(distance < config.linkRadius) {
          ctx.beginPath();
          ctx.strokeStyle = config.lineColor;
          ctx.lineWidth = config.lineWidth;
          ctx.globalAlpha = (config.linkRadius - distance) / config.linkRadius;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;


  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      draw(context, frameCount, theme);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Reset particles on resize to redistribute them
        canvas.particles = undefined; 
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [draw, theme]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }} 
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default InteractiveConstellation;
