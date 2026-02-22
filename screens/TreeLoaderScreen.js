import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import Svg, { Path, Ellipse, G } from "react-native-svg";
import { theme } from "./ThemeColors";

const TREE_DURATION_MS = 3000;
const SUCCESS_SHOW_MS = 2000;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TREE_SIZE = Math.min(180, SCREEN_WIDTH - 48);

export default function TreeLoaderScreen({ navigation }) {
  const [phase, setPhase] = useState("growing");
  const scaleY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    scaleY.value = withTiming(1, {
      duration: TREE_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, { duration: TREE_DURATION_MS * 0.3 });
    pulseOpacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    const t = setTimeout(() => setPhase("success"), TREE_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "success") return;
    const t = setTimeout(() => {
      navigation.replace("MainTabs");
    }, SUCCESS_SHOW_MS);
    return () => clearTimeout(t);
  }, [phase, navigation]);

  const treeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
    opacity: opacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (phase === "growing") {
    return (
      <View style={styles.container}>
        <Animated.Text style={[styles.synthesizingText, pulseStyle]}>
          Synthesizing your purpose...
        </Animated.Text>
        <View style={styles.treeBottomAnchor}>
          <Animated.View style={[styles.treeWrap, treeAnimatedStyle]}>
            <TreeSVG size={TREE_SIZE} />
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.checkWrap}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
      <Text style={styles.readyTitle}>You are ready.</Text>
      <Text style={styles.readySubtitle}>
        Your vocation is taking root. Let's find where your gifts meet the
        world's needs.
      </Text>
    </View>
  );
}

function TreeSVG({ size }) {
  const trunkColor = theme.textLight;
  const foliageColor = theme.primary;
  const foliageLight = theme.secondary;
  const groundColor = "#86EFAC";

  return (
    <Svg
      width={size}
      height={size * (220 / 180)}
      viewBox="0 0 180 220"
      fill="none"
      style={{ transformOrigin: "center bottom" }}
    >
      <Ellipse cx={90} cy={208} rx={24} ry={8} fill={groundColor} />
      <Path
        d="M 90 208 L 90 120"
        stroke={trunkColor}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <Path
        d="M 90 150 Q 50 140 35 100"
        stroke={trunkColor}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 90 145 Q 130 135 145 95"
        stroke={trunkColor}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
      />
      <G>
        <Ellipse cx={28} cy={92} rx={22} ry={28} fill={foliageColor} />
        <Ellipse cx={42} cy={88} rx={18} ry={22} fill={foliageLight} />
        <Ellipse cx={32} cy={105} rx={16} ry={20} fill={foliageColor} />
      </G>
      <G>
        <Ellipse cx={152} cy={90} rx={22} ry={28} fill={foliageColor} />
        <Ellipse cx={138} cy={86} rx={18} ry={22} fill={foliageLight} />
        <Ellipse cx={148} cy={102} rx={16} ry={20} fill={foliageColor} />
      </G>
      <G>
        <Ellipse cx={90} cy={85} rx={28} ry={32} fill={theme.textDark} />
        <Ellipse cx={82} cy={92} rx={20} ry={24} fill={foliageColor} />
        <Ellipse cx={98} cy={90} rx={18} ry={22} fill={theme.textLight} />
      </G>
    </Svg>
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
  synthesizingText: {
    fontSize: 14,
    color: theme.textLight,
    marginBottom: 24,
  },
  treeBottomAnchor: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  treeWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  checkWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  checkMark: {
    fontSize: 36,
    color: theme.primary,
  },
  readyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.textDark,
    textAlign: "center",
    marginBottom: 8,
  },
  readySubtitle: {
    fontSize: 16,
    color: theme.textLight,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
});
