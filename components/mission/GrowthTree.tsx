import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import { Mission } from "@/types";

interface GrowthTreeProps {
  missions: Mission[];
  onLeafPress?: (mission: Mission) => void;
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

const TRUNK_COLOR = "#3d2b1f";
const BRANCH_COLOR = "#4a3728";
const VIBRANT_LEAF = "#4CAF50";
const VIBRANT_LEAF_ALT = "#66BB6A";
const VIBRANT_LEAF_ALT2 = "#81C784";
const FADED_LEAF = "#B8956A";
const FADED_LEAF_ALT = "#C8A96E";

export default function GrowthTree({
  missions,
  onLeafPress,
}: GrowthTreeProps) {
  const leaves = missions.slice(0, LEAF_SLOTS.length).map((mission, i) => {
    const slot = LEAF_SLOTS[i];
    const isVibrant = mission.feltAlive === true;
    const color =
      isVibrant
        ? [VIBRANT_LEAF, VIBRANT_LEAF_ALT, VIBRANT_LEAF_ALT2][i % 3]
        : [FADED_LEAF, FADED_LEAF_ALT][i % 2];
    return {
      mission,
      ...slot,
      color,
    };
  });

  return (
    <View
      className="items-center justify-center"
      style={{ width: MAP_SIZE, height: MAP_SIZE }}
    >
      <Svg width={MAP_SIZE} height={MAP_SIZE} viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}>
        {/* Trunk - thick vertical path from bottom center */}
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.95} Q ${CENTER_X - 3} ${MAP_SIZE * 0.6} ${CENTER_X} ${MAP_SIZE * 0.35}`}
          stroke={TRUNK_COLOR}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
        />

        {/* Main branches - curved paths spreading from trunk */}
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.42} Q ${CENTER_X + 50} ${MAP_SIZE * 0.3} ${CENTER_X + 75} ${MAP_SIZE * 0.5}`}
          stroke={BRANCH_COLOR}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.38} Q ${CENTER_X - 55} ${MAP_SIZE * 0.28} ${CENTER_X - 80} ${MAP_SIZE * 0.45}`}
          stroke={BRANCH_COLOR}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X + 8} ${MAP_SIZE * 0.36} Q ${CENTER_X + 35} ${MAP_SIZE * 0.25} ${CENTER_X + 45} ${MAP_SIZE * 0.28}`}
          stroke={BRANCH_COLOR}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X - 6} ${MAP_SIZE * 0.34} Q ${CENTER_X - 45} ${MAP_SIZE * 0.26} ${CENTER_X - 55} ${MAP_SIZE * 0.32}`}
          stroke={BRANCH_COLOR}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.5} Q ${CENTER_X + 40} ${MAP_SIZE * 0.45} ${CENTER_X + 55} ${MAP_SIZE * 0.52}`}
          stroke={BRANCH_COLOR}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.52} Q ${CENTER_X - 42} ${MAP_SIZE * 0.48} ${CENTER_X - 58} ${MAP_SIZE * 0.55}`}
          stroke={BRANCH_COLOR}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.58} Q ${CENTER_X + 25} ${MAP_SIZE * 0.55} ${CENTER_X + 35} ${MAP_SIZE * 0.62}`}
          stroke={BRANCH_COLOR}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${CENTER_X} ${MAP_SIZE * 0.6} Q ${CENTER_X - 28} ${MAP_SIZE * 0.56} ${CENTER_X - 38} ${MAP_SIZE * 0.64}`}
          stroke={BRANCH_COLOR}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />

        {/* Leaves */}
        {leaves.map((leaf) => (
          <G
            key={leaf.mission.id}
            transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rotation})`}
          >
            <Path
              d={LEAF_PATH}
              fill={leaf.color}
              stroke={BRANCH_COLOR}
              strokeWidth={0.8}
              opacity={leaf.mission.feltAlive === true ? 1 : 0.85}
            />
          </G>
        ))}
      </Svg>

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
          }}
        />
      ))}

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
