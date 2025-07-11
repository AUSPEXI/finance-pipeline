import React from 'react';
import { Github, Mail, Shield, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              SDSP Finance Suite
            </h2>
            <p className="text-sm text-blue-200">Secure Data Sharing Platform with zk-SNARKs and FCA/SEC Compliance</p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/AUSPEXI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="mailto:contact@auspexi.com" 
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <Mail className="h-6 w-6" />
            </a>
            <div className="text-yellow-400">
              <Lock className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-blue-800 text-center text-sm text-blue-300">
          <p>© {new Date().getFullYear()} AUSPEXI SDSP. All rights reserved.</p>
          <p className="mt-1">
            FCA Compliant • SEC Compliant • zk-SNARKs Enabled • UK GDPR • HIPAA • ISO 27001 • NIST • CISA
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="https://auspexi.com/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="https://auspexi.com/terms" className="hover:text-white">Terms of Service</a>
            <a href="https://auspexi.com/compliance" className="hover:text-white">Compliance</a>
            <a href="https://auspexi.com/security" className="hover:text-white">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;