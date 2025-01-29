import React from "react";
import { THEME } from "../../../Constant/theme.js";

const Button = ({
  children,
  variant = "default",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-colors duration-200";
  const variantStyles = {
    default: `bg-[${THEME.primary}] hover:bg-[${THEME.secondary}] text-white`,
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-gray-800",
  };

  const computedClassName = `${baseStyles} ${variantStyles[variant]} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  } ${className}`;

  return (
    <button className={computedClassName} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
