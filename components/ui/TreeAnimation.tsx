import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Svg, { Path, G } from "react-native-svg";
import { theme } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TREE_SIZE = Math.min(200, SCREEN_WIDTH - 64);

interface TreeAnimationProps {
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

export default function TreeAnimation({
  message = "Synthesizing your purpose...",
  duration = 3000,
  onComplete,
}: TreeAnimationProps) {
  const called = useRef(false);

  const groundOpacity = useSharedValue(0);
  const trunkOpacity = useSharedValue(0);
  const trunkScale = useSharedValue(0);
  const branchesOpacity = useSharedValue(0);
  const branchesScale = useSharedValue(0);
  const leavesBottomOpacity = useSharedValue(0);
  const leavesBottomScale = useSharedValue(0);
  const leavesTopOpacity = useSharedValue(0);
  const leavesTopScale = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.5);
  const containerOpacity = useSharedValue(0.97);

  useEffect(() => {
    // Subtle container fade-in
    containerOpacity.value = withTiming(1, { duration: 400 });

    // Phase 1 (0-0.6s): Ground base sweeps in
    groundOpacity.value = withTiming(1, { duration: 600 });

    // Phase 2 (0.3-1.7s): Trunk grows upward — smoother easing, longer duration
    const trunkEasing = Easing.bezier(0.25, 0.1, 0.25, 1);
    trunkOpacity.value = withDelay(300, withTiming(1, { duration: 350 }));
    trunkScale.value = withDelay(
      300,
      withTiming(1, { duration: 1500, easing: trunkEasing })
    );

    // Phase 3 (1.3-2.2s): Y-fork branches extend — softer spring
    branchesOpacity.value = withDelay(1300, withTiming(1, { duration: 350 }));
    branchesScale.value = withDelay(
      1300,
      withSpring(1, { damping: 12, stiffness: 60 })
    );

    // Phase 4 (1.9-2.8s): Lower leaves bloom — organic spring
    leavesBottomOpacity.value = withDelay(1900, withTiming(1, { duration: 350 }));
    leavesBottomScale.value = withDelay(
      1900,
      withSpring(1, { damping: 12, stiffness: 55 })
    );

    // Phase 5 (2.3-3.2s): Top leaves bloom
    leavesTopOpacity.value = withDelay(2300, withTiming(1, { duration: 350 }));
    leavesTopScale.value = withDelay(
      2300,
      withSpring(1, { damping: 12, stiffness: 55 })
    );

    // Pulsing text — slower, calmer
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.45, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    const t = setTimeout(() => {
      if (!called.current) {
        called.current = true;
        onComplete?.();
      }
    }, duration);
    return () => clearTimeout(t);
  }, []);

  const groundStyle = useAnimatedStyle(() => ({
    opacity: groundOpacity.value,
  }));

  const trunkStyle = useAnimatedStyle(() => ({
    opacity: trunkOpacity.value,
    transform: [{ scaleY: trunkScale.value }],
  }));

  const branchesStyle = useAnimatedStyle(() => ({
    opacity: branchesOpacity.value,
    transform: [{ scale: branchesScale.value }],
  }));

  const leavesBottomStyle = useAnimatedStyle(() => ({
    opacity: leavesBottomOpacity.value,
    transform: [{ scale: leavesBottomScale.value }],
  }));

  const leavesTopStyle = useAnimatedStyle(() => ({
    opacity: leavesTopOpacity.value,
    transform: [{ scale: leavesTopScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.messageText, pulseStyle]}>
        {message}
      </Animated.Text>

      <View style={styles.treeArea}>
        <Svg
          width={TREE_SIZE}
          height={TREE_SIZE * 1.15}
          viewBox="0 0 200 230"
          fill="none"
        >
          {/* Ground — two gentle curves spreading outward */}
          <Animated.View style={groundStyle}>
            <G>
              <Path
                d="M 100 195 Q 60 190 20 200 Q 60 195 100 192 Q 140 195 180 200 Q 140 190 100 195 Z"
                fill="#4ade80"
              />
              <Path
                d="M 100 198 Q 55 193 10 205"
                stroke={theme.textLight}
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d="M 100 198 Q 145 193 190 205"
                stroke={theme.textLight}
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              />
            </G>
          </Animated.View>

          {/* Trunk — single stem growing up, slight curve */}
          <Animated.View style={trunkStyle}>
            <G>
              <Path
                d="M 100 195 Q 99 160 98 125"
                stroke={theme.textLight}
                strokeWidth={10}
                strokeLinecap="round"
                fill="none"
              />
            </G>
          </Animated.View>

          {/* Y-fork branches */}
          <Animated.View style={branchesStyle}>
            <G>
              {/* Left main branch */}
              <Path
                d="M 98 125 Q 80 105 60 80"
                stroke={theme.textLight}
                strokeWidth={7}
                strokeLinecap="round"
                fill="none"
              />
              {/* Right main branch */}
              <Path
                d="M 98 125 Q 116 105 140 80"
                stroke={theme.textLight}
                strokeWidth={7}
                strokeLinecap="round"
                fill="none"
              />
              {/* Left sub-branch */}
              <Path
                d="M 75 98 Q 55 95 42 108"
                stroke={theme.textLight}
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
              {/* Right sub-branch */}
              <Path
                d="M 125 98 Q 145 95 158 108"
                stroke={theme.textLight}
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
            </G>
          </Animated.View>

          {/* Bottom / side leaves (teardrop shapes) */}
          <Animated.View style={leavesBottomStyle}>
            <G>
              {/* Left bottom leaf */}
              <Path
                d="M 42 108 Q 30 95 38 82 Q 46 90 42 108 Z"
                fill={theme.textLight}
              />
              {/* Left mid leaf */}
              <Path
                d="M 68 92 Q 54 82 60 66 Q 70 76 68 92 Z"
                fill={theme.textLight}
              />
              {/* Right bottom leaf */}
              <Path
                d="M 158 108 Q 170 95 162 82 Q 154 90 158 108 Z"
                fill={theme.textLight}
              />
              {/* Right mid leaf */}
              <Path
                d="M 132 92 Q 146 82 140 66 Q 130 76 132 92 Z"
                fill={theme.textLight}
              />
            </G>
          </Animated.View>

          {/* Top leaves (larger teardrops at branch tips) */}
          <Animated.View style={leavesTopStyle}>
            <G>
              {/* Left top leaf — large */}
              <Path
                d="M 60 80 Q 42 62 52 44 Q 62 58 60 80 Z"
                fill={theme.textLight}
              />
              {/* Left top leaf 2 */}
              <Path
                d="M 58 72 Q 70 55 64 38 Q 54 52 58 72 Z"
                fill={theme.textLight}
              />
              {/* Center-left leaf */}
              <Path
                d="M 80 68 Q 76 48 86 34 Q 88 52 80 68 Z"
                fill={theme.textLight}
              />
              {/* Center-right leaf */}
              <Path
                d="M 120 68 Q 124 48 114 34 Q 112 52 120 68 Z"
                fill={theme.textLight}
              />
              {/* Right top leaf — large */}
              <Path
                d="M 140 80 Q 158 62 148 44 Q 138 58 140 80 Z"
                fill={theme.textLight}
              />
              {/* Right top leaf 2 */}
              <Path
                d="M 142 72 Q 130 55 136 38 Q 146 52 142 72 Z"
                fill={theme.textLight}
              />
              {/* Very top leaf */}
              <Path
                d="M 100 60 Q 96 38 104 22 Q 108 40 100 60 Z"
                fill={theme.textLight}
              />
            </G>
          </Animated.View>
        </Svg>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  messageText: {
    fontSize: 16,
    color: theme.textLight,
    marginBottom: 40,
    fontWeight: "500",
    textAlign: "center",
  },
  treeArea: {
    alignItems: "center",
    justifyContent: "center",
  },
});
