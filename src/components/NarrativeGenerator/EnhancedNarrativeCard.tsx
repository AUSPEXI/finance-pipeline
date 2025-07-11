import React from 'react';
import { MessageSquare, AlertCircle, Calendar, Flag, BarChart2, Shield, Crown, Zap, Star } from 'lucide-react';
import { ProcessedData } from '../../types';
import { formatDate, formatPercentage } from '../../utils/formatters';

interface EnhancedNarrativeCardProps {
  data: ProcessedData;
  showPremiumAddons?: boolean;
}

const EnhancedNarrativeCard: React.FC<EnhancedNarrativeCardProps> = ({ 
  data, 
  showPremiumAddons = false 
}) => {
  // Helper to determine sentiment color (retained for narrative)
  const getSentimentColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-gray-500';
    }
  };
  
  // Helper to determine confidence badge color
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return 'bg-success-light/20 text-success';
    } else if (confidence >= 0.5) {
      return 'bg-warning-light/20 text-warning';
    } else {
      return 'bg-error-light/20 text-error';
    }
  };

  // Helper to get suite color
  const getSuiteColor = (suite: string) => {
    const colors = {
      INSUREAI: 'bg-blue-500',
      SHIELD: 'bg-cyan-500',
      CREDRISE: 'bg-green-500',
      TRADEMARKET: 'bg-orange-500',
      CASHFLOW: 'bg-purple-500',
      CONSUME: 'bg-pink-500',
      TAXGUARD: 'bg-indigo-500',
      RISKSHIELD: 'bg-red-500'
    };
    return colors[suite as keyof typeof colors] || 'bg-gray-500';
  };

  // FIXED: Extract enhanced addon data with safe property access
  const coreAddons = data.addons || {};
  const premiumAddons = showPremiumAddons ? (data.addons || {}) : {};

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-primary p-4 text-white">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <div>
              <h3 className="font-bold">Enhanced AI Narrative</h3>
              <div className="flex items-center mt-1">
                <Shield className="h-3 w-3 mr-1" />
                <span className={`text-xs px-2 py-1 rounded-full text-white ${getSuiteColor(data.suite)}`}>
                  {data.suite}
                </span>
                {showPremiumAddons && (
                  <Crown className="h-3 w-3 ml-2 text-yellow-300" />
                )}
              </div>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceBadge(data.narrative.confidence)}`}>
            {formatPercentage(data.narrative.confidence)} confidence
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-lg font-medium mb-4">{data.narrative.text}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{formatDate(data.timestamp)}</span>
          </div>
          
          <div className="flex items-center">
            <Flag className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{data.location}</span>
          </div>
        </div>
        
        {/* Enhanced Core Addons Display (Updated for Finance) */}
        <div className="mb-4 p-3 bg-accent/10 rounded-md">
          <div className="flex items-center mb-2">
            <Zap className="h-4 w-4 text-accent-dark mr-2" />
            <h4 className="text-sm font-medium text-accent-dark">Core Addons (Included)</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                Risk Analysis
              </span>
              <span className="font-medium">{coreAddons.riskAnalysis ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                Fraud Detection
              </span>
              <span className="font-medium">{coreAddons.fraudDetection ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                Compliance Monitoring
              </span>
              <span className="font-medium">{coreAddons.complianceMonitoring ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                Market Analysis
              </span>
              <span className="font-medium">{coreAddons.marketAnalysis ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        {/* Premium Addons Display (if enabled) */}
        {showPremiumAddons && (
          <div className="mb-4 p-3 bg-purple-50 rounded-md border border-purple-200">
            <div className="flex items-center mb-2">
              <Crown className="h-4 w-4 text-purple-600 mr-2" />
              <h4 className="text-sm font-medium text-purple-800">Premium Addons</h4>
              <span className="ml-auto text-xs text-purple-600 font-medium">Enterprise</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Star className="w-2 h-2 text-purple-600 mr-2" />
                  Portfolio Optimization
                </span>
                <span className="font-medium text-purple-700">
                  {premiumAddons.portfolioOptimization ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Star className="w-2 h-2 text-purple-600 mr-2" />
                  Advanced Forecasting
                </span>
                <span className="font-medium text-purple-700">
                  {premiumAddons.advancedForecasting ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Star className="w-2 h-2 text-purple-600 mr-2" />
                  Risk Modeling
                </span>
                <span className="font-medium text-purple-700">
                  {premiumAddons.riskModeling ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Star className="w-2 h-2 text-purple-600 mr-2" />
                  Compliance Automation
                </span>
                <span className="font-medium text-purple-700">
                  {premiumAddons.complianceAutomation ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Prompt for Non-Premium Users */}
        {!showPremiumAddons && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-md border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <Crown className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">Unlock Premium Addons</span>
                </div>
                <p className="text-xs text-purple-700">
                  Portfolio optimization, advanced forecasting, risk modeling, and compliance automation
                </p>
              </div>
              <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-xs hover:bg-purple-700 transition-colors">
                +$200/mo
              </button>
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center mb-2">
            <BarChart2 className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium">Financial Metrics</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <p><span className="font-medium">Credit Score:</span> {data.credit_score}</p>
            <p><span className="font-medium">Transaction Volume:</span> {data.transaction_volume.toLocaleString()}</p>
            <p><span className="font-medium">Risk Weight:</span> {data.risk_weight.toFixed(2)}</p>
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            Key financial metrics from {data.source}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedNarrativeCard;