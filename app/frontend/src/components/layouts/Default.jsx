import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function Default({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="col-span-12 lg:col-span-10 xl:col-span-10">
          {children}
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Default;
