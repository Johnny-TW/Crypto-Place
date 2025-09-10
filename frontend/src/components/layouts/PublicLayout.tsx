import React from 'react';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow container mx-auto px-4 py-8'>
        <div className='col-span-12 lg:col-span-10 xl:col-span-10'>
          {children}
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default PublicLayout;
