import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Feedback {
  suite: string;
  field: string;
  action: string;
  params: { [key: string]: any };
  description?: string;
  client_id?: string;
  timestamp?: string;
}

export interface FeedbackResult {
  success: boolean;
  feedback_id?: string;
  estimated_improvement?: number;
  processing_time?: string;
  affected_models?: string[];
  next_deployment?: string;
  error?: string;
}

export async function submitFeedback(feedback: Feedback, zkProof?: string): Promise<FeedbackResult> {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    // Add timestamp and client info
    const enhancedFeedback = {
      ...feedback,
      timestamp: new Date().toISOString(),
      client_id: `client_${Date.now()}`,
      zk_proof: zkProof || null
    };

    // Store feedback in database
    const { data, error } = await supabase
      .from('client_feedback')
      .insert([enhancedFeedback])
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // Simulate meta-learning processing
    const estimatedImprovement = Math.random() * 0.15 + 0.05; // 5-20% improvement
    const processingTime = '2-3 hours';
    const affectedModels = getAffectedModels(feedback.suite, feedback.field);
    const nextDeployment = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();

    // In production, this would trigger the meta-learning pipeline
    await triggerMetaLearning(enhancedFeedback);

    return {
      success: true,
      feedback_id: data.id,
      estimated_improvement: estimatedImprovement,
      processing_time: processingTime,
      affected_models: affectedModels,
      next_deployment: nextDeployment
    };

  } catch (error) {
    console.error('Feedback submission failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function getAffectedModels(suite: string, field: string): string[] {
  const modelMap: Record<string, Record<string, string[]>> = {
    CHANGES: {
      sentiment: ['T5-Small', 'IsolationForest', 'ARIMA Enhanced', 'Node2Vec', 'VAE'],
      anomaly_score: ['IsolationForest'],
      arima_forecast: ['ARIMA Enhanced'],
      summary: ['T5-Small'],
      synthetic_profile: ['VAE'],
      node_embedding: ['Node2Vec']
    },
    POISON: {
      sentiment: ['T5-Small', 'IsolationForest', 'ARIMA Enhanced'],
      anomaly_score: ['IsolationForest'],
      arima_forecast: ['ARIMA Enhanced'],
      summary: ['T5-Small']
    },
    STRIVE: {
      sentiment: ['IsolationForest', 'Node2Vec'],
      anomaly_score: ['IsolationForest'],
      node_embedding: ['Node2Vec']
    },
    HYDRA: {
      sentiment: ['T5-Small', 'IsolationForest', 'VAE'],
      anomaly_score: ['IsolationForest'],
      summary: ['T5-Small'],
      synthetic_profile: ['VAE']
    },
    SIREN: {
      // No AI models directly associated with feedback for this suite
    },
    REFORM: {
      // No AI models directly associated with feedback for this suite
    },
    INSURE: {
      // No AI models directly associated with feedback for this suite
    },
    SHIELD: {
      // No AI models directly associated with feedback for this suite
    }
  };

  return modelMap[suite]?.[field] || ['General_Model'];
}

async function triggerMetaLearning(feedback: Feedback): Promise<void> {
  try {
    // In production, this would call the meta-learning API on Databricks
    const response = await fetch('/.netlify/functions/processMetaLearning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback)
    });

    if (!response.ok) {
      throw new Error(`Meta-learning API failed: ${response.statusText}`);
    }

    console.log('Meta-learning pipeline triggered successfully');
  } catch (error) {
    console.error('Failed to trigger meta-learning:', error);
    // Don't throw - feedback is still recorded even if meta-learning fails
  }
}

export async function getFeedbackHistory(clientId?: string): Promise<Feedback[]> {
  try {
    if (!supabase) {
      return [];
    }

    let query = supabase
      .from('client_feedback')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch feedback history:', error);
    return [];
  }
}

export async function getModelPerformanceMetrics(suite: string): Promise<any> {
  try {
    // Simulate fetching model performance metrics
    return {
      suite,
      current_accuracy: 0.85 + Math.random() * 0.1,
      improvement_trend: Math.random() > 0.5 ? 'increasing' : 'stable',
      last_updated: new Date().toISOString(),
      feedback_count: Math.floor(Math.random() * 50) + 10,
      avg_improvement: 0.08 + Math.random() * 0.05
    };
  } catch (error) {
    console.error('Failed to fetch performance metrics:', error);
    return null;
  }
}