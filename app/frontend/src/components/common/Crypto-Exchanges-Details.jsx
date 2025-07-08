import { useEffect, useMemo } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  GlobeAltIcon,
  LockClosedIcon,
  ServerIcon,
} from '@heroicons/react/20/solid';

import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import Breadcrumb from '@components/common/Breadcrumbs';
import LogoClouds from '@components/common/LogoClouds';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function CryptoExchangesDetails() {
  const dispatch = useDispatch();
  const { exchangeId } = useParams();
  const { exchangeDetails, loading: isLoading } = useSelector(
    state => state.cryptoExchangesDetails
  );

  console.log(exchangeId);

  useEffect(() => {
    if (exchangeId) {
      dispatch({ type: 'FETCH_EXCHANGE_DETAILS', payload: exchangeId });
    }
  }, [exchangeId, dispatch]);

  const columns = useMemo(
    () => [
      {
        field: 'coins',
        headerName: 'Coins',
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'pair',
        headerName: 'Trading Pair',
        minWidth: 150,
        align: 'center',
      },
      {
        field: 'price',
        headerName: 'Price',
        minWidth: 120,
        align: 'right',
      },
      {
        field: 'volume',
        headerName: '24h Volume',
        minWidth: 150,
        align: 'right',
      },
      {
        field: 'spread',
        headerName: 'Spread',
        minWidth: 100,
        align: 'right',
      },
      {
        field: 'updated',
        headerName: 'Last Updated',
        minWidth: 180,
        align: 'center',
      },
      {
        field: 'trust_score',
        headerName: 'Trust Score',
        minWidth: 120,
        align: 'center',
      },
    ],
    []
  );

  const processedTickers = useMemo(() => {
    if (!exchangeDetails?.tickers) return [];

    return exchangeDetails.tickers.map(ticker => ({
      coins: `${ticker.coin_id}`,
      name: `${ticker.name}`,
      base: `${ticker.base}_${ticker.target}_${ticker.market.identifier}`,
      id: `${ticker.base}_${ticker.target}_${ticker.market.identifier}`,
      pair: `${ticker.base}/${ticker.target}`,
      price: Number(ticker.last).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      }),
      volume: Number(ticker.converted_volume.usd).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      spread: `${(ticker.bid_ask_spread_percentage || 0).toFixed(3)}%`,
      updated: new Date(ticker.last_fetch_at).toLocaleString(),
      trade_url: ticker.trade_url,
      base_volume: Number(ticker.volume).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      }),
      market_name: ticker.market.name,
      trust_score: ticker.trust_score,
    }));
  }, [exchangeDetails?.tickers]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
      </div>
    );
  }

  const links = [
    {
      name: 'Facebook',
      link: exchangeDetails?.facebook_url,
      icon: GlobeAltIcon,
    },
    {
      name: 'Discord',
      link: exchangeDetails?.url,
      icon: LockClosedIcon,
    },
    {
      name: 'Reddit',
      link: exchangeDetails?.reddit_url,
      icon: ServerIcon,
    },
  ];

  const paginationModel = { page: 0, pageSize: 30 };

  return (
    <div className='overflow-hidden py-20 sm:py-10'>
      <div className='mx-auto max-w-1xl lg:px-8'>
        <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2'>
          {/* NFT Performance */}
          <div className=''>
            <Breadcrumb />
            <div className='w-full max-w-full'>
              <div className='flex items-center space-x-4 mt-5'>
                <img
                  className='w-16 h-16 rounded-2xl shadow-lg object-cover border-4 border-white'
                  src={exchangeDetails?.image}
                  alt={exchangeDetails?.name}
                />
                <div className='text-left flex-col items-center space-y-2'>
                  <p className='text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-1xl'>
                    {exchangeDetails?.name}
                  </p>
                </div>
              </div>
              {/* Applicant Information */}
              <div>
                <div className='px-4 sm:px-0 mt-5'>
                  <h3 className='text-base/7 font-semibold text-gray-900'>
                    Applicant Information
                  </h3>
                  <p className='mt-1 max-w-2xl text-sm/6 text-gray-500'>
                    Personal details and application.
                  </p>
                </div>
                <div className='mt-6 border-t border-gray-300'>
                  <dl className='divide-y divide-gray-300'>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Trust Score
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.trust_score}
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        24h Trading Volume
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.trade_volume_24h_btc} BTC
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        24h Trading Volume Btc Normalized
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.trade_volume_24h_btc_normalized}
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Country
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.country}
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Year Established
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.year_established}
                      </dd>
                    </div>
                    <div className='px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                      <dt className='text-sm/6 font-semibold text-gray-900'>
                        Pairs
                      </dt>
                      <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                        {exchangeDetails?.pairs}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              {/* Info Information */}
              <dl className='mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none'>
                {links.map(link => (
                  <div key={link.name} className='relative pl-9'>
                    <dt className='inline font-semibold text-gray-900'>
                      <link.icon
                        aria-hidden='true'
                        className='absolute left-1 top-1 h-5 w-5 text-indigo-600'
                      />
                      {link.name}
                    </dt>
                    <br />
                    <a
                      className='inline'
                      href={link.link}
                      aria-label={link.name}
                    >
                      {link.link}
                    </a>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className=''>
            <div className='relative max-lg:row-start-1'>
              <div className='mb-5'>
                <p className='mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center'>
                  NFT Performance
                </p>
                <p className='mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center'>
                  Performance metrics for TEST across different time ranges
                </p>
              </div>
              <div className='overflow-x-auto shadow-md rounded-xl border-gray-200'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50' />
                  <tbody className='bg-white divide-y divide-gray-200' />
                </table>
              </div>
              {/* NFT Description */}
              <div className='mt-6 text-lg/8 text-gray-600 max-w-full'>
                <div className='mt-6 text-base text-gray-950 max-w-full'>
                  <h1 className='font-bold text-lg mb-2'>
                    About {exchangeDetails?.name}
                  </h1>
                  <div
                    className='text-sm'
                    dangerouslySetInnerHTML={{
                      __html: exchangeDetails?.description,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Paper
          className='mt-5 mb-20'
          sx={{ height: '100%', width: '100%' }}
          elevation={1}
        >
          <DataGrid
            rows={processedTickers}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20, 30, 40, 50]}
            sx={{
              cursor: 'pointer',
              backgroundColor: '#FFFFFF',
            }}
          />
        </Paper>
        <LogoClouds />
      </div>
    </div>
  );
}

export default CryptoExchangesDetails;
