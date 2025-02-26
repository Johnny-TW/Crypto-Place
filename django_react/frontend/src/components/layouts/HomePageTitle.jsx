import React from 'react';
import tradeCrypto from '../../images/png/crypto_coin_logo.png';
import '../../styles/layouts/HomePageTitle.scss';

function HomePageTitle() {
  return (
    <header className="Header">
      <img className="mx-auto w-500px" src={tradeCrypto} alt="Stylized atom" />
      <h1 className="text-6xl font-bold mt-10">Crypto Coin</h1>
      <p className="text-gray-900 mt-5">
        Crypto Coin is the leading data platform for
        real-time cryptocurrency prices and market trends
        <br />
        Empowering investors with accurate and up-to-date blockchain data.
      </p>
    </header>
  );
}

export default HomePageTitle;
