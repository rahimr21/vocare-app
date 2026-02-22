import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";

interface CardProps extends ViewProps {
  variant?: "light" | "dark" | "parchment";
}

const variantStyles = {
  light: "bg-white",
  dark: "bg-gray-800",
  parchment: "bg-parchment",
};

const primaryFadeBorder = `rgba(74, 107, 90, 0.28)`;

export default function Card({
  variant = "light",
  className = "",
  style,
  children,
  ...props
}: CardProps) {
  return (
    <View
      className={`rounded-2xl p-4 ${variantStyles[variant]} ${className}`}
      style={[styles.card, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: primaryFadeBorder,
  },
});
