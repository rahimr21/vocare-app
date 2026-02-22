# Vocare

A React Native mobile app that helps students discover purpose through small acts of service. Inspired by Jesuit values, Vocare uses AI to connect personal strengths with campus needs and generates daily "Micro-Missions" that encourage outward-facing action.

## Features

- **Authentication** – Sign up and sign in via Supabase (email/password)
- **Gladness Profile** – Multi-select onboarding to capture what gives you energy (e.g., listening to people, building systems, creative expression)
- **Daily Check-in** – Mood-based entry point (Anxious, Bored, Energized, Content) that triggers mission generation
- **Micro-Missions** – AI-generated, actionable tasks under 20 minutes, tailored to your drivers and mood
- **Mission Flow** – Accept or skip missions; track completion and answer "Did this make you feel alive?"
- **Purpose Constellation** – Visual map of completed missions and which types yielded a "Yes," revealing purpose patterns
- **Submit a Need** – Form to add campus needs (description, location, category) to the community hunger feed
- **Settings** – Profile and logout

## User Flow

1. **Auth** – Sign up or log in
2. **Onboarding** – Welcome screen, then Gladness profile (select 2+ energy drivers)
3. **Home** – Daily check-in: pick a mood, receive a generated Micro-Mission
4. **Mission Reveal** – View the mission; accept or skip
5. **Active Mission** – Mark complete, then answer reflection: "Did this make you feel alive?"
6. **Constellation** – View your journey; stars represent missions; gold = felt alive, dim = did not
7. **Report** – Submit new campus needs to the hunger feed

## Tech Stack

- React Native (Expo managed workflow)
- NativeWind (Tailwind for React Native)
- Supabase (auth, future persistence)
- OpenAI API (mission generation)
- Expo Router (file-based navigation)

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add your Supabase URL, Supabase anon key, and OpenAI API key
3. Run: `npx expo start`

## Environment Variables

- `EXPO_PUBLIC_SUPABASE_URL` – Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` – Supabase anonymous key
- `EXPO_PUBLIC_OPENAI_API_KEY` – OpenAI API key for mission generation

See `SUPABASE_INSTRUCTIONS.md` for database schema when moving beyond the local MVP.

## Project Structure

```
app/               # Expo Router screens
  (auth)/          # Login, signup
  (onboarding)/    # Welcome, Gladness profile
  (tabs)/          # Home, Report, Constellation
  mission/         # Reveal, active, reflection
components/        # Reusable UI
constants/         # Moods, drivers, prompts, mock data
context/           # Auth, UserProfile, Mission state
lib/               # Supabase, OpenAI, storage utilities
types/             # TypeScript definitions
```
