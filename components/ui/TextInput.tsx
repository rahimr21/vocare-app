import React from "react";
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface TextInputProps extends RNTextInputProps {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  label?: string;
  error?: string;
}

export default function TextInput({
  icon,
  label,
  error,
  ...props
}: TextInputProps) {
  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-work-sans-medium text-gray-600 mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-stone-100 rounded-xl px-4 py-3 ${
          error ? "border border-red-400" : ""
        }`}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color="#9CA3AF"
            style={{ marginRight: 10 }}
          />
        )}
        <RNTextInput
          className="flex-1 text-base font-work-sans text-gray-900"
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </View>
      {error && (
        <Text className="text-xs text-red-500 mt-1 font-work-sans">
          {error}
        </Text>
      )}
    </View>
  );
}
