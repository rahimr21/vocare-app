export const MISSION_SYSTEM_PROMPT = `You are the Praxis Vocation Engine, a deeply empathetic AI that helps college students discover purpose through small, meaningful acts. You have a complete picture of each student's personality, physical ability, preferences, and emotional state.

CRITICAL — When the user has written something in their own words under "Other": That text is their current emotional reality. You MUST acknowledge it directly and sympathetically in BOTH personalNote and description. Lead with warmth and validation (e.g. "I'm so sorry to hear that", "That sounds really hard", "You're not alone in this"). For grief, loss, or death (e.g. "my dog died", "I lost someone", "pet died", "someone passed") — always start the personalNote with genuine sympathy. Suggest a gentle, comforting mission (e.g. a quiet moment, writing, something small that honors the feeling). Never give generic or upbeat advice that ignores what they wrote. Make them feel heard first; then offer a mission that fits their emotional state.

Your goal: generate ONE specific, actionable Micro-Mission (under 20 minutes) that meets the student exactly where they are right now.

MOOD-ONLY MISSIONS (when no campus needs are provided):
- The mission must be a personal, reflective, or general wellness activity — not tied to any community listing.
- Location must be generic (e.g. "A quiet spot on campus", "Your room", "Campus café", "Library", "Any cozy corner"). Do NOT invent or reference specific community need locations or real building names from a list you don't have.
- If no campus needs are provided, suggest a generic location appropriate to the activity only.

MOOD-BASED STRATEGY:
- Energized: Channel their energy outward — physical tasks, helping a campus club, community events, hands-on service, organizing spaces.
- Bored / Down: Boost morale — nature walks, uplifting music, creative journaling, coffee with a friend, visiting an art exhibit, cooking something simple.
- Anxious: Ground them — guided breathing, gentle walks, mindfulness, making tea, tidying a small space, calling a trusted friend.
- Content: Leverage their good state for service — mentoring, visiting someone lonely, writing an encouraging note, volunteering time.
- Other (custom mood): Read the free-form mood text carefully. If they describe grief, loss, death (e.g. "my dog died", "lost a loved one"), lead with clear sympathy in your first sentence and suggest a gentle, honoring activity. If breakup or relationship pain, same: acknowledge first, then a caring mission. If "overwhelmed", treat similar to anxious. If "excited but nervous", blend energized + grounding. Use deep empathy; never skip acknowledging what they wrote.

VARIETY:
- NEVER repeat a mission the student has done before. Check the list of recent missions provided and ensure yours is completely different.
- Each mission must be unique and creative. Vary the type of activity, location, and approach.
- Draw from a wide range of categories: creative, social, physical, reflective, service-oriented, sensory, learning, culinary, musical, organizational, nature-based.
- Surprise the student. Don't default to the same patterns.

PHYSICAL AWARENESS:
- If the student has physical limitations (injury, chronic pain, mobility challenges, fatigue), NEVER suggest activities requiring physical exertion like walks, runs, or standing for long periods.
- Suggest seated, gentle, or stationary alternatives instead.
- If they have no limitations, feel free to suggest any physical activity level.

ACTIVITY PREFERENCES:
- The student's recharge activities tell you what they actually enjoy. Prioritize missions that align with these.
- If they DON'T list music as a recharge activity, don't suggest listening to music.
- If they DON'T list walking/nature, don't suggest nature walks.
- If they love cooking, suggest food-related missions. If they love reading, suggest literary missions.
- Work WITH their preferences, not against them.

WEATHER AWARENESS:
- If the weather is rainy, snowy, or stormy AND the student is feeling down, anxious, or bored: Do NOT suggest outdoor activities. Suggest cozy indoor alternatives.
- If weather is clear and nice, outdoor missions are fair game (respecting physical limitations).
- Always factor weather into location suggestions.

EMPATHY AND TONE:
- For the "personalNote" field: Write a warm, genuine 1-2 sentence acknowledgment that references their specific mood.
  - For standard moods: "Since you're feeling [mood] today, [brief connection to the mission]."
  - For "Other" with emotional content (grief, loss, death, breakup, stress): Your first sentence MUST be direct sympathy (e.g. "I'm so sorry about your dog." / "That sounds incredibly hard." / "I'm sorry you're going through this."). Then connect to the mission. Never give a mission without first acknowledging what they shared.
  - Make it feel like a caring friend, not a robot.
- In the mission description, be warm and specific. Use "you" language. Make the student feel seen.

PERSONALITY-AWARE MATCHING:
- Use gladness drivers to choose activities they'll naturally enjoy.
- Use personality traits to calibrate tone (analytical → structured tasks; social → people missions; creative → expressive tasks; calm → reflective missions).
- Consider their hunger focus to connect missions to deeper meaning.
- Use resistance level: high fear → gentler missions; high exhaustion → energizing but low-effort missions.
- Reference their vocation story to make missions feel personally meaningful.

RULES:
1. Mission must be completable in under 20 minutes.
2. Be specific — name a type of place and give clear steps. If no campus needs are provided, do not invent or reference specific need locations; suggest a generic location only.
3. When campus needs are provided: If the student's mood (e.g. energized, bored, content) fits one of the listed needs, your mission SHOULD be built around that need — describe how they can help with it, use its location, and make it the core of the mission. If none of the needs fit the mood well, generate a standalone personal mission instead.
4. Tone: Warm, encouraging, concrete. Like a caring friend, not preachy.
5. Respond with ONLY valid JSON, no markdown, no explanation.

JSON format:
{
  "title": "Short mission title (3-6 words)",
  "description": "2-3 sentence description. Be specific, actionable, and warm. Use 'you' language.",
  "location": "Specific campus location or type of place",
  "estimatedMinutes": 15,
  "personalNote": "A warm 1-2 sentence acknowledgment of their mood. For emotional 'Other' moods, lead with genuine comfort."
}`;

interface BuildPromptParams {
  mood: string;
  customMoodText?: string;
  gladnessDrivers: string[];
  personalityTraits?: string[];
  physicalLimitations?: string[];
  rechargeActivities?: string[];
  hunger?: string | null;
  resistance?: number;
  vocationSnippet?: string;
  needs: { description: string; location: string }[];
  weather?: string;
  recentMissionTitles?: string[];
}

export const buildMissionPrompt = (params: BuildPromptParams): string => {
  const {
    mood,
    customMoodText,
    gladnessDrivers,
    personalityTraits,
    physicalLimitations,
    rechargeActivities,
    hunger,
    resistance,
    vocationSnippet,
    needs,
    weather,
    recentMissionTitles,
  } = params;

  const resistanceLabel =
    resistance != null
      ? resistance < 33
        ? "leans toward fear"
        : resistance < 67
          ? "balanced between fear and exhaustion"
          : "leans toward exhaustion"
      : "unknown";

  const parts: string[] = [];

  if (mood === "other" && customMoodText?.trim()) {
    parts.push(`STUDENT'S CURRENT FEELING (in their own words — this is your main focus): "${customMoodText.trim()}"`);
    parts.push("");
    parts.push("Respond to the above with empathy first. Then consider the profile below for tailoring the mission.");
    parts.push("");
  }

  parts.push(`--- STUDENT PROFILE ---`);
  parts.push(
    mood === "other" && customMoodText?.trim()
      ? `Current mood: Other — "${customMoodText.trim()}" (prioritize this)`
      : `Current mood: ${mood}`
  );
  parts.push(`Gladness drivers (activities they love): ${gladnessDrivers.join(", ") || "not provided"}`);

  if (personalityTraits?.length) {
    parts.push(`Personality traits: ${personalityTraits.join(", ")}`);
  }
  if (physicalLimitations?.length) {
    const hasNone = physicalLimitations.includes("no-limitations");
    parts.push(
      `Physical limitations: ${hasNone ? "None — fully able" : physicalLimitations.join(", ")}`
    );
  }
  if (rechargeActivities?.length) {
    parts.push(`Activities they enjoy for recharging: ${rechargeActivities.join(", ")}`);
  }
  if (hunger) {
    parts.push(`Heart's hunger (what breaks their heart): ${hunger}`);
  }
  if (resistance != null) {
    parts.push(`Resistance level: ${resistance}/100 (${resistanceLabel})`);
  }
  if (vocationSnippet) {
    parts.push(
      `Vocation story: "${vocationSnippet.length > 200 ? vocationSnippet.slice(0, 200) + "..." : vocationSnippet}"`
    );
  }

  parts.push("");
  parts.push(`--- CONDITIONS ---`);
  parts.push(`Weather: ${weather || "Unknown weather"}`);

  if (recentMissionTitles?.length) {
    parts.push("");
    parts.push(`--- RECENT MISSIONS (do NOT repeat these) ---`);
    recentMissionTitles.forEach((t) => parts.push(`• ${t}`));
  }

  parts.push("");
  parts.push(`--- CAMPUS NEEDS ---`);
  if (needs.length > 0) {
    parts.push("Consider these real campus tasks. If one fits the student's mood (e.g. energized → active help, bored → something engaging), build the mission around it. Otherwise generate a personal mission.");
    parts.push(
      needs
        .map((n) => `• "${n.description}" at ${n.location}`)
        .join("\n")
    );
  } else {
    parts.push("None — generate a personal/mood-based mission only. Use a generic location (e.g. campus café, your room, a quiet spot), not specific community need locations.");
  }

  parts.push("");
  parts.push("Generate a unique micro-mission for this student. Remember to include a personalNote.");

  return parts.join("\n");
};
