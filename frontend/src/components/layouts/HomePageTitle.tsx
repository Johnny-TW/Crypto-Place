import React from 'react';
import tradeCrypto from '../../images/svg/ENBG_favicon.svg';
import '../../styles/layouts/HomePageTitle.scss';

const HomePageTitle: React.FC = () => {
  return (
    <header className='Header'>
      <img
        className='mx-auto w-full sm:w-2/3 md:w-2/3 lg:w-2/3 xl:w-1/3'
        src={tradeCrypto}
        alt='Stylized atom'
      />
      <h1 className='text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl'>
        EE40 - Crypto Place
      </h1>
      <p className='text-gray-900 mt-5'>
        Crypto Coin is the leading data platform for real-time cryptocurrency
        prices and market trends
        <br />
        Empowering investors with accurate and up-to-date blockchain data.
      </p>
    </header>
  );
};

export default HomePageTitle;
