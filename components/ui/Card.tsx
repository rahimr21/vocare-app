import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  variant?: "light" | "dark" | "parchment";
}

const variantStyles = {
  light: "bg-white",
  dark: "bg-gray-800",
  parchment: "bg-parchment",
};

export default function Card({
  variant = "light",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <View
      className={`rounded-2xl p-4 ${variantStyles[variant]} ${className}`}
      style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
      {...props}
    >
      {children}
    </View>
  );
}
