import { HungerNeed, Mission, MoodType, DeepOnboardingData } from "@/types";
import { MISSION_SYSTEM_PROMPT, buildMissionPrompt } from "@/constants/prompts";
import { getItem, KEYS } from "@/lib/storage";
import { getWeather } from "@/lib/weather";

interface OpenAIMissionResponse {
  title: string;
  description: string;
  location: string;
  estimatedMinutes: number;
  personalNote?: string;
}

export async function generateMission(
  mood: MoodType,
  gladnessDrivers: string[],
  needs?: HungerNeed[],
  customMoodText?: string
): Promise<Mission> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  const [deepData, weather, storedMissions] = await Promise.all([
    getItem<DeepOnboardingData>(KEYS.ONBOARDING_DEEP),
    getWeather(),
    getItem<Mission[]>(KEYS.MISSIONS),
  ]);

  const recentTitles = (storedMissions || [])
    .filter((m) => m.status === "completed" || m.status === "skipped")
    .slice(0, 5)
    .map((m) => m.title);

  const selectedNeeds = needs && needs.length > 0
    ? [...needs].sort(() => Math.random() - 0.5).slice(0, 3)
    : [];

  const userPrompt = buildMissionPrompt({
    mood,
    customMoodText,
    gladnessDrivers,
    personalityTraits: deepData?.personalityTraits,
    physicalLimitations: deepData?.physicalLimitations,
    rechargeActivities: deepData?.rechargeActivities,
    hunger: deepData?.hunger,
    resistance: deepData?.resistance,
    vocationSnippet: deepData?.vocation,
    needs: selectedNeeds.map((n) => ({
      description: n.description,
      location: n.location,
    })),
    weather,
    recentMissionTitles: recentTitles,
  });

  let missionData: OpenAIMissionResponse;

  try {
    if (!apiKey || apiKey === "your-openai-api-key") {
      throw new Error("No API key configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: MISSION_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.95,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    missionData = JSON.parse(content);
  } catch (err) {
    console.warn("OpenAI call failed, using fallback mission:", err);
    missionData = getFallbackMission(mood, gladnessDrivers, customMoodText);
  }

  return {
    id: Date.now().toString(),
    title: missionData.title,
    description: missionData.description,
    location: missionData.location,
    estimatedMinutes: missionData.estimatedMinutes || 15,
    mood,
    gladnessDrivers,
    status: "pending",
    feltAlive: null,
    createdAt: new Date().toISOString(),
    completedAt: null,
    personalNote: missionData.personalNote,
  };
}

function getFallbackMission(
  mood: MoodType,
  drivers: string[],
  customMoodText?: string
): OpenAIMissionResponse {
  if (mood === "anxious") {
    return {
      title: "Grounding Moment",
      description:
        "Find a quiet corner and take 10 slow breaths. Then notice 5 things you can see, 4 you can hear, and 3 you can touch. You deserve this moment of calm.",
      location: "Any quiet spot on campus",
      estimatedMinutes: 10,
      personalNote:
        "It takes real courage to pause when you're feeling anxious. This gentle mission is designed to bring you back to the present.",
    };
  }

  const isGriefOrDeath =
    mood === "other" &&
    customMoodText?.match(/died|death|passed|lost (a |my )?(pet|dog|cat|someone|loved one)|grieving|grief/i);
  const isBreakupOrLoss =
    mood === "other" &&
    customMoodText?.match(
      /broke up|break up|breakup|girlfriend|boyfriend|relationship|heartbr|loss|lost someone|divorce|split/i
    );
  if (isGriefOrDeath) {
    return {
      title: "A Gentle Moment",
      description:
        "Take 10 minutes in a quiet spot. You might light a candle, write a few words, or simply sit and breathe. There's no need to do anything more. You're allowed to feel what you feel.",
      location: "Any quiet spot — your room, a bench, or somewhere that feels safe",
      estimatedMinutes: 10,
      personalNote:
        "I'm so sorry for your loss. What you're going through is real and hard. Be gentle with yourself today.",
    };
  }
  if (mood === "bored" || (mood === "other" && customMoodText?.match(/down|sad|tired|lonely|overwhelmed/i)) || isBreakupOrLoss) {
    const breakupNote = isBreakupOrLoss
      ? "I'm really sorry you're going through this. Breakups and relationship pain are hard, and it's completely okay to feel what you're feeling. You're heard."
      : customMoodText?.trim()
        ? "What you're feeling is valid. It's okay to take things slow right now. You're heard."
        : "Everyone needs a recharge sometimes. This mission is all about giving yourself permission to just be.";
    return {
      title: "Comfort & Recharge",
      description:
        "Grab your favorite warm drink, find a cozy spot, and spend 10 minutes doing something small that brings you comfort — sketch, journal, listen to a song that helps, or just breathe. You don't have to do anything big today.",
      location: "Campus Cafe or Common Room",
      estimatedMinutes: 10,
      personalNote: breakupNote,
    };
  }

  return {
    title: "Share Your Gifts",
    description: `Take 15 minutes to offer your gifts of ${drivers.slice(0, 2).join(" and ") || "presence"} somewhere on campus where you notice a need. Even small acts ripple outward.`,
    location: "Campus",
    estimatedMinutes: 15,
    personalNote: `Since you're feeling ${mood} today, this is a great moment to channel that energy into something meaningful.`,
  };
}
