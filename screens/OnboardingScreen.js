import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { theme } from "./ThemeColors";

const QUESTIONS = [
  {
    id: "gladness",
    title: "What activities make you lose track of time?",
    options: ["Building", "Listening", "Organizing", "Creating"],
  },
  {
    id: "hunger",
    title: "What problem in the world breaks your heart?",
    options: ["Loneliness", "Inefficiency", "Injustice"],
  },
  {
    id: "resistance",
    title: "What stops you?",
    options: ["Fear", "A bit of both", "Exhaustion"],
  },
];

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const selectOption = (option) => {
    const key = q.id;
    setAnswers((prev) => ({ ...prev, [key]: option }));
  };

  const goNext = () => {
    if (isLast) {
      navigation.replace("TreeLoader");
      return;
    }
    setStep((s) => s + 1);
  };

  const selected = answers[q?.id];

  return (
    <View style={styles.container}>
      <Animated.View
        key={step}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)}
        style={styles.content}
      >
        <Text style={styles.title}>{q?.title}</Text>
        <View style={styles.options}>
          {q?.options.map((opt) => {
            const isSelected = selected === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                onPress={() => selectOption(opt)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueButtonDisabled]}
          onPress={goNext}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {isLast ? "Finish" : "Continue"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {},
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.textDark,
    textAlign: "center",
    marginBottom: 32,
  },
  options: {
    marginBottom: 32,
  },
  optionButton: {
    backgroundColor: theme.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: theme.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.textDark,
  },
  optionTextSelected: {
    color: theme.cardBg,
  },
  continueButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: theme.secondary,
    opacity: 0.7,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.cardBg,
  },
});
