import { supabase } from '@/lib/supabase';

export async function saveError(
  title: string,
  endpoint: string,
  errorMessage: string,
  requestUrl?: string
) {
  try {
    await supabase
      .from('error_logs')
      .insert({
        title,
        endpoint,
        error_message: errorMessage,
        request_url: requestUrl || '',
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to save error to database:', error);
  }
}