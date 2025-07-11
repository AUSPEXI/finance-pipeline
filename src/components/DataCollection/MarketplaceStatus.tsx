import React from 'react';
import { Cloud, CheckCircle, AlertCircle, Clock, ExternalLink, Zap, Database, DollarSign } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

interface MarketplaceStatusProps {
  status: any;
}

const MarketplaceStatus: React.FC<MarketplaceStatusProps> = ({ status }) => {
  if (!status) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Marketplace Integration</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-500">Loading marketplace status...</p>
        </div>
      </div>
    );
  }

  const { marketplaces, summary, lastUpload, performance_info } = status;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Cloud className="h-5 w-5 text-primary mr-2" />
        <h2 className="text-xl font-bold text-primary">Finance Suite Marketplaces</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Status: </span>
          <span className={`ml-2 text-sm ${
            status.all_configured ? 'text-success' : 
            status.none_configured ? 'text-error' : 'text-warning'
          }`}>
            {summary}
          </span>
        </div>
        
        {lastUpload && (
          <div className="text-xs text-gray-500">
            Last upload: {new Date(lastUpload.timestamp).toLocaleString()}
            {lastUpload.performance && (
              <span className="ml-2">
                ({formatNumber(lastUpload.performance.recordsPerSecond)} records/sec)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Finance Suite Pricing Model */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <DollarSign className="h-4 w-4 text-accent-dark mr-2" />
          <h3 className="font-semibold text-accent-dark">Finance Suite Pricing</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-accent/10 p-3 rounded-md">
            <p className="text-xs text-gray-500">Streaming Subscription</p>
            <p className="font-bold text-accent-dark">$600/month</p>
            <p className="text-xs text-gray-600">All 8 suites + 5 addons</p>
          </div>
          
          <div className="bg-primary-light/10 p-3 rounded-md">
            <p className="text-xs text-gray-500">CREDRISE Static Dataset</p>
            <p className="font-bold text-primary">$1,800</p>
            <p className="text-xs text-gray-600">600,000 data points</p>
          </div>
        </div>
      </div>

      {/* Performance Information */}
      {performance_info && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Zap className="h-4 w-4 text-secondary mr-2" />
            <h3 className="font-semibold text-secondary">Daily Capacity</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-secondary-light/10 p-3 rounded-md">
              <p className="text-xs text-gray-500">Total API Requests/Day</p>
              <p className="font-bold text-secondary">{formatNumber(performance_info.total_daily_capacity)}</p>
            </div>
            
            <div className="bg-primary-light/10 p-3 rounded-md">
              <p className="text-xs text-gray-500">Estimated Records/Day</p>
              <p className="font-bold text-primary">{formatNumber(performance_info.estimated_daily_records)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {marketplaces.map((marketplace: any) => (
          <div 
            key={marketplace.platform}
            className={`p-4 rounded-md border ${
              marketplace.configured 
                ? 'bg-success-light/10 border-success-light' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{marketplace.name}</h3>
              {marketplace.configured ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4 text-gray-400" />
              )}
            </div>
            
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  marketplace.url_set ? 'bg-success' : 'bg-gray-300'
                }`}></span>
                API URL: {marketplace.url_set ? 'Configured' : 'Not set'}
              </div>
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  marketplace.key_set ? 'bg-success' : 'bg-gray-300'
                }`}></span>
                API Key: {marketplace.key_set ? 'Configured' : 'Not set'}
              </div>
              
              {marketplace.configured && (
                <>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span>Rate Limit:</span>
                      <span className="font-medium">{marketplace.rate_limit.requests}/{marketplace.rate_limit.per}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Batch Size:</span>
                      <span className="font-medium">{formatNumber(marketplace.batch_size)}</span>
                    </div>
                  </div>
                  
                  {marketplace.queue_stats && (
                    <div className="mt-1">
                      <div className="flex justify-between">
                        <span>Queue:</span>
                        <span className={`font-medium ${
                          marketplace.queue_stats.pending > 0 ? 'text-warning' : 'text-success'
                        }`}>
                          {marketplace.queue_stats.pending} pending
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {lastUpload?.results && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <h3 className="font-semibold text-sm mb-3">Last Upload Results</h3>
          
          {lastUpload.results.successful.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <CheckCircle className="h-4 w-4 text-success mr-2" />
                <span className="text-sm font-medium text-success">Successful Uploads</span>
              </div>
              <div className="text-xs text-gray-600 ml-6">
                {lastUpload.results.successful.join(', ')}
              </div>
              <div className="text-xs text-gray-500 ml-6">
                {formatNumber(lastUpload.results.totalRecords)} records uploaded
              </div>
            </div>
          )}
          
          {lastUpload.results.failed.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <AlertCircle className="h-4 w-4 text-error mr-2" />
                <span className="text-sm font-medium text-error">Failed Uploads</span>
              </div>
              <div className="text-xs text-gray-600 ml-6">
                {lastUpload.results.failed.map((f: any) => (
                  <div key={f.platform}>{f.platform}: {f.error}</div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-2">
            {lastUpload.results.summary}
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <div className="bg-primary-light/10 p-3 rounded-md mb-3">
          <div className="flex items-center mb-2">
            <Database className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Finance Suite Features</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• <strong>8 Unified Suites:</strong> INSUREAI, SHIELD, CREDRISE, TRADEMARKET, CASHFLOW, CONSUME, TAXGUARD, RISKSHIELD</div>
            <div>• <strong>5 Bundled Addons:</strong> All analytics included at $600/month</div>
            <div>• <strong>High Volume:</strong> 20,000+ records/day across all suites</div>
            <div>• <strong>Static Option:</strong> CREDRISE dataset available at $1,800</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <p className="mb-2">
            <strong>For Finance Suite streaming:</strong> Configure marketplace API credentials in environment variables.
            The system automatically distributes data across all 8 suites with bundled addon features.
          </p>
          <p>
            Required variables: VITE_DATABRICKS_API_URL, VITE_DATABRICKS_API_KEY, VITE_SNOWFLAKE_API_URL, 
            VITE_SNOWFLAKE_API_KEY, VITE_DATARADE_API_URL, VITE_DATARADE_API_KEY, 
            VITE_BRIGHTDATA_API_URL, VITE_BRIGHTDATA_API_KEY
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceStatus;