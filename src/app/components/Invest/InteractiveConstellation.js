'use client';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const InteractiveConstellation = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  
  // Use refs to store current values to prevent unnecessary re-renders
  const isMobileRef = useRef(isMobile);
  const aspectRatioRef = useRef(aspectRatio);
  
  // Update refs when state changes
  useEffect(() => {
    isMobileRef.current = isMobile;
    aspectRatioRef.current = aspectRatio;
  }, [isMobile, aspectRatio]);

  // Detect mobile and aspect ratio
  useEffect(() => {
    const checkDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width < 768);
      setAspectRatio(width / height);
    };
    checkDimensions();
    window.addEventListener('resize', checkDimensions);
    return () => window.removeEventListener('resize', checkDimensions);
  }, []);

  // Create a stable draw function that doesn't change
  const drawRef = useRef();
  drawRef.current = (ctx, frameCount, theme) => {
    // Implement drawing logic here
    const canvas = ctx.canvas;
    const container = containerRef.current;
    
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Calculate responsive parameters based on aspect ratio
    const isHighAspectRatio = aspectRatioRef.current > 2; // Ultrawide or very wide screens
    const isLowAspectRatio = aspectRatioRef.current < 0.8; // Very tall screens
    
    // Adjust particle count based on screen area and aspect ratio
    const screenArea = rect.width * rect.height;
    const baseParticleCount = isMobileRef.current ? 120 : 150; // Increased mobile and desktop particle count
    const areaMultiplier = Math.sqrt(screenArea / (1920 * 1080)); // Normalize to 1920x1080
    const aspectRatioMultiplier = isHighAspectRatio ? 1.5 : isLowAspectRatio ? 0.8 : 1;
    const particleAmount = Math.round(baseParticleCount * areaMultiplier * aspectRatioMultiplier);

    // Adjust link radius based on screen dimensions
    const baseLinkRadius = isMobileRef.current ? 160 : 250;
    const linkRadiusMultiplier = isHighAspectRatio ? 1.3 : isLowAspectRatio ? 0.9 : 1;
    const linkRadius = baseLinkRadius * linkRadiusMultiplier;

    const config = {
      particleColor: 'rgba(30, 136, 229, 0.7)',
      lineColor: theme === 'dark' 
        ? (isMobileRef.current ? `rgba(255, 255, 255, 0.3)` : `rgba(255, 255, 255, 0.2)`)
        : (isMobileRef.current ? `rgba(30, 136, 229, 0.3)` : `rgba(30, 136, 229, 0.2)`),
      particleAmount: particleAmount,
      defaultRadius: isMobileRef.current ? 3 : 4,
      variantRadius: isMobileRef.current ? 2 : 4,
      defaultSpeed: 0.05,
      variantSpeed: 0.05,
      linkRadius: linkRadius,
      lineWidth: isMobileRef.current ? 1.2 : 2,
    };

    let particles = [];
    const needsReset = canvas.particles === undefined || 
                      canvas.mobileState !== isMobileRef.current || 
                      canvas.aspectRatio !== aspectRatioRef.current ||
                      canvas.particleAmount !== particleAmount;

    if (needsReset) {
      // Reset particles when any relevant state changes
      canvas.mobileState = isMobileRef.current;
      canvas.aspectRatio = aspectRatioRef.current;
      canvas.particleAmount = particleAmount;
      canvas.particles = undefined;
      
      // Distribute particles more evenly on high aspect ratio screens
      for (let i = 0; i < config.particleAmount; i++) {
        let x, y;
        
        if (isHighAspectRatio) {
          // For wide screens, distribute particles more evenly across the width
          x = (i / config.particleAmount) * canvas.width + (Math.random() - 0.5) * (canvas.width / config.particleAmount);
          y = Math.random() * canvas.height;
        } else if (isLowAspectRatio) {
          // For tall screens, distribute particles more evenly across the height
          x = Math.random() * canvas.width;
          y = (i / config.particleAmount) * canvas.height + (Math.random() - 0.5) * (canvas.height / config.particleAmount);
        } else {
          // Normal distribution for standard aspect ratios
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
        }
        
        particles.push({
          x: Math.max(0, Math.min(canvas.width, x)),
          y: Math.max(0, Math.min(canvas.height, y)),
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
      ctx.arc(p.x, p.y, config.defaultRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    for(let i = 0; i < particles.length; i++) {
      let connectionCount = 0;
      const maxConnections = isHighAspectRatio ? 6 : isLowAspectRatio ? 8 : 7; // Limit connections per node
      
      for(let j = i + 1; j < particles.length; j++) {
        let p1 = particles[i];
        let p2 = particles[j];
        let distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

        if(distance < config.linkRadius && connectionCount < maxConnections) {
          ctx.beginPath();
          ctx.strokeStyle = config.lineColor;
          ctx.lineWidth = config.lineWidth;
          ctx.globalAlpha = (config.linkRadius - distance) / config.linkRadius;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          connectionCount++;
        }
      }
    }
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId;
    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      frameCount++;
      drawRef.current(context, frameCount, theme);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
        // Reset particles on resize to redistribute them
        canvas.particles = undefined; 
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      isRunning = false;
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <motion.div
      ref={containerRef}
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
