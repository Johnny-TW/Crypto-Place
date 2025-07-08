/* eslint-disable react/jsx-max-depth */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  GlobeAltIcon,
  LockClosedIcon,
  ServerIcon,
} from '@heroicons/react/20/solid';

import LogoClouds from '@components/common/LogoClouds';
import MediaCard from '@components/common/MediaCard';
import PerformanceTable from '@components/nft/PerformanceTable';
import NFTInfoSection from '@components/nft/NFTInfoSection';
import NFTLinksSection from '@components/nft/NFTLinksSection';
import { fetchNftDetails, fetchNftNews } from '../redux/saga/nftDetails';

function NFTDetails() {
  const { name } = useParams();
  const dispatch = useDispatch();

  const { nftData, newsData, loading, error } = useSelector(
    state =>
      state.nftDetails || {
        nftData: {},
        newsData: [],
        loading: false,
        newsLoading: false,
        error: null,
        newsError: null,
      }
  );

  useEffect(() => {
    if (name) {
      dispatch(fetchNftDetails(name));
    }
  }, [dispatch, name]);

  useEffect(() => {
    dispatch(fetchNftNews());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen bg-red-50'>
        <div className='text-center bg-white p-8 rounded-xl shadow-lg'>
          <svg
            className='mx-auto h-16 w-16 text-red-500 mb-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h2 className='text-2xl font-bold text-red-600 mb-2'>Error</h2>
          <p className='text-gray-700'>{error}</p>
        </div>
      </div>
    );
  }

  // Safely access nested properties with optional chaining
  const chartData = [
    {
      timePeriod: '24h',
      percentage:
        nftData?.floor_price_24h_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '7d',
      percentage:
        nftData?.floor_price_7d_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '14d',
      percentage:
        nftData?.floor_price_14d_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '30d',
      percentage:
        nftData?.floor_price_30d_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '60d',
      percentage:
        nftData?.floor_price_60d_percentage_change?.native_currency || 0,
    },
    {
      timePeriod: '1y',
      percentage:
        nftData?.floor_price_1y_percentage_change?.native_currency || 0,
    },
  ];

  const links = [
    {
      name: 'Website',
      link: nftData?.links?.homepage || '#',
      icon: GlobeAltIcon,
    },
    {
      name: 'Discord',
      link: nftData?.links?.discord || '#',
      icon: LockClosedIcon,
    },
    {
      name: 'Twitter',
      link: nftData?.links?.twitter || '#',
      icon: ServerIcon,
    },
  ];

  const percentageChange =
    nftData?.market_cap_24h_percentage_change?.native_currency || 0;
  const percentageChangeClass =
    percentageChange >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className='overflow-hidden'>
      <div className='mx-auto max-w-1xl lg:px-8'>
        <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2'>
          {/* NFT Performance */}
          <div className=''>
            <div className='lg:max-w-lg'>
              <img
                src={nftData?.banner_image}
                alt={nftData?.name}
                className='max-w-none rounded-xl ring-1 ring-gray-400/10 sm:w-full md:w-full lg:w-[25rem] xl:w-full  xxl:w-full md:-ml-4 lg:-ml-0 shadow-md'
              />
            </div>
            <div className='w-full max-w-full mt-5'>
              <p className='text-pretty text-2xl font-semibold tracking-tight text-gray-900 sm:text-1xl'>
                {nftData?.name}
              </p>
              <div className='flex items-center space-x-4 mt-5'>
                <img
                  className='w-20 h-20 rounded-2xl shadow-lg object-cover border-4 border-white'
                  src={nftData?.image?.small_2x}
                  alt={nftData?.name}
                />
                <div className='text-left flex-col items-center space-y-2'>
                  <p className='text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
                    {nftData?.floor_price?.native_currency}{' '}
                    {nftData?.native_currency_symbol}
                  </p>
                </div>
                <p
                  className={`text-3xl font-bold px-5 ${percentageChangeClass}`}
                >
                  {percentageChange.toFixed(2)} %
                </p>
              </div>
              {/* Applicant Information */}
              <NFTInfoSection nftData={nftData} />
              {/* Info Information */}
              <NFTLinksSection links={links} />
            </div>
          </div>
          <div className=''>
            <div className='relative max-lg:row-start-1'>
              <div className='mb-5'>
                <p className='mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center'>
                  NFT Performance
                </p>
                <p className='mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center'>
                  Performance metrics for {nftData?.name} across different time
                  ranges
                </p>
              </div>
              <PerformanceTable chartData={chartData} />
              {/* NFT Description */}
              <div className='mt-6 text-base text-gray-600 max-w-full'>
                <h1 className='font-bold text-black text-lg mb-2'>
                  About {nftData?.name}
                </h1>
                <div
                  className='text-sm'
                  dangerouslySetInnerHTML={{ __html: nftData?.description }}
                />
              </div>
            </div>
          </div>
        </div>
        <MediaCard newsData={newsData} />
        <LogoClouds />
      </div>
    </div>
  );
}

export default NFTDetails;
