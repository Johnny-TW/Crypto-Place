import React from 'react';

export default function Example() {
  return (
    <div className="py-20 sm:py-30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg/8 font-semibold text-gray-900">
          CoinGecko NFT Data API
        </h2>
        <p className="text-center">
          Proudly powering over thousands of industry builders worldwide with accurate, live & independent data
        </p>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <img
            alt="Metamask"
            height="50px"
            className="tw-inline dark:tw-hidden"
            loading="lazy"
            src="https://static.coingecko.com/s/api_partners/metamask-0bc42c3b5bbcf0222c197eb87b71d475409bd8cc6cffb50822654a13fa42c5a9.png"
          />
          <img
            alt="Etherscan"
            height="50px"
            className="tw-inline dark:tw-hidden"
            loading="lazy"
            src="https://static.coingecko.com/s/api_partners/etherscan-b3dd5361beb0af6c8c589eb2f8a095f2b69b44043a071ca35ea69614a02b3aec.png"

          />
          <img
            alt="Trezor"
            height="50px"
            className="tw-inline dark:tw-hidden"
            loading="lazy"
            src="https://static.coingecko.com/s/api_partners/black_crypto.com-3afd39259c13a107ec7a88119a9851674b5e78c5496c9f8c262efa034f43ce9d.svg"
          />
          <img
            alt="AAVE"
            height="50px"
            className="tw-inline dark:tw-hidden"
            loading="lazy"
            src="https://static.coingecko.com/s/api_partners/black_ledger-fd17ca2c9ff84baf17bbe52d7a6adb24bf53a854e17dfa7d26aff140f4a81567.svg"
          />
          <img
            alt="Chainlink"
            height="50px"
            className="tw-inline dark:tw-hidden tw-max-h-[65px]"
            loading="lazy"
            src="https://static.coingecko.com/s/api_partners/chainlink-5e24baf36e1a0f3bd015143e827f6ae44d23f1ad4de1ecef16db730dc3d6048e.png"
          />
        </div>
      </div>
    </div>
  )
}