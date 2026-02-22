import React, { useEffect } from "react";
import { View, Text, Pressable, Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  type SharedValue,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { Mission } from "@/types";

interface GrowthTreeProps {
  missions: Mission[];
  onLeafPress?: (mission: Mission) => void;
  focusedMissionId?: string | null;
  onCloseFocus?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MAP_SIZE = SCREEN_WIDTH - 48;
const CENTER_X = MAP_SIZE / 2;

// Pre-defined leaf attachment points along branches (organic tree layout)
const LEAF_SLOTS: { x: number; y: number; rotation: number }[] = [
  { x: CENTER_X + 45, y: MAP_SIZE * 0.28, rotation: -35 },
  { x: CENTER_X + 35, y: MAP_SIZE * 0.32, rotation: 20 },
  { x: CENTER_X + 55, y: MAP_SIZE * 0.35, rotation: -50 },
  { x: CENTER_X - 50, y: MAP_SIZE * 0.3, rotation: 40 },
  { x: CENTER_X - 40, y: MAP_SIZE * 0.34, rotation: -25 },
  { x: CENTER_X - 55, y: MAP_SIZE * 0.38, rotation: 55 },
  { x: CENTER_X + 30, y: MAP_SIZE * 0.4, rotation: -15 },
  { x: CENTER_X - 35, y: MAP_SIZE * 0.42, rotation: 30 },
  { x: CENTER_X + 65, y: MAP_SIZE * 0.44, rotation: -60 },
  { x: CENTER_X - 60, y: MAP_SIZE * 0.46, rotation: 45 },
  { x: CENTER_X + 20, y: MAP_SIZE * 0.48, rotation: 10 },
  { x: CENTER_X - 25, y: MAP_SIZE * 0.5, rotation: -35 },
  { x: CENTER_X + 50, y: MAP_SIZE * 0.52, rotation: -45 },
  { x: CENTER_X - 45, y: MAP_SIZE * 0.54, rotation: 50 },
  { x: CENTER_X + 5, y: MAP_SIZE * 0.42, rotation: -10 },
  { x: CENTER_X - 10, y: MAP_SIZE * 0.38, rotation: 15 },
  { x: CENTER_X + 70, y: MAP_SIZE * 0.5, rotation: -55 },
  { x: CENTER_X - 65, y: MAP_SIZE * 0.52, rotation: 60 },
  { x: CENTER_X + 40, y: MAP_SIZE * 0.56, rotation: -30 },
  { x: CENTER_X - 38, y: MAP_SIZE * 0.58, rotation: 35 },
  { x: CENTER_X + 15, y: MAP_SIZE * 0.54, rotation: 5 },
  { x: CENTER_X - 18, y: MAP_SIZE * 0.56, rotation: -20 },
  { x: CENTER_X + 60, y: MAP_SIZE * 0.6, rotation: -50 },
  { x: CENTER_X - 55, y: MAP_SIZE * 0.62, rotation: 48 },
  { x: CENTER_X + 28, y: MAP_SIZE * 0.64, rotation: -25 },
  { x: CENTER_X - 30, y: MAP_SIZE * 0.66, rotation: 28 },
  { x: CENTER_X + 8, y: MAP_SIZE * 0.6, rotation: 0 },
  { x: CENTER_X - 12, y: MAP_SIZE * 0.64, rotation: -15 },
  { x: CENTER_X + 48, y: MAP_SIZE * 0.68, rotation: -40 },
  { x: CENTER_X - 42, y: MAP_SIZE * 0.7, rotation: 42 },
];

// Pointed-oval leaf shape (vertical, tip up)
const LEAF_PATH =
  "M0,-10 C3,-8 5,-3 5,0 C5,3 3,7 0,10 C-3,7 -5,3 -5,0 C-5,-3 -3,-8 0,-10 Z";

const LEAF_SIZE = 24;
const GLOW_SIZE = 44;
const SWAY_DURATION = 4000; // full cycle 0 -> 1 -> 0
const SWAY_DEG = 3;
const FLOAT_PX = 2;
const GLOW_COLOR = "rgba(76, 175, 80, 0.7)";
const GLOW_COLOR_FADED = "rgba(184, 149, 106, 0.7)";

const TRUNK_COLOR = "#3d2b1f";
const TRUNK_BARK = "#35281c";
const BRANCH_COLOR = "#4a3728";
const BRANCH_TIP = "#3d2b1f";
const VIBRANT_LEAF = "#4CAF50";
const VIBRANT_LEAF_ALT = "#66BB6A";
const VIBRANT_LEAF_ALT2 = "#81C784";
const VIBRANT_LEAF_ALT3 = "#43A047";
const FADED_LEAF = "#B8956A";
const FADED_LEAF_ALT = "#C8A96E";
const FADED_LEAF_ALT2 = "#A68B5E";

type LeafData = {
  mission: Mission;
  x: number;
  y: number;
  rotation: number;
  color: string;
  sizeScale: number;
};

function AnimatedLeaf({
  leaf,
  index,
  progress,
}: {
  leaf: LeafData;
  index: number;
  progress: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const phase = (progress.value + index * 0.08) % 1;
    const swayDeg = interpolate(phase, [0, 0.5, 1], [-SWAY_DEG, SWAY_DEG, -SWAY_DEG]);
    const floatY = interpolate(phase, [0, 0.5, 1], [0, FLOAT_PX, 0]);
    return {
      transform: [
        { rotate: `${leaf.rotation + swayDeg}deg` },
        { translateY: floatY },
      ],
      opacity: leaf.mission.feltAlive === true ? 1 : 0.85,
    };
  });

  const size = LEAF_SIZE * leaf.sizeScale;
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: leaf.x - size / 2,
          top: leaf.y - size / 2,
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox="-6 -12 12 24">
        <Path
          d={LEAF_PATH}
          fill={leaf.color}
          stroke={BRANCH_COLOR}
          strokeWidth={0.8}
        />
      </Svg>
    </Animated.View>
  );
}

function FocusedLeafWithGlow({
  leaf,
  onClose,
}: {
  leaf: LeafData;
  onClose: () => void;
}) {
  const glowColor = leaf.mission.feltAlive === true ? GLOW_COLOR : GLOW_COLOR_FADED;
  const leafSize = LEAF_SIZE * leaf.sizeScale;
  return (
    <Pressable
      onPress={onClose}
      style={[
        {
          position: "absolute",
          left: leaf.x - GLOW_SIZE / 2,
          top: leaf.y - GLOW_SIZE / 2,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <View style={StyleSheet.absoluteFillObject}>
        <Svg width={GLOW_SIZE} height={GLOW_SIZE} viewBox="-6 -12 12 24">
          <Path d={LEAF_PATH} fill={glowColor} />
        </Svg>
      </View>
      <Svg width={leafSize} height={leafSize} viewBox="-6 -12 12 24">
        <Path
          d={LEAF_PATH}
          fill={leaf.color}
          stroke={BRANCH_COLOR}
          strokeWidth={0.8}
        />
      </Svg>
    </Pressable>
  );
}

export default function GrowthTree({
  missions,
  onLeafPress,
  focusedMissionId,
  onCloseFocus,
}: GrowthTreeProps) {
  const swayProgress = useSharedValue(0);
  const isFocused = !!focusedMissionId;

  useEffect(() => {
    swayProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: SWAY_DURATION / 2 }),
        withTiming(0, { duration: SWAY_DURATION / 2 })
      ),
      -1
    );
  }, [swayProgress]);

  const leaves = missions.slice(0, LEAF_SLOTS.length).map((mission, i) => {
    const slot = LEAF_SLOTS[i];
    const isVibrant = mission.feltAlive === true;
    const color =
      isVibrant
        ? [VIBRANT_LEAF, VIBRANT_LEAF_ALT, VIBRANT_LEAF_ALT2, VIBRANT_LEAF_ALT3][i % 4]
        : [FADED_LEAF, FADED_LEAF_ALT, FADED_LEAF_ALT2][i % 3];
    const sizeScale = 0.92 + (i % 5) * 0.04;
    return {
      mission,
      ...slot,
      color,
      sizeScale,
    };
  });

  const focusedLeaf = isFocused ? leaves.find((l) => l.mission.id === focusedMissionId) : null;

  return (
    <View
      className="items-center justify-center"
      style={{ width: MAP_SIZE, height: MAP_SIZE }}
    >
      <Svg width={MAP_SIZE} height={MAP_SIZE} viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}>
        {/* Bark texture - second trunk path slightly offset for depth */}
        <Path
          d={`M ${CENTER_X + 2} ${MAP_SIZE * 0.95} Q ${CENTER_X + 1} ${MAP_SIZE * 0.7} ${CENTER_X + 2} ${MAP_SIZE * 0.4}`}
          stroke={TRUNK_BARK}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          opacity={0.85}
        />
        {/* Trunk - tapered feel with slight irregular curve */}
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.95} Q ${CENTER_X - 4} ${MAP_SIZE * 0.72} ${CENTER_X - 1} ${MAP_SIZE * 0.5} Q ${CENTER_X + 2} ${MAP_SIZE * 0.38} ${CENTER_X} ${MAP_SIZE * 0.35}`}
          stroke={TRUNK_COLOR}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
        />

        {/* Main branches - curved paths, thicker near trunk */}
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.42} Q ${CENTER_X + 48} ${MAP_SIZE * 0.3} ${CENTER_X + 74} ${MAP_SIZE * 0.5}`}
          stroke={BRANCH_COLOR}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.38} Q ${CENTER_X - 54} ${MAP_SIZE * 0.28} ${CENTER_X - 78} ${MAP_SIZE * 0.46}`}
          stroke={BRANCH_COLOR}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X + 8} ${MAP_SIZE * 0.36} Q ${CENTER_X + 34} ${MAP_SIZE * 0.26} ${CENTER_X + 44} ${MAP_SIZE * 0.28}`}
          stroke={BRANCH_COLOR}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X - 5} ${MAP_SIZE * 0.34} Q ${CENTER_X - 44} ${MAP_SIZE * 0.26} ${CENTER_X - 54} ${MAP_SIZE * 0.32}`}
          stroke={BRANCH_COLOR}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.5} Q ${CENTER_X + 42} ${MAP_SIZE * 0.46} ${CENTER_X + 56} ${MAP_SIZE * 0.52}`}
          stroke={BRANCH_COLOR}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.52} Q ${CENTER_X - 40} ${MAP_SIZE * 0.48} ${CENTER_X - 56} ${MAP_SIZE * 0.55}`}
          stroke={BRANCH_COLOR}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.58} Q ${CENTER_X + 26} ${MAP_SIZE * 0.55} ${CENTER_X + 36} ${MAP_SIZE * 0.62}`}
          stroke={BRANCH_COLOR}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.6} Q ${CENTER_X - 26} ${MAP_SIZE * 0.56} ${CENTER_X - 36} ${MAP_SIZE * 0.64}`}
          stroke={BRANCH_COLOR}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        {/* Smaller twigs for more organic look */}
        <Path
          d={`M ${CENTER_X + 42} ${MAP_SIZE * 0.3} Q ${CENTER_X + 58} ${MAP_SIZE * 0.28} ${CENTER_X + 62} ${MAP_SIZE * 0.32}`}
          stroke={BRANCH_TIP}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X - 52} ${MAP_SIZE * 0.32} Q ${CENTER_X - 68} ${MAP_SIZE * 0.3} ${CENTER_X - 72} ${MAP_SIZE * 0.38}`}
          stroke={BRANCH_TIP}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X + 32} ${MAP_SIZE * 0.44} Q ${CENTER_X + 38} ${MAP_SIZE * 0.42} ${CENTER_X + 42} ${MAP_SIZE * 0.46}`}
          stroke={BRANCH_TIP}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      {/* Animated leaves */}
      {leaves.map((leaf, i) => (
        <AnimatedLeaf
          key={leaf.mission.id}
          leaf={leaf}
          index={i}
          progress={swayProgress}
        />
      ))}

      {/* Pressable leaf overlays */}
      {leaves.map((leaf) => (
        <Pressable
          key={`press-${leaf.mission.id}`}
          onPress={() => onLeafPress?.(leaf.mission)}
          style={{
            position: "absolute",
            left: leaf.x - 20,
            top: leaf.y - 20,
            width: 40,
            height: 40,
            zIndex: 10,
          }}
        />
      ))}

      {/* Glowing selected leaf only (no blur/dark) */}
      {isFocused && focusedLeaf && (
        <View style={{ position: "absolute", zIndex: 12, width: MAP_SIZE, height: MAP_SIZE, pointerEvents: "box-none" }}>
          <FocusedLeafWithGlow leaf={focusedLeaf} onClose={onCloseFocus ?? (() => {})} />
        </View>
      )}

      {/* Empty state */}
      {missions.length === 0 && (
        <View className="absolute items-center px-8" style={{ top: MAP_SIZE * 0.4 }}>
          <Text className="text-[#5a4a3a]/70 font-work-sans text-center">
            Complete missions to grow{"\n"}leaves on your tree
          </Text>
        </View>
      )}
    </View>
  );
}
