import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const handler: Handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight' })
    };
  }

  console.log('🔄 Starting finance data stats refresh...');
  
  if (!supabase) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Supabase not configured',
        timestamp: new Date().toISOString()
      })
    };
  }

  try {
    const startTime = Date.now();
    
    // Call the refresh function
    const { data, error } = await supabase
      .rpc('refresh_finance_data_stats');

    if (error) {
      throw new Error(`Stats refresh failed: ${error.message}`);
    }
    
    // Get the refreshed stats
    const { data: stats, error: statsError } = await supabase
      .rpc('get_finance_data_stats');
    
    if (statsError) {
      throw new Error(`Stats retrieval failed: ${statsError.message}`);
    }
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Finance data stats refreshed in ${duration}ms`);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: `Finance data stats refreshed in ${duration}ms`,
        timestamp: new Date().toISOString(),
        stats: stats || {},
        refresh_duration_ms: duration
      })
    };
    
  } catch (err) {
    console.error('❌ Finance data stats refresh error:', err);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  }
};