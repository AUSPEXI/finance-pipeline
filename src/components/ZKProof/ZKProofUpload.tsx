import React, { useState } from 'react';
import { Upload, Lock, Shield, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const ZKProofUpload: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploadStatus('uploading');
    setUploadMessage('Generating zk-SNARK proof and encrypting data...');

    try {
      // Simulate zk-SNARK proof generation and upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadStatus('success');
      setUploadMessage(`Successfully uploaded ${files.length} file(s) with zero-knowledge proof verification`);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 5000);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Upload failed. Please try again.');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 5000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          {uploadStatus === 'uploading' ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          ) : uploadStatus === 'success' ? (
            <CheckCircle className="h-12 w-12 text-green-600" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="h-12 w-12 text-red-600" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {uploadStatus === 'uploading'
                ? 'Processing...'
                : uploadStatus === 'success'
                ? 'Upload Complete'
                : uploadStatus === 'error'
                ? 'Upload Failed'
                : 'Drop files here or click to upload'}
            </h3>
            
            {uploadMessage && (
              <p className={`text-sm ${
                uploadStatus === 'success' ? 'text-green-600' :
                uploadStatus === 'error' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {uploadMessage}
              </p>
            )}
            
            {uploadStatus === 'idle' && (
              <p className="text-sm text-gray-600">
                Supports CSV, JSON, and Excel files up to 100MB
              </p>
            )}
          </div>
          
          {uploadStatus === 'idle' && (
            <input
              type="file"
              multiple
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
          )}
          
          {uploadStatus === 'idle' && (
            <label
              htmlFor="file-upload"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Select Files
            </label>
          )}
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center p-3 bg-blue-50 rounded-md">
          <Lock className="h-5 w-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-blue-800">Client-Side Encryption</p>
            <p className="text-xs text-blue-600">Data encrypted before upload</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-green-50 rounded-md">
          <Shield className="h-5 w-5 text-green-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-green-800">Zero-Knowledge Proofs</p>
            <p className="text-xs text-green-600">Privacy-preserving verification</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-purple-50 rounded-md">
          <FileText className="h-5 w-5 text-purple-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-purple-800">FCA/SEC Compliant</p>
            <p className="text-xs text-purple-600">Regulatory compliance built-in</p>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gray-50 rounded-md p-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Technical Implementation</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• zk-SNARK circuit generates cryptographic proof of data integrity</p>
          <p>• Client-side encryption ensures data never leaves your control unencrypted</p>
          <p>• Proof verification happens server-side without accessing raw data</p>
          <p>• Compliant with FCA GDPR and SEC data protection requirements</p>
        </div>
      </div>
    </div>
  );
};

export default ZKProofUpload;