import React, { type ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  type = "button",
  fullWidth,
  children,
  className,
  ...props
}) => (
  <button
    type={type}
    className={[
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </button>
);

export default Button;
