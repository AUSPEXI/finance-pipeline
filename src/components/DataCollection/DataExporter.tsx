import React from 'react';
import { ShoppingCart, TrendingUp, Database, Cloud, ExternalLink, Mail, Shield } from 'lucide-react';

const DataExporter: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Shield className="h-5 w-5 text-primary mr-2" />
        <h2 className="text-xl font-bold text-primary">Finance Suite Streaming</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-secondary-light/10 rounded-md">
          <Database className="h-5 w-5 text-secondary mb-2" />
          <h3 className="font-semibold mb-1">8 Unified Suites</h3>
          <p className="text-sm text-gray-600">INSUREAI, SHIELD, CREDRISE, TRADEMARKET, CASHFLOW, CONSUME, TAXGUARD, RISKSHIELD</p>
        </div>
        
        <div className="p-4 bg-primary-light/10 rounded-md">
          <TrendingUp className="h-5 w-5 text-primary mb-2" />
          <h3 className="font-semibold mb-1">All 5 Addons Bundled</h3>
          <p className="text-sm text-gray-600">Risk Analysis, Fraud Detection, Compliance Monitoring, Market Analysis, Portfolio Optimization</p>
        </div>
        
        <div className="p-4 bg-accent/10 rounded-md">
          <Cloud className="h-5 w-5 text-accent-dark mb-2" />
          <h3 className="font-semibold mb-1">Streaming Platform</h3>
          <p className="text-sm text-gray-600">Real-time data feeds across all Finance categories</p>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-4">
        <div className="bg-success-light/10 p-3 rounded-md mb-4">
          <p className="text-sm text-success-dark">
            <strong>✓ New Unified Model:</strong> Stream all 8 Finance suites with bundled addons at $600/month. 
            CREDRISE suite also available as static dataset ($1,800 for 600,000 points).
          </p>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Access our comprehensive Finance Suite streaming platform with real-time data across insurance, cybersecurity, 
          credit scoring, trading, cash flow, consumer behavior, tax compliance, and risk management domains. All 5 advanced analytics addons included.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <a 
            href="https://auspexi.com"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-light transition-colors font-medium"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Subscribe at AUSPEXI
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
          
          <a 
            href="https://github.com/AUSPEXI/SDSP-Finance-Suite"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
          >
            View on GitHub
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="font-semibold text-sm mb-2">Finance Suite Pricing:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <strong>Streaming:</strong> $600/month (All 8 suites + 5 addons)</li>
              <li>• <strong>CREDRISE Static:</strong> $1,800 (600,000 points)</li>
              <li>• <strong>Enterprise:</strong> Custom pricing available</li>
            </ul>
          </div>
          
          <div className="p-3 bg-primary-light/10 rounded-md">
            <h4 className="font-semibold text-sm mb-2">Marketplace Availability:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Databricks Marketplace</li>
              <li>• Snowflake Data Marketplace</li>
              <li>• Datarade Platform</li>
              <li>• Bright Data Exchange</li>
            </ul>
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center mb-2">
            <Mail className="h-4 w-4 text-primary mr-2" />
            <span className="font-semibold text-sm">Contact for Finance Suite Access</span>
          </div>
          <p className="text-xs text-gray-600">
            <strong>Contact AUSPEXI</strong> for Finance Suite streaming subscriptions, enterprise licensing, 
            or custom data feeds. Unified platform serving all 8 Finance categories with comprehensive analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataExporter;