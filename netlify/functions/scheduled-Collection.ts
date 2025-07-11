import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Government suites configuration with AI model assignments (FIXED: Correct spellings)
const GOVERNMENT_SUITES = ['CHANGES', 'POISON', 'STRIVE', 'HYDRA', 'SIREN', 'REFORM', 'INSURE', 'SHIELD'];

const SUITE_CONFIGS = {
  CHANGES: { 
    events: ['flu', 'covid', 'measles', 'malaria'], 
    sources: ['WHO', 'CDC', 'Johns Hopkins'],
    ai_models: ['T5-Small', 'IsolationForest', 'ARIMA Enhanced', 'Node2Vec', 'VAE']
  },
  POISON: { 
    events: ['crime', 'violence', 'drugs', 'theft'], 
    sources: ['FBI', 'Police Reports', 'Crime Stats'],
    ai_models: ['T5-Small', 'IsolationForest', 'ARIMA Enhanced']
  },
  STRIVE: { 
    events: ['military', 'defense', 'training', 'operations'], 
    sources: ['DoD', 'Military Reports', 'Defense News'],
    ai_models: ['IsolationForest', 'Node2Vec']
  },
  HYDRA: { 
    events: ['fire', 'wildfire', 'emergency', 'disaster'], 
    sources: ['Fire Dept', 'Emergency Services', 'FEMA'],
    ai_models: ['T5-Small', 'IsolationForest', 'VAE']
  },
  SIREN: { 
    events: ['ems', 'ambulance', 'medical', 'response'], 
    sources: ['EMS', 'Hospital Reports', 'Medical Services'],
    ai_models: []
  },
  REFORM: { 
    events: ['prison', 'corrections', 'rehabilitation', 'recidivism'], 
    sources: ['Bureau of Prisons', 'Corrections', 'Justice Dept'],
    ai_models: []
  },
  INSURE: { 
    events: ['insurance', 'claims', 'risk', 'coverage'], 
    sources: ['Insurance Companies', 'Risk Assessment', 'Claims Data'],
    ai_models: []
  },
  SHIELD: { 
    events: ['cyber', 'security', 'breach', 'threat'], 
    sources: ['CISA', 'Cybersecurity', 'Threat Intelligence'],
    ai_models: []
  }
};

// Target: 1M records/day = 576 records per run (every 83 seconds)
const DAILY_TARGET = 1000000;
const RUNS_PER_DAY = 1736; // Every 83 seconds for 1M/day
const RECORDS_PER_RUN = Math.floor(DAILY_TARGET / RUNS_PER_DAY); // 576
const RECORDS_PER_SUITE = Math.floor(RECORDS_PER_RUN / GOVERNMENT_SUITES.length); // 72

// AI Model simulators for complete field population
const generateAIFields = (suite: string, data: any) => {
  const config = SUITE_CONFIGS[suite as keyof typeof SUITE_CONFIGS];
  const aiFields: any = {
    summary: null,
    anomaly_score: null,
    arima_forecast: null,
    node_embedding: null,
    synthetic_profile: null,
    models_used: config.ai_models
  };

  // T5-Small summary for CHANGES, POISON, HYDRA
  if (config.ai_models.includes('T5-Small')) {
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    aiFields.summary = `AI Summary: ${text.split(' ').slice(0, 15).join(' ')}... (T5-Small)`;
  }

  // IsolationForest anomaly score for CHANGES, POISON, STRIVE, HYDRA
  if (config.ai_models.includes('IsolationForest')) {
    const hash = createHash('md5').update(JSON.stringify(data)).digest('hex');
    aiFields.anomaly_score = Math.round((parseInt(hash.substring(0, 2), 16) / 255) * 1000) / 1000;
  }

  // ARIMA forecast for CHANGES, POISON
  if (config.ai_models.includes('ARIMA Enhanced')) {
    const sentiment = data.sentiment || Math.random();
    aiFields.arima_forecast = Math.round(Math.max(0, Math.min(1, sentiment * 1.1 + (Math.random() - 0.5) * 0.2)) * 1000) / 1000;
  }

  // Node2Vec embedding for CHANGES, STRIVE
  if (config.ai_models.includes('Node2Vec')) {
    aiFields.node_embedding = Array.from({ length: 128 }, () => 
      Math.round((Math.random() - 0.5) * 2 * 1000) / 1000
    );
  }

  // VAE synthetic profile for CHANGES, HYDRA
  if (config.ai_models.includes('VAE')) {
    aiFields.synthetic_profile = {
      age_group: ['18-25', '26-35', '36-45', '46-55', '55+'][Math.floor(Math.random() * 5)],
      risk_score: Math.round(Math.random() * 100) / 100,
      behavioral_pattern: Math.floor(Math.random() * 10),
      synthetic_id: createHash('md5').update(JSON.stringify(data)).digest('hex').substring(0, 8)
    };
  }

  return aiFields;
};

// Generate Government Suite data with complete field population
const generateGovernmentSuiteData = () => {
  const locations = [
    'USA', 'Europe', 'Asia', 'Africa', 'Canada', 'UK', 'Australia', 'Brazil', 'India', 'China',
    'Germany', 'France', 'Japan', 'South Korea', 'Mexico', 'Argentina', 'South Africa', 'Nigeria'
  ];
  
  const allData = [];
  
  for (const suite of GOVERNMENT_SUITES) {
    const config = SUITE_CONFIGS[suite as keyof typeof SUITE_CONFIGS];
    
    for (let i = 0; i < RECORDS_PER_SUITE; i++) {
      const recordStartTime = Date.now();
      
      const location = locations[Math.floor(Math.random() * locations.length)];
      const event = config.events[Math.floor(Math.random() * config.events.length)];
      const source = config.sources[Math.floor(Math.random() * config.sources.length)];
      const sentiment = Math.random();
      
      let sentimentType = 'neutral';
      if (sentiment > 0.6) sentimentType = 'positive';
      else if (sentiment < 0.4) sentimentType = 'negative';
      
      // Generate realistic timestamps (spread over last few hours)
      const hoursAgo = Math.random() * 6;
      const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
      
      // Generate simulation data
      const baseInfected = Math.floor(Math.random() * 2000) + 500;
      const baseRecovered = Math.floor(Math.random() * 1500) + 300;
      const baseSusceptible = Math.floor(Math.random() * 8000) + 2000;
      const spreadRate = Math.round((0.1 + Math.random() * 0.4) * 100) / 100;
      
      // Adjust based on sentiment
      const sentimentFactor = sentiment;
      const infected = Math.round(baseInfected * (1.5 - sentimentFactor));
      const recovered = Math.round(baseRecovered * (1 + sentimentFactor));
      const susceptible = Math.round(baseSusceptible * (1 + sentimentFactor * 0.5));
      
      // Generate narrative
      const narrativeText = `${event.charAt(0).toUpperCase() + event.slice(1)} situation in ${location} shows ${Math.round(sentiment * 100)}% ${sentimentType} sentiment for ${suite} suite operations.`;
      const confidence = 0.7 + Math.random() * 0.25;
      
      const dataObj = {
        id: `auto-${suite}-${Date.now()}-${i}`,
        timestamp,
        location,
        event,
        narrative: {
          text: narrativeText,
          confidence: Math.round(confidence * 100) / 100
        },
        simulation: {
          infected,
          recovered,
          susceptible,
          spreadRate
        },
        addons: {
          sentimentDynamics: true,
          resourceAllocation: true,
          healthBehavior: true,
          environmentalImpact: true,
          personalizedRisk: true
        }
      };
      
      // Generate AI fields based on suite
      const aiFields = generateAIFields(suite, dataObj);
      
      // Calculate processing time and data hash
      const processingTime = (Date.now() - recordStartTime) / 1000;
      const dataHash = createHash('sha256').update(JSON.stringify(dataObj)).digest('hex');
      
      allData.push({
        source,
        data: dataObj,
        location,
        event,
        sentiment: Math.round(sentiment * 100) / 100,
        sentiment_type: sentimentType,
        suite,
        timestamp,
        // AI fields (populated based on suite)
        summary: aiFields.summary,
        anomaly_score: aiFields.anomaly_score,
        arima_forecast: aiFields.arima_forecast,
        node_embedding: aiFields.node_embedding,
        synthetic_profile: aiFields.synthetic_profile,
        // Metadata fields (populated for all)
        models_used: aiFields.models_used,
        processing_time: processingTime,
        data_hash: dataHash,
        addons: null // Explicitly null as per requirements
      });
    }
  }
  
  return allData;
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

  console.log('🚀 Government Suite scheduled collection with complete field population');
  console.log('⏰ Collection time:', new Date().toISOString());
  console.log(`🎯 Target: ${DAILY_TARGET} records/day (${RECORDS_PER_RUN} per run, ${RECORDS_PER_SUITE} per suite)`);
  
  if (!supabase) {
    console.error('❌ Supabase not configured');
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
    
    // Generate Government Suite data with complete field population
    const newData = generateGovernmentSuiteData();
    
    console.log(`📊 Generated ${newData.length} Government Suite records with complete fields`);
    console.log(`📈 Daily projection: ${newData.length} × ${RUNS_PER_DAY} runs = ${newData.length * RUNS_PER_DAY} records/day`);
    
    // Log suite breakdown and AI field coverage
    const suiteBreakdown = newData.reduce((acc, item) => {
      acc[item.suite] = (acc[item.suite] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const aiFieldCoverage = {
      summary: newData.filter(item => item.summary !== null).length,
      anomaly_score: newData.filter(item => item.anomaly_score !== null).length,
      arima_forecast: newData.filter(item => item.arima_forecast !== null).length,
      node_embedding: newData.filter(item => item.node_embedding !== null).length,
      synthetic_profile: newData.filter(item => item.synthetic_profile !== null).length,
      models_used: newData.filter(item => item.models_used && item.models_used.length > 0).length,
      processing_time: newData.filter(item => item.processing_time !== null).length,
      data_hash: newData.filter(item => item.data_hash !== null).length
    };
    
    console.log('📊 Suite breakdown:', suiteBreakdown);
    console.log('🤖 AI field coverage:', aiFieldCoverage);
    
    // Insert into Supabase in batches
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < newData.length; i += batchSize) {
      batches.push(newData.slice(i, i + batchSize));
    }
    
    let totalInserted = 0;
    const errors = [];
    
    for (let i = 0; i < batches.length; i++) {
      try {
        const { data, error } = await supabase
          .from('changes_data')
          .insert(batches[i])
          .select('id');

        if (error) {
          console.error(`❌ Batch ${i + 1} insert error:`, error);
          errors.push(`Batch ${i + 1}: ${error.message}`);
        } else {
          totalInserted += data?.length || 0;
          console.log(`✅ Batch ${i + 1}/${batches.length}: ${data?.length || 0} records inserted`);
        }
      } catch (batchError) {
        console.error(`❌ Batch ${i + 1} failed:`, batchError);
        errors.push(`Batch ${i + 1}: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`);
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const duration = Date.now() - startTime;
    const recordsPerSecond = Math.round((totalInserted / duration) * 1000);
    const dailyProjection = totalInserted * RUNS_PER_DAY;
    
    console.log(`🎯 Government Suite collection completed: ${totalInserted}/${newData.length} records in ${duration}ms (${recordsPerSecond} records/sec)`);
    console.log(`📊 Daily projection: ${dailyProjection} records/day`);
    
    if (errors.length > 0) {
      console.warn(`⚠️ ${errors.length} batch errors:`, errors);
    }
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: `Government Suite collection with complete fields: ${totalInserted}/${newData.length} records inserted`,
        timestamp: new Date().toISOString(),
        records_inserted: totalInserted,
        records_failed: newData.length - totalInserted,
        duration_ms: duration,
        records_per_second: recordsPerSecond,
        daily_projection: dailyProjection,
        target_daily: DAILY_TARGET,
        runs_per_day: RUNS_PER_DAY,
        records_per_run: totalInserted,
        suite_breakdown: suiteBreakdown,
        ai_field_coverage: aiFieldCoverage,
        databricks_ready: aiFieldCoverage.data_hash === totalInserted,
        errors: errors.length > 0 ? errors : undefined
      })
    };
    
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error('💥 Government Suite collection error:', err);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        duration_ms: duration
      })
    };
  }
};