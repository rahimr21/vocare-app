import { HungerNeed, Mission, MoodType } from "@/types";
import { MISSION_SYSTEM_PROMPT, buildMissionPrompt } from "@/constants/prompts";
import { MOCK_HUNGER_FEED } from "@/constants/mockHungerFeed";

interface OpenAIMissionResponse {
  title: string;
  description: string;
  location: string;
  estimatedMinutes: number;
}

export async function generateMission(
  mood: MoodType,
  gladnessDrivers: string[],
  needs?: HungerNeed[]
): Promise<Mission> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  const sourceNeeds =
    needs && needs.length > 0 ? needs : MOCK_HUNGER_FEED;
  const shuffled = [...sourceNeeds].sort(() => Math.random() - 0.5);
  const selectedNeeds = shuffled.slice(0, 3);

  const userPrompt = buildMissionPrompt(
    mood,
    gladnessDrivers,
    selectedNeeds.map((n) => ({
      description: n.description,
      location: n.location,
    }))
  );

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
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    missionData = JSON.parse(content);
  } catch (error) {
    console.warn("OpenAI call failed, using fallback mission:", error);
    missionData = getFallbackMission(mood, gladnessDrivers, selectedNeeds);
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
  };
}

function getFallbackMission(
  mood: MoodType,
  drivers: string[],
  needs: HungerNeed[]
): OpenAIMissionResponse {
  if (mood === "anxious") {
    return {
      title: "Grounding Walk",
      description:
        "Take a 10-minute walk around campus. Notice 5 things you can see, 4 you can hear, 3 you can touch. Let the world remind you that you are held.",
      location: "Campus Quad",
      estimatedMinutes: 10,
    };
  }

  const need = needs[0];
  if (!need) {
    return {
      title: "Answer the Call",
      description: `Take 15 minutes to offer your gifts of ${drivers.slice(0, 2).join(" and ")} somewhere on campus where you notice a need.`,
      location: "Campus",
      estimatedMinutes: 15,
    };
  }
  return {
    title: "Answer the Call",
    description: `${need.description}. Head to ${need.location} and offer 15 minutes of your time. Your gifts of ${drivers.slice(0, 2).join(" and ")} are exactly what's needed right now.`,
    location: need.location,
    estimatedMinutes: 15,
  };
}
