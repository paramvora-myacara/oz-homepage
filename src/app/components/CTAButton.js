"use client";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function CTAButton({ 
  children, 
  variant = "outline", // "outline", "filled", "text"
  size = "md", // "sm", "md", "lg"
  className = "",
  onClick,
  tooltip = "",
  ...props 
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  // Cleanup tooltip on component unmount or navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      setShowTooltip(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowTooltip(false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      setShowTooltip(false);
    };
  }, []);

  const handleClick = (e) => {
    // Immediately hide tooltip when button is clicked
    setShowTooltip(false);
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  const baseClasses = "group relative overflow-hidden rounded-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 font-brand-semibold";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };
  
  const variantClasses = {
    outline: "bg-white backdrop-blur-sm text-[#1e88e5] hover:shadow-lg",
    filled: "bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] text-white hover:shadow-lg",
    text: "text-[#1e88e5] border-2 border-transparent hover:border-[#1e88e5]"
  };
  
  const handleMouseEnter = (e) => {
    if (variant === "outline") {
      e.currentTarget.style.background = "#1e88e5";
      e.currentTarget.style.color = "white";
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(30, 136, 229, 0.3)";
    } else if (variant === "filled") {
      e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 30px rgba(30, 136, 229, 0.4)";
    } else if (variant === "text") {
      e.currentTarget.style.backgroundColor = "rgba(30, 136, 229, 0.1)";
    }
    if (tooltip) setShowTooltip(true);
  };
  
  const handleMouseLeave = (e) => {
    if (variant === "outline") {
      e.currentTarget.style.background = "white";
      e.currentTarget.style.color = "#1e88e5";
      e.currentTarget.style.boxShadow = "none";
    } else if (variant === "filled") {
      e.currentTarget.style.transform = "scale(1) translateY(0px)";
      e.currentTarget.style.boxShadow = "0 4px 15px rgba(30, 136, 229, 0.2)";
    } else if (variant === "text") {
      e.currentTarget.style.backgroundColor = "transparent";
    }
    if (tooltip) setShowTooltip(false);
  };

  const handleMouseMove = (e) => {
    if (!tooltip || !showTooltip) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate tooltip position - positioned lower relative to mouse
    let x = mouseX + 10; // 10px offset from cursor
    let y = mouseY + 25; // 25px below cursor for lower positioning
    
    // Get tooltip dimensions if available
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;
      
      // Center tooltip horizontally with respect to cursor
      x = mouseX - (tooltipWidth / 2);
      
      // Prevent tooltip from going off-screen horizontally
      if (x + tooltipWidth > window.innerWidth) {
        x = mouseX - tooltipWidth - 10;
      }
      
      // Prevent tooltip from going off-screen vertically
      if (y + tooltipHeight > window.innerHeight) {
        y = mouseY - tooltipHeight - 10;
      }
      
      // Ensure tooltip doesn't go off the left edge
      if (x < 0) {
        x = 10;
      }
      
      // Ensure tooltip doesn't go off the top edge
      if (y < 0) {
        y = 10;
      }
    }
    
    setTooltipPosition({ x, y });
  };

  const buttonStyle = variant === "filled" ? {
    boxShadow: "0 4px 15px rgba(30, 136, 229, 0.2)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  } : variant === "outline" ? {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  } : {};

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        {...props}
      >
        {/* Shimmer effect for filled buttons */}
        {variant === "filled" && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
        )}
        
        {/* Shimmer effect for outline buttons */}
        {variant === "outline" && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
        )}
        
        <span className="relative z-10">{children}</span>
      </button>
      
      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div 
          ref={tooltipRef}
          className="fixed px-4 py-3 text-white text-sm rounded-lg shadow-xl border border-gray-700 max-w-xs"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'none',
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999
          }}
        >
          <div className="whitespace-normal leading-relaxed">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
}

// Motion wrapper for footer usage
export function MotionCTAButton({ 
  children, 
  variant = "outline", 
  size = "md", 
  className = "",
  variants,
  whileHover = { y: -2 },
  onClick,
  tooltip = "",
  ...props 
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup tooltip on component unmount or navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      setShowTooltip(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowTooltip(false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      setShowTooltip(false);
    };
  }, []);

  const handleClick = (e) => {
    // Immediately hide tooltip when button is clicked
    setShowTooltip(false);
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  const baseClasses = "group relative overflow-hidden rounded-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 font-brand-semibold";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };
  
  const variantClasses = {
    outline: "bg-white backdrop-blur-sm text-[#1e88e5] hover:shadow-lg",
    filled: "bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] text-white hover:shadow-lg",
    text: "text-[#1e88e5] border-2 border-transparent hover:border-[#1e88e5]"
  };
  
  const handleMouseEnter = (e) => {
    if (variant === "outline") {
      e.currentTarget.style.background = "#1e88e5";
      e.currentTarget.style.color = "white";
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(30, 136, 229, 0.3)";
    } else if (variant === "filled") {
      e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 30px rgba(30, 136, 229, 0.4)";
    } else if (variant === "text") {
      e.currentTarget.style.backgroundColor = "rgba(30, 136, 229, 0.1)";
    }
    if (tooltip) setShowTooltip(true);
  };
  
  const handleMouseLeave = (e) => {
    if (variant === "outline") {
      e.currentTarget.style.background = "white";
      e.currentTarget.style.color = "#1e88e5";
      e.currentTarget.style.boxShadow = "none";
    } else if (variant === "filled") {
      e.currentTarget.style.transform = "scale(1) translateY(0px)";
      e.currentTarget.style.boxShadow = "0 4px 15px rgba(30, 136, 229, 0.2)";
    } else if (variant === "text") {
      e.currentTarget.style.backgroundColor = "transparent";
    }
    if (tooltip) setShowTooltip(false);
  };

  const handleMouseMove = (e) => {
    if (!tooltip || !showTooltip || !buttonRef.current) return;
    
    // Get the button's position in the viewport
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate tooltip position relative to viewport
    let x = mouseX;
    let y = mouseY + 25; // 25px below cursor (lowered from 15px)
    
    // Get tooltip dimensions if available
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;
      
      // Center tooltip horizontally with respect to cursor
      x = mouseX - (tooltipWidth / 2);
      
      // Prevent tooltip from going off-screen
      if (x + tooltipWidth > window.innerWidth - 10) {
        x = window.innerWidth - tooltipWidth - 10;
      }
      if (y + tooltipHeight > window.innerHeight - 10) {
        y = mouseY - tooltipHeight - 10;
      }
      if (x < 10) x = 10;
      if (y < 10) y = 10;
    }
    
    setTooltipPosition({ x, y });
  };

  const buttonStyle = variant === "filled" ? {
    boxShadow: "0 4px 15px rgba(30, 136, 229, 0.2)",
  } : {};

  const tooltipElement = tooltip && showTooltip && mounted ? (
    <div 
      ref={tooltipRef}
      className="fixed px-4 py-3 text-white text-sm rounded-lg shadow-xl border border-gray-700 max-w-xs pointer-events-none"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: 'none',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999
      }}
    >
      <div className="whitespace-normal leading-relaxed">
        {tooltip}
      </div>
    </div>
  ) : null;

  return (
    <>
      <motion.button
        ref={buttonRef}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        style={buttonStyle}
        variants={variants}
        whileHover={{ y: -2 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        {...props}
      >
        {/* Shimmer effect for filled and outline buttons */}
        {(variant === "filled" || variant === "outline") && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
        )}
        
        <span className="relative z-10">{children}</span>
      </motion.button>
      
      {/* Portal tooltip to document.body */}
      {mounted && typeof document !== 'undefined' && tooltipElement && 
        createPortal(tooltipElement, document.body)
      }
    </>
  );
} 