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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'text/csv'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  if (!supabase) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        error: 'Database not configured' 
      })
    };
  }

  try {
    const { suite, records } = event.queryStringParameters || {};
    
    if (!suite) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: false, 
          error: 'Suite parameter required' 
        })
      };
    }

    console.log(`📥 Downloading customer data for ${suite}, ${records} records`);

    // Get customer-generated records for this suite
    const { data: customerRecords, error } = await supabase
      .from('finance_data')
      .select('*')
      .eq('suite', suite)
      .eq('source', 'customer_seeded_synthetic')
      .order('timestamp', { ascending: false })
      .limit(parseInt(records || '1000'));

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    if (!customerRecords || customerRecords.length === 0) {
      return {
        statusCode: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: false, 
          error: 'No customer data found for this suite' 
        })
      };
    }

    // Convert to CSV
    const csvHeaders = [
      'id', 'timestamp', 'location', 'credit_score', 'transaction_volume', 
      'risk_weight', 'suite', 'summary', 'anomaly_score', 'arima_forecast', 
      'source', 'data_hash'
    ];

    const csvRows = [csvHeaders.join(',')];
    
    for (const record of customerRecords) {
      const row = csvHeaders.map(header => {
        let value = record[header];
        
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return value.toString();
        }
      });
      
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');
    const filename = `${suite}_customer_data_${customerRecords.length}_records.csv`;

    console.log(`✅ Generated CSV with ${customerRecords.length} records for download`);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': csvContent.length.toString()
      },
      body: csvContent
    };

  } catch (error) {
    console.error('❌ Customer data download failed:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Download failed'
      })
    };
  }
};