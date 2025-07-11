import React from 'react';
import { 
  Shield, 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Users, 
  FileText, 
  Lock 
} from 'lucide-react';
import { FinanceSuite, SuiteConfig } from '../types';

interface SuiteSelectorProps {
  selectedSuite: FinanceSuite;
  onSelectSuite: (suite: FinanceSuite) => void;
  demoMode?: boolean;
}

const suiteConfigs: SuiteConfig[] = [
  {
    name: 'INSUREAI',
    displayName: 'INSUREAI',
    description: 'Insurance risk assessment and analytics',
    primaryEvent: 'insurance',
    color: 'bg-blue-500',
    icon: 'Shield'
  },
  {
    name: 'SHIELD',
    displayName: 'SHIELD',
    description: 'Cybersecurity threat intelligence',
    primaryEvent: 'cyber',
    color: 'bg-cyan-500',
    icon: 'Lock'
  },
  {
    name: 'CREDRISE',
    displayName: 'CREDRISE',
    description: 'Credit scoring and risk evaluation',
    primaryEvent: 'credit',
    color: 'bg-green-500',
    icon: 'CreditCard'
  },
  {
    name: 'TRADEMARKET',
    displayName: 'TRADEMARKET',
    description: 'Trading signals and market analysis',
    primaryEvent: 'trading',
    color: 'bg-orange-500',
    icon: 'TrendingUp'
  },
  {
    name: 'CASHFLOW',
    displayName: 'CASHFLOW',
    description: 'Cash flow forecasting and management',
    primaryEvent: 'cashflow',
    color: 'bg-purple-500',
    icon: 'DollarSign'
  },
  {
    name: 'CONSUME',
    displayName: 'CONSUME',
    description: 'Consumer behavior analytics',
    primaryEvent: 'consumer',
    color: 'bg-pink-500',
    icon: 'Users'
  },
  {
    name: 'TAXGUARD',
    displayName: 'TAXGUARD',
    description: 'Tax compliance and optimization',
    primaryEvent: 'tax',
    color: 'bg-indigo-500',
    icon: 'FileText'
  },
  {
    name: 'RISKSHIELD',
    displayName: 'RISKSHIELD',
    description: 'Risk management and mitigation',
    primaryEvent: 'risk',
    color: 'bg-red-500',
    icon: 'PieChart'
  }
];

const iconComponents = {
  Shield,
  Lock,
  CreditCard,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  PieChart
};

const SuiteSelector: React.FC<SuiteSelectorProps> = ({ 
  selectedSuite, 
  onSelectSuite, 
  demoMode = false 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-primary">Finance Suites</h2>
        {demoMode && (
          <span className="px-3 py-1 bg-accent/20 text-accent-dark rounded-full text-sm font-medium">
            Demo Mode
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {suiteConfigs.map((suite) => {
          const IconComponent = iconComponents[suite.icon as keyof typeof iconComponents];
          const isSelected = selectedSuite === suite.name;
          
          return (
            <button
              key={suite.name}
              onClick={() => onSelectSuite(suite.name)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <IconComponent className={`h-6 w-6 mb-2 ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`} />
                <span className={`text-xs font-medium mb-1 ${
                  isSelected ? 'text-white' : 'text-gray-900'
                }`}>
                  {suite.displayName}
                </span>
                <span className={`text-xs ${
                  isSelected ? 'text-gray-200' : 'text-gray-500'
                }`}>
                  {suite.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-primary-light/10 rounded-md">
        <p className="text-sm text-primary-dark">
          <strong>All 5 Addons Bundled:</strong> Risk Analysis, Fraud Detection, 
          Compliance Monitoring, Market Analysis, and Portfolio Optimization included 
          in every suite.
        </p>
      </div>
    </div>
  );
};

export default SuiteSelector;