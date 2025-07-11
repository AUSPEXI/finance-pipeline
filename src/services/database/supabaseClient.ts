import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using fallback mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ChangesDataRow {
  id?: string;
  source: string;
  data: any;
  timestamp?: string;
  location?: string;
  event?: string;
  sentiment?: number;
  sentiment_type?: string;
}

export const insertChangesData = async (data: ChangesDataRow): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('changes_data')
      .insert([data]);

    if (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Supabase client error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

export const fetchChangesData = async (): Promise<{ success: boolean; data?: ChangesDataRow[]; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('changes_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase fetch error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Supabase client error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
