import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// SDSP Finance Suite App initialization
console.log('🚀 Starting SDSP Finance Suite App...');

// Get the app container
const appContainer = document.getElementById('app-container');

if (!appContainer) {
  console.error('App container not found');
} else {
  // Set immediate styles to prevent any flashing
  document.documentElement.style.cssText = `
    background: #f3f4f6 !important;
    color: #111827 !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100vh !important;
    overflow-x: hidden !important;
  `;
  
  document.body.style.cssText = `
    background: #f3f4f6 !important;
    color: #111827 !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100vh !important;
    overflow-x: hidden !important;
    width: 100% !important;
  `;
  
  // Create React root but don't render immediately
  try {
    const root = createRoot(appContainer);
    
    // Render React app
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('✅ SDSP Finance Suite App rendered to hidden container');
    
    // Named function for the outer setTimeout callback
    function prepareToShowApp() {
      console.log('🎯 React settled, preparing to show SDSP Finance app');
      
      // Named function for the inner setTimeout callback
      function showAppAfterDelay() {
        if (window.showApp) {
          window.showApp();
        }
      }
      
      // Additional delay to ensure everything is ready
      setTimeout(showAppAfterDelay, 1000);
    }
    
    // Wait for React to settle, then show the app
    setTimeout(prepareToShowApp, 500);
    
  } catch (error) {
    console.error('Failed to render SDSP Finance app:', error);
    
    // Show error in the app container
    appContainer.innerHTML = `
      <div style="
        display: flex; 
        align-items: center; 
        justify-content: center; 
        min-height: 100vh; 
        background: #f3f4f6;
        font-family: Inter, sans-serif;
        color: #6b7280;
        padding: 2rem;
      ">
        <div style="text-align: center; max-width: 500px;">
          <h1 style="color: #dc2626; margin-bottom: 16px; font-size: 24px;">SDSP Finance Application Error</h1>
          <p style="margin-bottom: 16px;">Failed to load SDSP Finance Suite App. Please refresh the page.</p>
          <p style="font-size: 14px; color: #9ca3af;">Error: ${error.message}</p>
        </div>
      </div>
    `;
    
    // Show the error
    if (window.showApp) {
      window.showApp();
    }
  }
}