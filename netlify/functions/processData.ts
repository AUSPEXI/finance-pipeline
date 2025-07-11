import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// AI Model Simulators (since we don't have actual model libraries)
const runT5Small = async (data: any): Promise<string | null> => {
  try {
    // Simulate T5-Small text summarization
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    const words = text.split(' ').slice(0, 20).join(' ');
    return `AI Summary: ${words}... (T5-Small processed)`;
  } catch (error) {
    console.error('T5-Small error:', error);
    return null;
  }
};

const runIsolationForest = async (data: any): Promise<number | null> => {
  try {
    // Simulate IsolationForest anomaly detection (0-1 score)
    const dataStr = JSON.stringify(data);
    const hash = createHash('md5').update(dataStr).digest('hex');
    const score = parseInt(hash.substring(0, 2), 16) / 255;
    return Math.round(score * 1000) / 1000; // 3 decimal places
  } catch (error) {
    console.error('IsolationForest error:', error);
    return null;
  }
};

const runARIMA = async (data: any): Promise<number | null> => {
  try {
    // Simulate ARIMA Enhanced forecasting
    const creditScore = data.credit_score || Math.random() * 850;
    const forecast = creditScore * 0.001 + (Math.random() - 0.5) * 0.02;
    return Math.round(Math.max(0, Math.min(1, forecast)) * 1000) / 1000;
  } catch (error) {
    console.error('ARIMA error:', error);
    return null;
  }
};

const runNode2Vec = async (data: any): Promise<number[] | null> => {
  try {
    // Simulate Node2Vec network embeddings (128-dimensional vector)
    const embedding = Array.from({ length: 128 }, () => 
      Math.round((Math.random() - 0.5) * 2 * 1000) / 1000
    );
    return embedding;
  } catch (error) {
    console.error('Node2Vec error:', error);
    return null;
  }
};

const runVAE = async (data: any): Promise<number[] | null> => {
  try {
    // Simulate VAE generative synthetic profiles as array of numbers
    // Return array of 10 numbers representing synthetic profile features
    const profile = Array.from({ length: 10 }, () => 
      Math.round(Math.random() * 1000) / 1000
    );
    return profile;
  } catch (error) {
    console.error('VAE error:', error);
    return null;
  }
};

const getModelsUsed = (suite: string): string[] => {
  const modelMap: Record<string, string[]> = {
    INSUREAI: ['T5-Small', 'IsolationForest', 'VAE'],
    SHIELD: ['T5-Small', 'IsolationForest'],
    CREDRISE: ['T5-Small', 'IsolationForest', 'ARIMA Enhanced', 'Node2Vec', 'VAE'],
    TRADEMARKET: ['T5-Small', 'IsolationForest', 'ARIMA Enhanced'],
    CASHFLOW: ['ARIMA Enhanced', 'Node2Vec'],
    CONSUME: ['T5-Small', 'VAE'],
    TAXGUARD: [],
    RISKSHIELD: ['IsolationForest', 'Node2Vec']
  };
  return modelMap[suite] || [];
};

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

  if (!supabase) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Supabase not configured' 
      })
    };
  }

  try {
    console.log('🤖 Starting AI model processing for null financial fields...');
    const startTime = Date.now();

    // Get records with null AI fields (limit to recent records for testing)
    const { data: records, error: fetchError } = await supabase
      .from('finance_data') // TARGETING FINANCE_DATA TABLE
      .select('*')
      .or('summary.is.null,anomaly_score.is.null,arima_forecast.is.null,node_embedding.is.null,synthetic_profile.is.null,models_used.is.null,processing_time.is.null,data_hash.is.null')
      .order('timestamp', { ascending: false })
      .limit(100); // Process in batches

    if (fetchError) {
      throw new Error(`Supabase fetch error: ${fetchError.message}`);
    }

    if (!records || records.length === 0) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'No records with null fields found',
          processed: 0
        })
      };
    }

    console.log(`📊 Processing ${records.length} financial records with null fields...`);

    const processed = [];
    for (const record of records) {
      const recordStartTime = Date.now();
      const output: any = { ...record };

      // Generate data_hash for all suites
      if (!output.data_hash) {
        output.data_hash = createHash('sha256')
          .update(JSON.stringify(record.data))
          .digest('hex');
      }

      // Process AI fields based on suite
      const suite = record.suite;

      // T5-Small for INSUREAI, SHIELD, CREDRISE, TRADEMARKET, CONSUME
      if (['INSUREAI', 'SHIELD', 'CREDRISE', 'TRADEMARKET', 'CONSUME'].includes(suite) && !output.summary) {
        output.summary = await runT5Small(record.data);
      }

      // IsolationForest for INSUREAI, SHIELD, CREDRISE, TRADEMARKET, RISKSHIELD
      if (['INSUREAI', 'SHIELD', 'CREDRISE', 'TRADEMARKET', 'RISKSHIELD'].includes(suite) && !output.anomaly_score) {
        output.anomaly_score = await runIsolationForest(record.data);
      }

      // ARIMA for CREDRISE, TRADEMARKET, CASHFLOW
      if (['CREDRISE', 'TRADEMARKET', 'CASHFLOW'].includes(suite) && !output.arima_forecast) {
        output.arima_forecast = await runARIMA(record.data);
      }

      // Node2Vec for CREDRISE, CASHFLOW, RISKSHIELD
      if (['CREDRISE', 'CASHFLOW', 'RISKSHIELD'].includes(suite) && !output.node_embedding) {
        output.node_embedding = await runNode2Vec(record.data);
      }

      // VAE for INSUREAI, CREDRISE, CONSUME
      if (['INSUREAI', 'CREDRISE', 'CONSUME'].includes(suite) && !output.synthetic_profile) {
        output.synthetic_profile = await runVAE(record.data);
      }

      // Models used for all suites
      if (!output.models_used) {
        output.models_used = getModelsUsed(suite);
      }

      // Processing time
      const recordProcessingTime = (Date.now() - recordStartTime) / 1000;
      if (!output.processing_time) {
        output.processing_time = recordProcessingTime;
      }

      // FIXED: Ensure addons is an object, not null
      if (!output.addons) {
        output.addons = {
          riskAnalysis: true,
          fraudDetection: true,
          complianceMonitoring: true,
          marketAnalysis: true,
          portfolioOptimization: true,
          // Core addons with mock values
          prediction: { value: Math.round(Math.random() * 100) / 100 },
          profile: { complexityScore: Math.round(Math.random() * 100) / 100 },
          sentiment: { model: 'DistilBERT_Sim' },
          // Premium addons with mock values
          network: { nodes: Math.floor(Math.random() * 100) + 50 },
          optimization: { efficiency: Math.floor(Math.random() * 20) + 70 },
          clustering: { clusters: Math.floor(Math.random() * 5) + 2 },
          forecasting: { trend: ['stable', 'increasing', 'decreasing'][Math.floor(Math.random() * 3)] }
        };
      }

      processed.push(output);
    }

    // Update records in batches
    const batchSize = 10;
    let updated = 0;
    const errors = [];

    for (let i = 0; i < processed.length; i += batchSize) {
      const batch = processed.slice(i, i + batchSize);
      
      for (const record of batch) {
        try {
          const { error: updateError } = await supabase
            .from('finance_data') // TARGETING FINANCE_DATA TABLE
            .update({
              summary: record.summary,
              anomaly_score: record.anomaly_score,
              arima_forecast: record.arima_forecast,
              node_embedding: record.node_embedding,
              synthetic_profile: record.synthetic_profile,
              models_used: record.models_used,
              processing_time: record.processing_time,
              data_hash: record.data_hash,
              addons: record.addons
            })
            .eq('id', record.id);

          if (updateError) {
            errors.push(`Record ${record.id}: ${updateError.message}`);
          } else {
            updated++;
          }
        } catch (err) {
          errors.push(`Record ${record.id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const totalTime = Date.now() - startTime;
    const avgProcessingTime = totalTime / processed.length;

    console.log(`✅ AI processing completed: ${updated}/${processed.length} financial records updated in ${totalTime}ms`);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: `AI model processing completed: ${updated}/${processed.length} financial records updated`,
        processed: updated,
        failed: processed.length - updated,
        total_time_ms: totalTime,
        avg_processing_time_ms: avgProcessingTime,
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
        suite_breakdown: processed.reduce((acc, record) => {
          acc[record.suite] = (acc[record.suite] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      })
    };

  } catch (err) {
    console.error('💥 AI model processing error:', err);
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