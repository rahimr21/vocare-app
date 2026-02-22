import { supabase } from "@/lib/supabase";
import { HungerNeed, HungerNeedWithMeta } from "@/types";

/**
 * Fetches active needs from the Supabase hunger_feed table (basic fields only).
 * Used by mission generation.
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

/**
 * Fetches active open needs with creator info, people_needed, status,
 * acceptance count, and whether the current user has accepted.
 */
export async function fetchHungerFeedWithMeta(
  currentUserId: string | undefined
): Promise<HungerNeedWithMeta[]> {
  const { data: rows, error } = await supabase
    .from("hunger_feed")
    .select(
      "id, user_id, description, location, category, people_needed, creator_display_name, status"
    )
    .eq("active", true)
    .or("status.eq.open,status.is.null")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const needIds = (rows ?? []).map((r) => r.id);
  if (needIds.length === 0) {
    return (rows ?? []).map((row) => mapRowToNeedWithMeta(row, 0, false));
  }

  const { data: acceptances } = await supabase
    .from("need_acceptances")
    .select("need_id, user_id")
    .in("need_id", needIds);

  const countByNeed: Record<string, number> = {};
  const acceptedByCurrentUser: Record<string, boolean> = {};
  for (const a of acceptances ?? []) {
    countByNeed[a.need_id] = (countByNeed[a.need_id] ?? 0) + 1;
    if (currentUserId && a.user_id === currentUserId) {
      acceptedByCurrentUser[a.need_id] = true;
    }
  }

  return (rows ?? []).map((row) =>
    mapRowToNeedWithMeta(
      row,
      countByNeed[row.id] ?? 0,
      !!acceptedByCurrentUser[row.id]
    )
  );
}

function mapRowToNeedWithMeta(
  row: {
    id: string;
    user_id?: string | null;
    description: string | null;
    location: string | null;
    category: string;
    people_needed?: number | null;
    creator_display_name?: string | null;
    status?: string | null;
  },
  acceptance_count: number,
  current_user_accepted: boolean
): HungerNeedWithMeta {
  return {
    id: row.id,
    user_id: row.user_id ?? null,
    description: row.description ?? "",
    location: row.location ?? "",
    category: row.category as HungerNeed["category"],
    people_needed: row.people_needed ?? null,
    creator_display_name: row.creator_display_name ?? null,
    status: (row.status as HungerNeedWithMeta["status"]) ?? "open",
    acceptance_count,
    current_user_accepted,
  };
}

/**
 * Fetches a single need by id with acceptance count and current user accepted.
 */
export async function getNeedById(
  needId: string,
  currentUserId: string | undefined
): Promise<HungerNeedWithMeta | null> {
  const { data: row, error } = await supabase
    .from("hunger_feed")
    .select(
      "id, user_id, description, location, category, people_needed, creator_display_name, status"
    )
    .eq("id", needId)
    .eq("active", true)
    .single();

  if (error || !row) {
    return null;
  }

  const { count } = await supabase
    .from("need_acceptances")
    .select("id", { count: "exact", head: true })
    .eq("need_id", needId);

  let current_user_accepted = false;
  if (currentUserId) {
    const { data: myAcceptance } = await supabase
      .from("need_acceptances")
      .select("id")
      .eq("need_id", needId)
      .eq("user_id", currentUserId)
      .maybeSingle();
    current_user_accepted = !!myAcceptance;
  }

  return mapRowToNeedWithMeta(row, count ?? 0, current_user_accepted);
}

/**
 * Fetches needs that the current user has accepted (both open and filled).
 * Used for "Tasks for others" on the home screen.
 */
export async function fetchMyAcceptedNeeds(
  userId: string
): Promise<HungerNeedWithMeta[]> {
  const { data: acceptances, error: acceptError } = await supabase
    .from("need_acceptances")
    .select("need_id")
    .eq("user_id", userId);

  if (acceptError || !acceptances?.length) {
    return [];
  }

  const needIds = acceptances.map((a) => a.need_id);
  const { data: rows, error } = await supabase
    .from("hunger_feed")
    .select(
      "id, user_id, description, location, category, people_needed, creator_display_name, status"
    )
    .eq("active", true)
    .in("id", needIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const { data: countData } = await supabase
    .from("need_acceptances")
    .select("need_id")
    .in("need_id", needIds);

  const countByNeed: Record<string, number> = {};
  for (const row of countData ?? []) {
    countByNeed[row.need_id] = (countByNeed[row.need_id] ?? 0) + 1;
  }

  return (rows ?? []).map((row) =>
    mapRowToNeedWithMeta(row, countByNeed[row.id] ?? 0, true)
  );
}

/**
 * Accept a need (insert into need_acceptances). Idempotent: if already accepted, returns success.
 */
export async function acceptNeed(
  needId: string,
  userId: string
): Promise<{ ok: boolean; alreadyAccepted?: boolean }> {
  const { error } = await supabase.from("need_acceptances").insert({
    need_id: needId,
    user_id: userId,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: true, alreadyAccepted: true };
    }
    throw new Error(error.message);
  }
  return { ok: true };
}

/**
 * Remove current user's acceptance for a need.
 */
export async function undoAccept(
  needId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("need_acceptances")
    .delete()
    .eq("need_id", needId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Creator marks a need as filled.
 */
export async function markNeedFilled(
  needId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("hunger_feed")
    .update({ status: "filled" })
    .eq("id", needId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}
