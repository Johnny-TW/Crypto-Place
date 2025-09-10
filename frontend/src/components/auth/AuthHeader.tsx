import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  logoSrc: string;
}

function AuthHeader({
  title = '登入您的帳戶',
  subtitle = '歡迎回到 Crypto Place',
  logoSrc = '/src/images/svg/ENBG_logo.svg',
}: AuthHeaderProps) {
  return (
    <div>
      <a href='#' className='-m-1.5 p-1.5 flex justify-center'>
        <img alt='' src={logoSrc} className='h-20 w-auto' />
      </a>
      <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
        {title}
      </h2>
      <p className='mt-2 text-center text-sm text-gray-600'>{subtitle}</p>
    </div>
  );
}

export default AuthHeader;
