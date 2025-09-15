import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow container mx-auto px-4 py-8'>
        <div className='col-span-12 lg:col-span-10 xl:col-span-10'>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
