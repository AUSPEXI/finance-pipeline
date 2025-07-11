import React from 'react';
import { Activity, TrendingUp, Users, Heart, Shield, Cpu, Zap } from 'lucide-react';
import { SimulationData } from '../../types';
import { formatNumber, formatPercentage } from '../../utils/formatters';

interface SIRModelProps {
  data: SimulationData;
  location: string;
  suite?: string;
}

const SIRModel: React.FC<SIRModelProps> = ({ data, location, suite = 'CREDRISE' }) => { // Default suite changed
  const { infected, recovered, susceptible, spreadRate } = data;
  const total = infected + recovered + susceptible;
  
  // Calculate percentages for the chart
  const infectedPercentage = (infected / total) * 100;
  const recoveredPercentage = (recovered / total) * 100;
  const susceptiblePercentage = (susceptible / total) * 100;

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-secondary p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            <div>
              <h3 className="font-bold">Enhanced Simulation: {location}</h3>
              <div className="flex items-center mt-1">
                <Shield className="h-3 w-3 mr-1" />
                <span className={`text-xs px-2 py-1 rounded-full text-white ${getSuiteColor(suite)}`}>
                  {suite} Suite
                </span>
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-purple-500 text-white">
                  20 AI Models
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex mb-6">
          {/* Stacked bar chart visualization */}
          <div className="w-full h-6 rounded-md overflow-hidden flex">
            <div 
              className="bg-error h-full" 
              style={{ width: `${infectedPercentage}%` }}
              title={`Infected: ${formatNumber(infected)}`}
            ></div>
            <div 
              className="bg-success h-full" 
              style={{ width: `${recoveredPercentage}%` }}
              title={`Recovered: ${formatNumber(recovered)}`}
            ></div>
            <div 
              className="bg-gray-200 h-full" 
              style={{ width: `${susceptiblePercentage}%` }}
              title={`Susceptible: ${formatNumber(susceptible)}`}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center mb-1">
              <Users className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-xs text-gray-500">Susceptible</span>
            </div>
            <p className="font-medium">{formatNumber(susceptible)}</p>
          </div>
          
          <div className="bg-error-light/10 p-3 rounded-md">
            <div className="flex items-center mb-1">
              <Activity className="h-4 w-4 text-error mr-1" />
              <span className="text-xs text-gray-500">Infected</span>
            </div>
            <p className="font-medium">{formatNumber(infected)}</p>
          </div>
          
          <div className="bg-success-light/10 p-3 rounded-md">
            <div className="flex items-center mb-1">
              <Heart className="h-4 w-4 text-success mr-1" />
              <span className="text-xs text-gray-500">Recovered</span>
            </div>
            <p className="font-medium">{formatNumber(recovered)}</p>
          </div>
          
          <div className="bg-secondary-light/10 p-3 rounded-md">
            <div className="flex items-center mb-1">
              <TrendingUp className="h-4 w-4 text-secondary mr-1" />
              <span className="text-xs text-gray-500">Spread Rate</span>
            </div>
            <p className="font-medium">{spreadRate.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Enhanced AI Model Processing Display */}
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-md border border-purple-200">
          <div className="flex items-center mb-2">
            <Cpu className="h-4 w-4 text-purple-600 mr-2" />
            <h4 className="text-sm font-medium text-purple-800">🆕 Enhanced with 20 AI Models</h4>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            This simulation incorporates advanced processing from 20 AI models including:
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
              <span className="text-purple-700">T5-Small Summarization</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
              <span className="text-red-700">IsolationForest Anomalies</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              <span className="text-blue-700">ARIMA Forecasting</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              <span className="text-green-700">Node2Vec Networks</span>
            </div>
            <div className="flex items-center col-span-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
              <span className="text-orange-700">VAE Generative Modeling + 15 more models</span>
            </div>
          </div>
        </div>
        
        {/* Standard Addon Enhancement Display (Updated for Finance) */}
        <div className="mb-4 p-3 bg-accent/10 rounded-md">
          <h4 className="text-sm font-medium text-accent-dark mb-2">Core Analytics (All Included)</h4>
          <div className="text-xs text-gray-600">
            Enhanced simulation incorporates risk analysis, fraud detection, compliance monitoring, 
            market analysis, and portfolio optimization for comprehensive {suite} suite analysis 
            with 1M records/day processing capability.
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Based on the current spread rate of {spreadRate.toFixed(2)}, this enhanced {suite} simulation projects that{' '}
              <span className="font-medium">{formatPercentage(infectedPercentage / 100)}</span> of the population is affected and{' '}
              <span className="font-medium">{formatPercentage(recoveredPercentage / 100)}</span> has recovered.
            </p>
            <div className="flex items-center text-xs text-purple-600 ml-4">
              <Zap className="h-3 w-3 mr-1" />
              <span>1M/day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIRModel;