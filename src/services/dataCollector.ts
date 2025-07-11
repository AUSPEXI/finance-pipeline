import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export interface EnhancedDataResponse {
  success: boolean;
  data: any[];
  addons: {
    core: string[];
    premium: string[];
  };
  performanceMetrics: {
    recordsCollected: number;
    modelUsage: {
      advancedPercentage: number;
      fallbackPercentage: number;
      modelsAvailable: number;
    };
    processingSpeed: number;
    dailyProjection: number;
  };
}

export interface SubscriptionTier {
  type: 'static' | 'premium' | 'enterprise';
  price: number;
  addons: {
    core: string[];
    premium: string[];
  };
  features: string[];
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  static: {
    type: 'static',
    price: 1800,
    addons: {
      core: ['riskAnalysis', 'fraudDetection', 'complianceMonitoring', 'marketAnalysis'],
      premium: []
    },
    features: [
      '8 Finance Suites',
      '4 Core Addons Bundled',
      'One-time Purchase',
      'Historical Data Access',
      'CSV/JSON Export'
    ]
  },
  premium: {
    type: 'premium',
    price: 600,
    addons: {
      core: ['riskAnalysis', 'fraudDetection', 'complianceMonitoring', 'marketAnalysis'],
      premium: []
    },
    features: [
      '8 Finance Suites',
      '4 Core Addons Bundled',
      'Real-time Streaming',
      'Monthly Updates',
      'API Access'
    ]
  },
  enterprise: {
    type: 'enterprise',
    price: 1500,
    addons: {
      core: ['riskAnalysis', 'fraudDetection', 'complianceMonitoring', 'marketAnalysis'],
      premium: ['portfolioOptimization', 'advancedForecasting', 'riskModeling', 'complianceAutomation']
    },
    features: [
      '8 Finance Suites',
      '4 Core + 4 Premium Addons',
      'Real-time Streaming',
      'Advanced AI Models',
      'Priority Support',
      'Custom Integrations'
    ]
  }
};

export const PREMIUM_ADDON_UPGRADE = {
  price: 200,
  addons: ['portfolioOptimization', 'advancedForecasting', 'riskModeling', 'complianceAutomation'],
  description: 'Unlock advanced AI capabilities including portfolio optimization, advanced forecasting, risk modeling, and compliance automation'
};

export async function collectFinanceData(): Promise<EnhancedDataResponse> { // Renamed function
  try {
    console.log('🚀 Triggering Finance Suite data collection...');
    
    // Try enhanced endpoint first, fallback to legacy
    let response;
    try {
      response = await axios.get('/.netlify/functions/cron-collect', { // Using cron-collect for finance data
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    } catch (enhancedError) {
      console.warn('⚠️ Enhanced endpoint failed, trying legacy:', enhancedError);
      response = await axios.get('/.netlify/functions/cron-collect', { // Fallback to same endpoint for now
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    }

    const { data, addons, model_usage, daily_projection, records_per_second } = response.data;
    
    return {
      success: true,
      data: data || [],
      addons: {
        core: ['riskAnalysis', 'fraudDetection', 'complianceMonitoring', 'marketAnalysis'],
        premium: ['portfolioOptimization', 'advancedForecasting', 'riskModeling', 'complianceAutomation']
      },
      performanceMetrics: {
        recordsCollected: data?.length || 0,
        modelUsage: {
          advancedPercentage: model_usage?.advanced_percentage || 0,
          fallbackPercentage: model_usage?.fallback_percentage || 0,
          modelsAvailable: model_usage?.models_available || 0
        },
        processingSpeed: records_per_second || 0,
        dailyProjection: daily_projection || 0
      }
    };
  } catch (error) {
    console.error('❌ Data collection failed:', error);
    return {
      success: false,
      data: [],
      addons: { core: [], premium: [] },
      performanceMetrics: {
        recordsCollected: 0,
        modelUsage: { advancedPercentage: 0, fallbackPercentage: 0, modelsAvailable: 0 },
        processingSpeed: 0,
        dailyProjection: 0
      }
    };
  }
}

export async function getSubscriptionTier(): Promise<SubscriptionTier> {
  try {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, defaulting to static tier');
      return SUBSCRIPTION_TIERS.static;
    }

    const { data } = await supabase
      .from('subscriptions')
      .select('type')
      .eq('category', 'Finance') // Updated category
      .single();
    
    const tierType = data?.type || 'static';
    return SUBSCRIPTION_TIERS[tierType];
  } catch (error) {
    console.warn('⚠️ Failed to fetch subscription tier, defaulting to static');
    return SUBSCRIPTION_TIERS.static;
  }
}

export async function upgradeToEnterprise(): Promise<{ success: boolean; message: string }> {
  try {
    if (!supabase) {
      return {
        success: false,
        message: 'Database not configured. Please contact support.'
      };
    }

    // In a real implementation, this would integrate with payment processing
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        category: 'Finance', // Updated category
        type: 'enterprise',
        upgraded_at: new Date().toISOString()
      });

    if (error) throw error;

    return {
      success: true,
      message: 'Successfully upgraded to Enterprise tier with premium addons!'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Upgrade failed. Please contact support.'
    };
  }
}

export async function purchasePremiumAddon(): Promise<{ success: boolean; message: string; upgradeUrl: string }> {
  // In production, this would redirect to payment processing
  return {
    success: true,
    message: 'Redirecting to premium addon checkout...',
    upgradeUrl: 'https://auspexi.com/checkout?addon=premium&price=200'
  };
}