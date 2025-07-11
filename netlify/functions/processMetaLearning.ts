import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface FeedbackData {
  suite: string;
  field: string;
  action: string;
  params: { [key: string]: any };
  description?: string;
  client_id?: string;
  timestamp?: string;
}

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

  try {
    console.log('🧠 Starting meta-learning feedback processing for Finance Suite...');
    
    const feedback: FeedbackData = JSON.parse(event.body || '{}');
    
    if (!feedback.suite || !feedback.field || !feedback.action) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Missing required feedback fields'
        })
      };
    }

    // Store feedback in database for meta-learning
    if (supabase) {
      try {
        const { error } = await supabase
          .from('client_feedback')
          .insert([{
            ...feedback,
            processed_at: new Date().toISOString(),
            status: 'processing'
          }]);

        if (error) {
          console.warn('Failed to store feedback:', error);
        } else {
          console.log('✅ Feedback stored for meta-learning');
        }
      } catch (dbError) {
        console.warn('Database storage failed:', dbError);
      }
    }

    // Extract features from feedback for meta-learning
    const features = extractFeatures(feedback);
    console.log('📊 Extracted features:', features);

    // Simulate meta-learning model prediction
    const adjustments = await simulateMetaLearning(features);
    console.log('🎯 Generated model adjustments:', adjustments);

    // Simulate model update process
    const updateResult = await simulateModelUpdate(feedback.suite, adjustments);
    console.log('🔄 Model update result:', updateResult);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        feedback_processed: true,
        features_extracted: features,
        adjustments_generated: adjustments,
        model_update_scheduled: updateResult.scheduled,
        estimated_deployment: updateResult.deployment_time,
        affected_models: updateResult.affected_models,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Meta-learning processing error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Meta-learning processing failed',
        timestamp: new Date().toISOString()
      })
    };
  }
};

function extractFeatures(feedback: FeedbackData): number[] {
  // Extract numerical features from feedback for meta-learning
  const features = [];
  
  // Suite encoding (one-hot style)
  const suites = ['INSUREAI', 'SHIELD', 'CREDRISE', 'TRADEMARKET', 'CASHFLOW', 'CONSUME', 'TAXGUARD', 'RISKSHIELD'];
  const suiteIndex = suites.indexOf(feedback.suite);
  features.push(suiteIndex >= 0 ? suiteIndex / suites.length : 0);
  
  // Field encoding
  const fields = ['credit_score', 'transaction_volume', 'risk_weight', 'anomaly_score', 'arima_forecast', 'summary', 'synthetic_profile', 'node_embedding'];
  const fieldIndex = fields.indexOf(feedback.field);
  features.push(fieldIndex >= 0 ? fieldIndex / fields.length : 0);
  
  // Action encoding
  const actions = ['adjust_distribution', 'prune_outliers', 'weight_adjustment', 'feature_enhancement', 'correlation_tuning'];
  const actionIndex = actions.indexOf(feedback.action);
  features.push(actionIndex >= 0 ? actionIndex / actions.length : 0);
  
  // Parameter values
  features.push(feedback.params.mean || 0);
  features.push(feedback.params.variance || 0.1);
  features.push(feedback.params.threshold || 0.5);
  
  // Text features (simplified)
  const descriptionLength = feedback.description ? feedback.description.length / 1000 : 0;
  features.push(Math.min(descriptionLength, 1)); // Normalize to 0-1
  
  // Temporal features
  const hour = new Date().getHours() / 24;
  features.push(hour);
  
  return features;
}

async function simulateMetaLearning(features: number[]): Promise<any> {
  // Simulate meta-learning model prediction
  // In production, this would call Databricks ML API
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate realistic adjustments based on features
  const adjustments = {
    learning_rate: 0.001 + Math.random() * 0.009, // 0.001-0.01
    weight_decay: Math.random() * 0.0001, // 0-0.0001
    dropout_rate: 0.1 + Math.random() * 0.3, // 0.1-0.4
    batch_size_multiplier: 0.8 + Math.random() * 0.4, // 0.8-1.2
    feature_weights: features.map(f => f * (0.9 + Math.random() * 0.2)), // Slight adjustments
    regularization: Math.random() * 0.01 // 0-0.01
  };
  
  return adjustments;
}

async function simulateModelUpdate(suite: string, adjustments: any): Promise<any> {
  // Simulate model update scheduling
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const modelMap: Record<string, string[]> = {
    INSUREAI: ['T5-Small', 'IsolationForest', 'VAE'],
    SHIELD: ['T5-Small', 'IsolationForest'],
    CREDRISE: ['T5-Small', 'IsolationForest', 'ARIMA Enhanced', 'Node2Vec', 'VAE'],
    TRADEMARKET: ['T5-Small', 'IsolationForest', 'ARIMA Enhanced'],
    CASHFLOW: ['ARIMA Enhanced', 'Node2Vec'],
    CONSUME: ['T5-Small', 'VAE'],
    TAXGUARD: ['Real_Data_Only'],
    RISKSHIELD: ['IsolationForest', 'Node2Vec']
  };
  
  const affectedModels = modelMap[suite] || ['General_Model'];
  const deploymentTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
  
  return {
    scheduled: true,
    affected_models: affectedModels,
    deployment_time: deploymentTime.toISOString(),
    adjustments_applied: Object.keys(adjustments).length,
    estimated_improvement: 0.05 + Math.random() * 0.15 // 5-20% improvement
  };
}