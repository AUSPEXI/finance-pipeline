import React from 'react';
import { Shield, Lock, Brain } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Shield className="h-8 w-8 text-yellow-400 mr-2" />
          <div>
            <h1 className="text-xl font-bold">SDSP Finance Suite App</h1>
            <p className="text-xs text-blue-200">Secure Data Sharing Platform with zk-SNARKs</p>
          </div>
        </div>
        
        <nav className="flex space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-700">
            <Lock className="h-4 w-4" />
            <span className="text-sm">FCA/SEC Compliant</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-700">
            <Brain className="h-4 w-4" />
            <span className="text-sm">AI Enhanced</span>
          </div>
          <a 
            href="https://github.com/AUSPEXI/SDSP-Finance-Suite" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 rounded-md bg-yellow-500 text-blue-800 hover:bg-yellow-400 transition-colors font-medium"
          >
            GitHub
          </a>
          <a 
            href="https://auspexi.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 rounded-md bg-white text-blue-800 hover:bg-gray-100 transition-colors font-medium"
          >
            AUSPEXI
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;