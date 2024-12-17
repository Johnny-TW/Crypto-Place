import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { GlobeAltIcon, LockClosedIcon, ServerIcon, PaperClipIcon } from '@heroicons/react/20/solid'
import parse from 'html-react-parser';
import axios from "axios";

const convertRangeToDays = (range) => {
  switch (range) {
    case '24h':
      return 1;
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '1y':
      return 365;
    default:
      return 1;
  }
};

const days = ['24h', '7d', '30d', '1y'];

const features = [
  {
    name: 'Website',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Etherscan.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database backups.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ServerIcon,
  },
]

const NFTDetails = () => {
  const { name } = useParams();
  const [nftData, setNftData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;

    const fetchNFTData = async () => {
      try {
        const options = {
          method: "GET",
          url: `https://api.coingecko.com/api/v3/nfts/${name}`,
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": "CG-nrJXAB28gG2xbfsdLieGcxWB",
          },
        };

        const response = await axios.request(options);
        if (isMounted) {
          setNftData(response.data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to fetch NFT data");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

  const chartData = [
    { timePeriod: '24h', percentage: nftData.floor_price_24h_percentage_change.native_currency },
    { timePeriod: '7d', percentage: nftData.floor_price_7d_percentage_change.native_currency },
    { timePeriod: '14d', percentage: nftData.floor_price_14d_percentage_change.native_currency },
    { timePeriod: '30d', percentage: nftData.floor_price_30d_percentage_change.native_currency },
    { timePeriod: '60d', percentage: nftData.floor_price_60d_percentage_change.native_currency },
    { timePeriod: '1y', percentage: nftData.floor_price_1y_percentage_change.native_currency },
  ];

  console.log(chartData)

  return (
    <>
      <div className="overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-1xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <img
                  src={nftData.banner_image}
                  alt={nftData.banner_image}
                  className="max-w-none rounded-xl ring-1 ring-gray-400/10 sm:w-full md:w-full lg:w-[25rem] xl:w-full  xxl:w-full md:-ml-4 lg:-ml-0 shadow-md"
                />
              </div>
              <div className="w-full max-w-full">
                <h2 className="text-base/7 font-semibold text-indigo-600 mt-3">Deploy faster</h2>
                <div className="flex items-center space-x-4 mt-5">
                  <img
                    className="w-20 h-20 rounded-2xl shadow-lg object-cover border-4 border-white"
                    src={nftData.image?.small_2x}
                    alt={nftData.name}
                  />
                  <div className="text-left flex-col items-center space-y-2">
                    <p className="text-pretty text-2xl font-semibold tracking-tight text-gray-900 sm:text-1xl">
                      {nftData.name}
                    </p>
                    <p className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                      {nftData.floor_price.native_currency} {nftData.native_currency_symbol}
                    </p>
                  </div>
                  <div className="text-left flex-col items-center space-y-2 px-5">
                    <p className={`text-3xl font-bold ${nftData.market_cap_24h_percentage_change.native_currency >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                      }`}>
                      {nftData.market_cap_24h_percentage_change.native_currency.toFixed(2)}%
                    </p>
                  </div>
                </div>

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
                          {nftData.market_cap.native_currency} {nftData.native_currency_symbol}
                        </dd>
                      </div>
                      <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-semibold text-gray-900">24h Volume</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {nftData.volume_24h.native_currency} {nftData.native_currency_symbol}
                        </dd>
                      </div>
                      <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-semibold text-gray-900">24h Sales</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {nftData.one_day_sales} {nftData.native_currency_symbol}
                        </dd>
                      </div>
                      <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-semibold text-gray-900">24h Average Sale Price</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {nftData.one_day_average_sale_price}
                        </dd>
                      </div>
                      <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-semibold text-gray-900">Unique Owners</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {nftData.number_of_unique_addresses}
                        </dd>
                      </div>
                      <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-semibold text-gray-900">Total Assets</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {nftData.total_supply}
                        </dd>
                      </div>
                      <div className="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-semibold text-gray-900">All-Time High</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {nftData.ath.native_currency} {nftData.native_currency_symbol}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon aria-hidden="true" className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                        {feature.name}
                      </dt>{''}
                      <br></br>
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 text-lg/8 text-gray-600 text-base max-w-full">
                  <p className="text-sm">
                    {parse(nftData.description)}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pr-8 lg:pt-4">
              <div className="relative max-lg:row-start-1">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10 mb-5">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                    NFT Performance
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Performance metrics for {nftData.name} across different time ranges
                  </p>
                </div>
                <div className="overflow-x-auto shadow-md rounded-xl border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {chartData.map((item, index) => (
                          <th
                            key={index}
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
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
                            className={`px-6 py-4 whitespace-nowrap text-sm ${item.percentage >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                          >
                            {item.percentage.toFixed(2)}%
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTDetails;