import { supabase } from "@/lib/supabase";
import { HungerNeed } from "@/types";

/**
 * Fetches active needs from the Supabase hunger_feed table.
 * Used by the home feed and mission generation.
 */
export async function fetchHungerFeed(): Promise<HungerNeed[]> {
  const { data, error } = await supabase
    .from("hunger_feed")
    .select("id, description, location, category")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    description: row.description ?? "",
    location: row.location ?? "",
    category: row.category as HungerNeed["category"],
  }));
}
