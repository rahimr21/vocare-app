import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "gold" | "danger" | "outline";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-primary",
  secondary: "bg-gray-200",
  gold: "bg-gold",
  danger: "bg-red-500",
  outline: "bg-transparent border-2 border-primary",
};

const variantTextStyles = {
  primary: "text-white",
  secondary: "text-gray-800",
  gold: "text-white",
  danger: "text-white",
  outline: "text-primary",
};

const sizeStyles = {
  sm: "py-2 px-4",
  md: "py-3.5 px-6",
  lg: "py-4 px-8",
};

const sizeTextStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export default function Button({
  title,
  variant = "primary",
  loading = false,
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`rounded-xl items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || loading ? "opacity-50" : ""
      }`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? "#374151" : "#FFFFFF"}
        />
      ) : (
        <Text
          className={`font-work-sans-semibold ${variantTextStyles[variant]} ${sizeTextStyles[size]} tracking-wide`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
