import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function Default({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow container mx-auto px-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Default;
