import React from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Database, Zap, TrendingUp, Globe } from 'lucide-react';
import { CollectionStatus } from '../../types';
import { formatDate, formatNumber } from '../../utils/formatters';

interface DataCollectorProps {
  status: CollectionStatus;
  lastUpdated: Date | null;
  error: string | null;
  dataCount: number;
  outliersCount: number;
  databaseStats?: any;
  performanceMetrics?: any;
}

const DataCollector: React.FC<DataCollectorProps> = ({
  status,
  lastUpdated,
  error,
  dataCount,
  outliersCount,
  databaseStats,
  performanceMetrics
}) => {
  const statusConfig = {
    idle: {
      text: 'Finance Suite real data scraping active',
      icon: <Clock className="h-5 w-5 text-secondary" />,
      color: 'bg-gray-100'
    },
    collecting: {
      text: 'Scraping real data from financial sources...',
      icon: <RefreshCw className="h-5 w-5 text-secondary animate-spin" />,
      color: 'bg-secondary-light/10'
    },
    processing: {
      text: 'Processing scraped financial data and generating insights...',
      icon: <RefreshCw className="h-5 w-5 text-secondary animate-spin" />,
      color: 'bg-secondary-light/10'
    },
    error: {
      text: error || 'Error collecting data',
      icon: <AlertTriangle className="h-5 w-5 text-error" />,
      color: 'bg-error-light/10'
    },
    success: {
      text: 'Finance Suite real data collection successful',
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      color: 'bg-success-light/10'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-primary mb-4">Real Data Scraping Pipeline</h2>
      
      <div className={`p-4 rounded-md mb-6 flex items-center ${currentStatus.color}`}>
        {currentStatus.icon}
        <span className="ml-2">{currentStatus.text}</span>
      </div>

      {/* Data Source Information */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Globe className="h-4 w-4 text-success mr-2" />
          <h3 className="font-semibold text-success">Financial Data Sources</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-success-light/10 p-3 rounded-md">
            <p className="text-xs text-gray-500">CREDRISE Suite (Real Data)</p>
            <p className="font-bold text-success">Bloomberg + FCA + SEC</p>
            <p className="text-xs text-gray-600">Live scraped financial data</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Other Suites (Mock Data)</p>
            <p className="font-bold text-gray-600">Generated Data</p>
            <p className="text-xs text-gray-600">Real scraping coming soon</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Last Updated</p>
          <p className="font-medium">
            {lastUpdated ? formatDate(lastUpdated.toISOString()) : 'Never'}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Current Session</p>
          <p className="font-medium">
            {formatNumber(dataCount)} collected 
            {outliersCount > 0 && (
              <span className="text-warning ml-2">
                ({outliersCount} flagged)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Database Statistics */}
      {databaseStats && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Database className="h-4 w-4 text-primary mr-2" />
            <h3 className="font-semibold text-primary">Database Statistics</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-primary-light/10 p-3 rounded-md">
              <p className="text-xs text-gray-500">Total Records</p>
              <p className="font-bold text-primary">{formatNumber(databaseStats.totalRecords)}</p>
            </div>
            
            <div className="bg-success-light/10 p-3 rounded-md">
              <p className="text-xs text-gray-500">Today</p>
              <p className="font-bold text-success">{formatNumber(databaseStats.recordsToday)}</p>
            </div>
            
            <div className="bg-secondary-light/10 p-3 rounded-md">
              <p className="text-xs text-gray-500">This Week</p>
              <p className="font-bold text-secondary">{formatNumber(databaseStats.recordsThisWeek)}</p>
            </div>
            
            <div className="bg-accent/10 p-3 rounded-md">
              <p className="text-xs text-gray-500">This Month</p>
              <p className="font-bold text-accent-dark">{formatNumber(databaseStats.recordsThisMonth)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Zap className="h-4 w-4 text-secondary mr-2" />
            <h3 className="font-semibold text-secondary">Performance Metrics</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500">Processing Speed</p>
              <p className="font-bold">{formatNumber(performanceMetrics.recordsPerSecond)} records/sec</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500">Total Time</p>
              <p className="font-bold">{(performanceMetrics.totalTime / 1000).toFixed(1)}s</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500">Data Quality</p>
              <p className="font-bold">{(performanceMetrics.dataQuality.qualityScore * 100).toFixed(1)}%</p>
            </div>
          </div>

          {/* Real vs Mock Data Breakdown */}
          {performanceMetrics.realScrapedCount !== undefined && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-success-light/10 p-3 rounded-md">
                <p className="text-xs text-gray-500">Real Scraped Data</p>
                <p className="font-bold text-success">
                  {formatNumber(performanceMetrics.realScrapedCount)} records
                </p>
                <p className="text-xs text-gray-600">
                  {Math.round(performanceMetrics.dataQuality.realDataPercentage * 100)}% of total
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500">Mock Generated Data</p>
                <p className="font-bold text-gray-600">
                  {formatNumber(performanceMetrics.mockGeneratedCount)} records
                </p>
                <p className="text-xs text-gray-600">
                  {Math.round((1 - performanceMetrics.dataQuality.realDataPercentage) * 100)}% of total
                </p>
              </div>
            </div>
          )}

          {/* Daily Projection Display */}
          {performanceMetrics.dailyProjection && (
            <div className="mt-3 p-3 bg-accent/10 rounded-md">
              <p className="text-xs text-gray-500">Daily Projection</p>
              <p className="font-bold text-accent-dark">
                {formatNumber(performanceMetrics.dailyProjection)} records/day
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {performanceMetrics.runsPerDay} runs × {performanceMetrics.recordsPerRun} records per run
              </p>
            </div>
          )}
        </div>
      )}

      {/* Daily Target Progress */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center mb-2">
          <TrendingUp className="h-4 w-4 text-accent-dark mr-2" />
          <h3 className="font-semibold text-accent-dark">Daily Target Progress</h3>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Target: 20,000 records/day</span>
            <span className="text-sm font-medium">
              {databaseStats ? `${formatNumber(databaseStats.recordsToday)}/20,000` : 'Loading...'}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${databaseStats ? Math.min((databaseStats.recordsToday / 20000) * 100, 100) : 0}%` 
              }}
            ></div>
          </div>
          
          {databaseStats && (
            <p className="text-xs text-gray-500 mt-1">
              {databaseStats.recordsToday >= 20000 
                ? '🎯 Daily target achieved!' 
                : `${formatNumber(20000 - databaseStats.recordsToday)} records remaining`
              }
            </p>
          )}

          {/* Collection Schedule Info */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Collection Schedule:</strong> Every 20 minutes (72 runs/day)
            </p>
            <p className="text-xs text-gray-500">
              <strong>Per Run:</strong> ~278 records across 8 Finance suites (~35 per suite)
            </p>
            <p className="text-xs text-success">
              <strong>Real Data:</strong> CREDRISE suite from Bloomberg, FCA, SEC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCollector;