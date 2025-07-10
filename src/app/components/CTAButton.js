"use client";
import { motion } from "framer-motion";

export default function CTAButton({ 
  children, 
  variant = "outline", // "outline", "filled", "text"
  size = "md", // "sm", "md", "lg"
  className = "",
  onClick,
  ...props 
}) {
  const baseClasses = "group relative overflow-hidden rounded-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 font-brand-semibold";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };
  
  const variantClasses = {
    outline: "bg-white backdrop-blur-sm text-[#1e88e5] hover:shadow-lg",
    filled: "bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] text-white hover:shadow-lg",
    text: "text-[#1e88e5]"
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
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
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
  ...props 
}) {
  const baseClasses = "group relative overflow-hidden rounded-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 font-brand-semibold";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };
  
  const variantClasses = {
    outline: "bg-white backdrop-blur-sm text-[#1e88e5] hover:shadow-lg",
    filled: "bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] text-white hover:shadow-lg",
    text: "text-[#1e88e5]"
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
  };

  const buttonStyle = variant === "filled" ? {
    boxShadow: "0 4px 15px rgba(30, 136, 229, 0.2)",
  } : {};

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={buttonStyle}
      variants={variants}
      whileHover={whileHover}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {/* Shimmer effect for filled and outline buttons */}
      {(variant === "filled" || variant === "outline") && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
} 