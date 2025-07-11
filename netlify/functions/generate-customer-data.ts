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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!supabase) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Database not configured' 
      })
    };
  }

  try {
    const {
      suite,
      recordsToGenerate,
      pauseRSS,
      autoRevert,
      revertAfterHours,
      customerSeedId
    } = JSON.parse(event.body || '{}');

    console.log(`🚀 Generating ${recordsToGenerate} customer-seeded records for ${suite}`);

    // 1. Set RSS pause flag if requested
    if (pauseRSS) {
      await supabase
        .from('system_config')
        .upsert({
          key: `rss_paused_${suite}`,
          value: JSON.stringify({
            paused: true,
            paused_at: new Date().toISOString(),
            customer_seed_id: customerSeedId,
            auto_revert: autoRevert,
            revert_after_hours: revertAfterHours
          })
        });
      
      console.log(`⏸️ RSS collection paused for ${suite}`);
    }

    // 2. Get customer seed data
    const { data: seedRecord, error: seedError } = await supabase
      .from('finance_data')
      .select('*')
      .eq('id', customerSeedId)
      .single();

    if (seedError || !seedRecord) {
      throw new Error('Customer seed record not found');
    }

    // 3. Generate synthetic data based on customer seed
    const generatedRecords = [];
    const batchSize = 50;
    
    for (let i = 0; i < recordsToGenerate; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, recordsToGenerate - i);
      const batch = [];
      
      for (let j = 0; j < currentBatchSize; j++) {
        // Generate variations based on customer seed characteristics
        const variation = 0.8 + Math.random() * 0.4; // 80%-120% variation
        
        const record = {
          source: 'customer_seeded_synthetic',
          data: {
            ...seedRecord.data,
            generated_from_customer_seed: true,
            variation_factor: variation,
            generation_batch: Math.floor(i / batchSize) + 1
          },
          timestamp: new Date().toISOString(),
          location: seedRecord.location,
          credit_score: Math.round(seedRecord.credit_score * variation),
          transaction_volume: Math.round(seedRecord.transaction_volume * variation),
          risk_weight: Math.max(0, Math.min(1, seedRecord.risk_weight * variation)),
          suite: seedRecord.suite,
          summary: `Customer-seeded synthetic data (variation ${Math.round(variation * 100)}%)`,
          models_used: ['customer_seed_generator'],
          processing_time: 0.05,
          data_hash: `customer_seed_${Date.now()}_${i + j}`,
          addons: {
            ...seedRecord.addons,
            customer_seeded: true,
            generation_run: true,
            seed_record_id: customerSeedId
          }
        };
        
        batch.push(record);
      }
      
      // Insert batch
      const { error: insertError } = await supabase
        .from('finance_data')
        .insert(batch);
      
      if (insertError) {
        console.error('❌ Batch insert error:', insertError);
      } else {
        generatedRecords.push(...batch);
        console.log(`✅ Generated batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records`);
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 4. Schedule auto-revert if requested
    if (autoRevert && pauseRSS) {
      const revertTime = new Date(Date.now() + revertAfterHours * 60 * 60 * 1000);
      
      await supabase
        .from('scheduled_tasks')
        .insert({
          task_type: 'revert_rss_collection',
          suite: suite,
          scheduled_for: revertTime.toISOString(),
          parameters: {
            customer_seed_id: customerSeedId,
            records_generated: generatedRecords.length
          }
        });
      
      console.log(`⏰ Auto-revert scheduled for ${revertTime.toISOString()}`);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        records_created: generatedRecords.length,
        suite: suite,
        customer_seed_id: customerSeedId,
        rss_paused: pauseRSS,
        auto_revert_scheduled: autoRevert && pauseRSS,
        revert_in_hours: autoRevert ? revertAfterHours : null,
        generation_completed_at: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Customer data generation failed:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    };
  }
};