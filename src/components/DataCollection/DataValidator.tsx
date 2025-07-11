import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { ProcessedData } from '../../types';
import { formatDate } from '../../utils/formatters';

interface DataValidatorProps {
  outliers: ProcessedData[];
}

const DataValidator: React.FC<DataValidatorProps> = ({ outliers }) => {
  if (outliers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Data Validation</h2>
        
        <div className="bg-success-light/10 p-4 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 text-success" />
          <span className="ml-2">All data passed validation checks</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-primary mb-4">Data Validation</h2>
      
      <div className="bg-warning-light/10 p-4 rounded-md flex items-center mb-4">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <span className="ml-2">{outliers.length} data points flagged for manual review</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {outliers.map((outlier) => {
              // Determine validation issue
              let issue = '';
              if (outlier.sentiment > 0.9 || outlier.sentiment < 0.1) {
                issue = 'Extreme sentiment value';
              } else if (!outlier.location || outlier.location === '') {
                issue = 'Missing location';
              } else if (!outlier.event || outlier.event === '') {
                issue = 'Missing event';
              } else {
                issue = 'Multiple issues';
              }
              
              return (
                <tr key={outlier.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{outlier.source}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(outlier.timestamp)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{outlier.location || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{outlier.event || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{outlier.sentiment.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-error">{issue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataValidator;
