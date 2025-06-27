import { supabase } from "@/lib/supabase";

export async function getSupabaseUserId(clerkUserId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      console.error('Error fetching Supabase user:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error in getSupabaseUserId:', error);
    return null;
  }
} 