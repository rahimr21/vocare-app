import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { Mission, ConstellationStar } from "@/types";

interface ConstellationMapProps {
  missions: Mission[];
  onStarPress?: (mission: Mission) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MAP_SIZE = SCREEN_WIDTH - 48;
const CENTER_X = MAP_SIZE / 2;
const CENTER_Y = MAP_SIZE / 2;

// Golden angle spiral for organic star placement
function getStarPosition(
  index: number,
  total: number
): { x: number; y: number } {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees
  const angle = index * goldenAngle;
  const radius = Math.min(MAP_SIZE * 0.4, 30 + index * 18);
  return {
    x: CENTER_X + radius * Math.cos(angle),
    y: CENTER_Y + radius * Math.sin(angle),
  };
}

export default function ConstellationMap({
  missions,
  onStarPress,
}: ConstellationMapProps) {
  const stars: (ConstellationStar & { mission: Mission })[] = missions.map(
    (m, i) => {
      const pos = getStarPosition(i, missions.length);
      return {
        id: m.id,
        missionId: m.id,
        x: pos.x,
        y: pos.y,
        brightness: m.feltAlive === true ? 1.0 : m.feltAlive === false ? 0.4 : 0.6,
        label: m.title,
        mission: m,
      };
    }
  );

  return (
    <View
      className="items-center justify-center"
      style={{ width: MAP_SIZE, height: MAP_SIZE }}
    >
      <Svg width={MAP_SIZE} height={MAP_SIZE}>
        {/* Background stars (decoration) */}
        {Array.from({ length: 40 }).map((_, i) => (
          <Circle
            key={`bg-${i}`}
            cx={Math.random() * MAP_SIZE}
            cy={Math.random() * MAP_SIZE}
            r={Math.random() * 1.5 + 0.5}
            fill="rgba(255, 255, 255, 0.3)"
          />
        ))}

        {/* Connecting lines */}
        {stars.map((star, i) => {
          if (i === 0) return null;
          const prev = stars[i - 1];
          return (
            <Line
              key={`line-${i}`}
              x1={prev.x}
              y1={prev.y}
              x2={star.x}
              y2={star.y}
              stroke={`rgba(212, 175, 55, ${star.brightness * 0.4})`}
              strokeWidth={1}
            />
          );
        })}

        {/* Star nodes */}
        {stars.map((star) => (
          <Circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.brightness === 1.0 ? 8 : 6}
            fill={
              star.brightness === 1.0
                ? "#D4AF37"
                : star.brightness >= 0.6
                ? "rgba(212, 175, 55, 0.6)"
                : "rgba(148, 163, 184, 0.5)"
            }
          />
        ))}
      </Svg>

      {/* Pressable star overlays */}
      {stars.map((star) => (
        <Pressable
          key={`press-${star.id}`}
          onPress={() => onStarPress?.(star.mission)}
          style={{
            position: "absolute",
            left: star.x - 16,
            top: star.y - 16,
            width: 32,
            height: 32,
          }}
        />
      ))}

      {/* Empty state */}
      {missions.length === 0 && (
        <View className="absolute items-center">
          <Text className="text-white/50 font-work-sans text-center">
            Complete missions to build{"\n"}your constellation
          </Text>
        </View>
      )}
    </View>
  );
}
