/** Step 1: "What activities make you lose track of time?" — multi-select pills */
export const GLADNESS_PILLS = [
  { id: "building", label: "Building" },
  { id: "listening", label: "Listening" },
  { id: "organizing", label: "Organizing" },
  { id: "creating", label: "Creating" },
  { id: "teaching", label: "Teaching" },
  { id: "helping", label: "Helping" },
  { id: "exploring", label: "Exploring" },
  { id: "writing", label: "Writing" },
  { id: "leading", label: "Leading" },
] as const;

/** Step 2: "How would your closest friend describe you?" — multi-select pills (pick 2-3) */
export const PERSONALITY_OPTIONS = [
  { id: "empathetic", label: "Empathetic" },
  { id: "analytical", label: "Analytical" },
  { id: "adventurous", label: "Adventurous" },
  { id: "calm", label: "Calm" },
  { id: "energetic", label: "Energetic" },
  { id: "creative", label: "Creative" },
  { id: "disciplined", label: "Disciplined" },
  { id: "social", label: "Social" },
] as const;

/** Step 3: "Is there anything that limits your physical activity?" */
export const PHYSICAL_OPTIONS = [
  { id: "no-limitations", label: "No limitations" },
  { id: "injury", label: "Injury or chronic pain" },
  { id: "low-energy", label: "Low energy / fatigue" },
  { id: "mobility", label: "Mobility challenges" },
  { id: "prefer-indoors", label: "Prefer to stay indoors" },
] as const;

/** Step 4: "What activities help you recharge?" — multi-select (pick 2-5) */
export const RECHARGE_OPTIONS = [
  { id: "walking-nature", label: "Walking in nature" },
  { id: "listening-music", label: "Listening to music" },
  { id: "reading-writing", label: "Reading or writing" },
  { id: "talking-friends", label: "Talking to friends" },
  { id: "cooking-making", label: "Cooking or making things" },
  { id: "exercise-sports", label: "Exercise or sports" },
  { id: "quiet-alone", label: "Quiet alone time" },
  { id: "playing-games", label: "Playing games" },
  { id: "art-creativity", label: "Art or creativity" },
] as const;

/** Step 5: "What problem in the world breaks your heart?" — single-select cards */
export const HUNGER_OPTIONS = [
  {
    id: "loneliness",
    label: "Loneliness",
    description: "People feeling isolated or unseen",
  },
  {
    id: "inefficiency",
    label: "Inefficiency",
    description: "Systems that waste time or resources",
  },
  {
    id: "injustice",
    label: "Injustice",
    description: "Unfairness and lack of opportunity",
  },
] as const;

export const ONBOARDING_STEPS_TOTAL = 7;
