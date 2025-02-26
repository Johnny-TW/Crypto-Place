import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobeAltIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import LogoClouds from '@components/common/LogoClouds';
import MediaCard from '@components/common/MediaCard';

function NFTDetails() {
  const { name } = useParams();
  const [nftData, setNftData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchNFTData = async () => {
      try {
        const options = {
          method: 'GET',
          url: `https://api.coingecko.com/api/v3/nfts/${name}`,
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB',
          },
        };

        const response = await axios.request(options);
        if (isMounted) {
          setNftData(response.data);
        }
      } catch (err) {
        // console.error(err);
        if (isMounted) {
          setError('Failed to fetch NFT data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNFTData();

    return () => {
      isMounted = false;
    };
  }, [name]);

  useEffect(() => {
    let isMounted = true;
    const baseUrl = 'https://data-api.cryptocompare.com/news/v1/article/list';
    const params = {
      lang: 'EN',
      limit: 4,
      exclude_categories: 'ETH',
      api_key: 'b1b0f1cbc762734d6003ea2af861dadecdd20ed39e717d8b4a15bf351640488b',
    };
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();

    const options = {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((json) => {
        if (isMounted) {
          setNewsData(json.Data);
        }
      })
      .catch((err) => console.log(err));

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <svg
            className="mx-auto h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // Safely access nested properties with optional chaining
  const chartData = [
    { timePeriod: '24h', percentage: nftData?.floor_price_24h_percentage_change?.native_currency || 0 },
    { timePeriod: '7d', percentage: nftData?.floor_price_7d_percentage_change?.native_currency || 0 },
    { timePeriod: '14d', percentage: nftData?.floor_price_14d_percentage_change?.native_currency || 0 },
    { timePeriod: '30d', percentage: nftData?.floor_price_30d_percentage_change?.native_currency || 0 },
    { timePeriod: '60d', percentage: nftData?.floor_price_60d_percentage_change?.native_currency || 0 },
    { timePeriod: '1y', percentage: nftData?.floor_price_1y_percentage_change?.native_currency || 0 },
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

  console.log(nftData);
  console.log(newsData);

  const percentageChange = nftData?.market_cap_24h_percentage_change?.native_currency || 0;
  const percentageChangeClass = percentageChange >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="overflow-hidden">
      <div className="mx-auto max-w-1xl lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* NFT Performance */}
          <div className="">
            <div className="lg:max-w-lg">
              <img
                src={nftData?.banner_image}
                alt={nftData?.name}
                className="max-w-none rounded-xl ring-1 ring-gray-400/10 sm:w-full md:w-full lg:w-[25rem] xl:w-full  xxl:w-full md:-ml-4 lg:-ml-0 shadow-md"
              />
            </div>
            <div className="w-full max-w-full mt-5">
              <p className="text-pretty text-2xl font-semibold tracking-tight text-gray-900 sm:text-1xl">
                {nftData?.name}
              </p>
              <div className="flex items-center space-x-4 mt-5">
                <img
                  className="w-20 h-20 rounded-2xl shadow-lg object-cover border-4 border-white"
                  src={nftData?.image?.small_2x}
                  alt={nftData?.name}
                />
                <div className="text-left flex-col items-center space-y-2">
                  <p className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {nftData?.floor_price?.native_currency}
                    {' '}
                    {nftData?.native_currency_symbol}
                  </p>
                </div>
                <div className="text-left flex-col items-center space-y-2 px-5">
                  <p className={`text-3xl font-bold ${percentageChangeClass}`}>
                    {percentageChange.toFixed(2)}
                    {' '}
                    %
                  </p>
                </div>
              </div>
              {/* Applicant Information */}
              <div>
                <div className="px-4 sm:px-0 mt-5">
                  <h3 className="text-base/7 font-semibold text-gray-900">Applicant Information</h3>
                  <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details and application.</p>
                </div>
                <div className="mt-6 border-t border-gray-300">
                  <dl className="divide-y divide-gray-300">
                    <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-semibold text-gray-900">Market Cap</dt>
                      <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {nftData?.market_cap?.native_currency}
                        {' '}
                        {nftData?.native_currency_symbol}
                      </dd>
                    </div>
                    <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-semibold text-gray-900">24h Volume</dt>
                      <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {nftData?.volume_24h?.native_currency}
                        {' '}
                        {nftData?.native_currency_symbol}
                      </dd>
                    </div>
                    <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-semibold text-gray-900">24h Sales</dt>
                      <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {nftData?.one_day_sales}
                        {' '}
                        {nftData?.native_currency_symbol}
                      </dd>
                    </div>
                    <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-semibold text-gray-900">24h Average Sale Price</dt>
                      <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {nftData?.one_day_average_sale_price}
                      </dd>
                    </div>
                    <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-semibold text-gray-900">Unique Owners</dt>
                      <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {nftData?.number_of_unique_addresses}
                      </dd>
                    </div>
                    <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-semibold text-gray-900">Total Assets</dt>
                      <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {nftData?.total_supply}
                      </dd>
                    </div>
                    <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-semibold text-gray-900">All-Time High</dt>
                      <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {nftData?.ath?.native_currency}
                        {' '}
                        {nftData?.native_currency_symbol}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              {/* Info Information */}
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {links.map((link) => (
                  <div key={link.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <link.icon aria-hidden="true" className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                      {link.name}
                    </dt>
                    <br />
                    <a className="inline" href={link.link} aria-label={link.name}>
                      {link.link}
                    </a>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="">
            <div className="relative max-lg:row-start-1">
              <div className="mb-5">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  NFT Performance
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Performance metrics for
                  {' '}
                  {nftData?.name}
                  {' '}
                  across different time ranges
                </p>
              </div>
              <div className="overflow-x-auto shadow-md rounded-xl border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {chartData.map((item, index) => (
                        <th
                          key={index}
                          className="px-2 py-2 whitespace-nowrap text-center text-sm font-medium text-gray-900"
                        >
                          {item.timePeriod}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      {chartData.map((item, index) => (
                        <td
                          key={index}
                          className={`px-2 py-2 whitespace-nowrap text-center text-sm ${item.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {item.percentage.toFixed(2)}
                          %
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* NFT Description */}
              <div className="mt-6 text-lg/8 text-gray-600 text-base max-w-full">
                <div className="mt-6 text-base text-gray-600 max-w-full">
                  <h1 className="font-bold text-black text-lg mb-2">
                    About
                    {' '}
                    {nftData?.name}
                  </h1>
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: nftData?.description }}
                  />
                </div>
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
