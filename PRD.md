Document Title: PRD - Vocare (The Praxis Vocation Engine)
Date: October 26, 2023
Target Event: Boston College Spiritual Hackathon

1. Executive Summary
Vocare is a React Native mobile application designed to help college students break out of self-focused "motion" and discover their broader purpose. It uses AI to act as a "Vocation Matchmaker," connecting a student's personal gifts (what gives them energy) with real-world needs on campus ("the world's hunger"). It generates daily, actionable "Micro-Missions" that encourage outward-facing service, followed by brief reflection to track what makes the student feel alive.

2. Core Value Proposition (Jesuit Context)
The app addresses the problem of students failing to realize they are called to something bigger than their own benefit. It operationalizes the Jesuit value of becoming "men and women for others" by turning passive stillness into active momentum.

3. Technical Stack & Constraints
Frontend Framework: React Native Expo (Managed Workflow).

Styling: NativeWind (Tailwind CSS for React Native) is preferred for speed.

Backend/Auth: Supabase (client-side integration only for this phase).

AI Engine: OpenAI API (gpt-3.5-turbo or gpt-4o-mini).

Workflow Note: Claude Code will build the entire frontend structure, navigation, UI, and API connections. It will mock database calls or set up the Supabase client hooks, but it will NOT create actual tables in Supabase.

4. User Flow & Functional Requirements
4.1 Authentication

Requirement: Users must sign up/sign in to save their profile and history.

Implementation: Use Supabase Auth for simple Email/Password sign-up. No email verification required for MVP.

4.2 Onboarding: The "Gladness" Profile

Requirement: Upon first login, users define what gives them energy.

UI: A multi-select screen. Do not ask for major/year.

Data: Present options like: "Listening to people," "Building systems," "Physical activity," "Organizing chaos," "Creative expression." Store these selections locally in user context initially, ready to be pushed to Supabase user profile.

4.3 Home Screen: The Daily Check-in

Requirement: The primary interface when opening the app.

Action: Ask the user: "How are you feeling right now?"

Options: Provide mood options (e.g., Anxious, Bored, Energized, Content).

Logic: Selecting a mood triggers the Praxis AI Engine.

4.4 The Praxis AI Engine & Mission Reveal

Requirement: Generate a custom "Micro-Mission."

AI Input: The prompt sent to OpenAI must include:

The user's selected "Gladness" drivers (from profile).

The user's current mood.

A retrieved list of current "World Hunger" needs (mock this list for now, e.g., [{need: "Freshmen feel isolated", location: "Dining Hall"}, {need: "CS tutor needed", location: "Library"}]).

AI Output Goal: A short, actionable directive that connects the user's gifts to a need, OR a mood-regulating task if they are highly anxious.

UI: Display the generated mission prominently as a "Call."

4.5 Mission Execution & Reflection

Requirement: Track completion and impact.

UI: A button to mark the mission "Complete."

Reflection: Immediately upon completion, present a screen with one question: "Did doing this make you feel alive?" (Binary Yes/No choice).

Data Handling: This response tag must be associated with the mission type for future visualization.

4.6 The Purpose Constellation (Profile View)

Requirement: A visual representation of the user's journey.

UI: A dashboard showing a visual map (like stars connecting). Over time, it highlights which types of missions yielded a "Yes" response in reflection, showing them where their purpose lies.

4.7 The "World's Hunger" Submission

Requirement: A way to crowdsource needs.

UI: A separate tab or screen with a simple form.

Fields: Description of the need, Location, Category.

Action: Submitting this form should prepare data to send to the Supabase hunger_feed table.

5. AI Prompt Structure (Guidance for Claude Code)
When building the OpenAI API call, structure the system prompt similar to this:
"You are the Praxis Vocation Engine, a Jesuit-inspired AI designed to help students find purpose through small acts of service. You will receive a student's 'energy drivers,' their current mood, and a list of campus needs. Your goal is to generate a single, 2-sentence Micro-Mission. It should be actionable in under 20 minutes. It should connect their drivers to a campus need if possible. If they are 'Anxious', give them a grounding mission instead. Tone: Encouraging, spiritual but not preachy, calls to action."