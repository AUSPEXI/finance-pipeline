import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: '#f9fafb', margin: 0, padding: 0 }}
    >
      <Header />
      <main 
        className="flex-grow container mx-auto px-4 py-8"
        style={{ backgroundColor: '#f9fafb' }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
