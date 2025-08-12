import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  to?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const UserButton: React.FC<ButtonProps> = ({ 
  loading, 
  children, 
  className = "",
  onClick,
  to,
  type = "button",
  disabled = false
}) => {
  const baseStyles = "bg-gradient-to-r from-[#1E3A8A] to-[#60A5FA] text-white py-2.5 rounded-lg font-bold shadow-lg hover:from-[#60A5FA] hover:to-[#1E3A8A] hover:text-[#1E3A8A] hover:bg-white transition disabled:opacity-60";
  const combinedClassName = `${baseStyles} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={combinedClassName}
      onClick={onClick}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
